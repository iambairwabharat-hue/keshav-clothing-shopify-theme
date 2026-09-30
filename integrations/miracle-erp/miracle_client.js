const axios = require('axios');
const https = require('https');
const config = require('./config');

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

/**
 * Miracle Cloud ERP TPA API Client (v1.3)
 */
class MiracleERPClient {
  constructor(cfg = {}) {
    this.baseUrl = cfg.baseUrl || config.baseUrl;
    this.urlKey = cfg.urlKey || config.urlKey;
    this.clientId = cfg.clientId || config.clientId;
    this.apiKey = cfg.apiKey || config.apiKey;

    this.authToken = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * Section 5: Authenticate and obtain OAuth Bearer Token
   * POST {baseurl}CLAuth/Authenticate?urlKey={urlKey}
   * Headers: clientId, apiKey
   */
  async authenticate() {
    try {
      const url = `${this.baseUrl}CLAuth/Authenticate?urlKey=${encodeURIComponent(this.urlKey)}`;
      const response = await axios.post(url, null, {
        headers: {
          'clientId': this.clientId,
          'apiKey': this.apiKey
        },
        httpsAgent
      });

      const { data } = response;
      if (data && !data.IsError && data.DataModel && data.DataModel.token) {
        this.authToken = data.DataModel.token;
        // Token lifetime cache (valid for current session)
        this.tokenExpiresAt = Date.now() + (23 * 60 * 60 * 1000); 
        console.log('[Miracle ERP] Authenticated successfully.');
        return this.authToken;
      } else {
        throw new Error(data.Message || 'Authentication failed with Miracle ERP.');
      }
    } catch (err) {
      console.error('[Miracle ERP Auth Error]:', err.response ? err.response.data : err.message);
      throw err;
    }
  }

  /**
   * Get valid Bearer Token (auto-reauthenticates if expired)
   */
  async getValidToken() {
    if (!this.authToken || Date.now() >= this.tokenExpiresAt) {
      await this.authenticate();
    }
    return this.authToken;
  }

  /**
   * Helper for authorized POST requests
   */
  async post(endpointPath, payload) {
    const token = await this.getValidToken();
    const url = `${this.baseUrl}${endpointPath.replace(/^\//, '')}`;

    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        httpsAgent
      });

      const data = response.data;
      if (data.IsError) {
        console.warn(`[Miracle ERP Error ${data.ErrorCode}]: ${data.Message}`);
      }
      return data;
    } catch (err) {
      // Re-authenticate once if 401 Unauthorized
      if (err.response && err.response.status === 401) {
        console.log('[Miracle ERP] Token expired, re-authenticating...');
        this.authToken = null;
        return this.post(endpointPath, payload);
      }
      throw err;
    }
  }

  /**
   * Helper for authorized GET requests
   */
  async get(endpointPath, params = {}) {
    const token = await this.getValidToken();
    const url = `${this.baseUrl}${endpointPath.replace(/^\//, '')}`;

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params,
        httpsAgent
      });
      return response.data;
    } catch (err) {
      if (err.response && err.response.status === 401) {
        this.authToken = null;
        return this.get(endpointPath, params);
      }
      throw err;
    }
  }

  /**
   * Section 6: Sync Account Master (Customer / Supplier)
   * POST TPA/M2/V1/Account
   */
  async upsertAccount(accountData) {
    const payload = {
      action: accountData.uniqueId ? 'E' : 'A',
      accnm: accountData.name,
      accgrpnm: accountData.groupName || config.defaultCustomerGroup,
      balmethod: accountData.balMethod || config.defaultAccountBalMethod,
      addr: {
        statenm: accountData.state || config.defaultState,
        citynm: accountData.city || '',
        pincode: accountData.pincode || '',
        addr1: accountData.address1 || '',
        addr2: accountData.address2 || '',
        mob1: accountData.mobile || '',
        email: accountData.email || ''
      },
      gstin: accountData.gstin || '',
      panno: accountData.pan || '',
      ...accountData.extra
    };

    if (accountData.uniqueId) {
      payload.uniqueId = accountData.uniqueId;
    }

    return await this.post('TPA/M2/V1/Account', payload);
  }

  /**
   * Section 7: Sync Product Master
   * POST TPA/M2/V1/Product
   */
  async upsertProduct(productData) {
    const payload = {
      action: productData.uniqueId ? 'E' : 'A',
      pname: productData.name,
      compnm: productData.company || '',
      palias: productData.sku || '',
      salert: productData.price || 0,
      purrt: productData.costPrice || 0,
      mrp: productData.mrp || productData.price || 0,
      hsno: productData.hsnCode || '',
      gstrt: productData.gstRate || 18,
      ...productData.extra
    };

    if (productData.uniqueId) {
      payload.uniqueId = productData.uniqueId;
    }

    return await this.post('TPA/M2/V1/Product', payload);
  }

  /**
   * Section 8: Create Sales Voucher / Sales Order for Shopify Order
   * POST TPA/M2/V1/Voucher
   */
  async createSalesVoucher(shopifyOrder) {
    const items = (shopifyOrder.line_items || []).map(item => ({
      pname: item.name || item.title,
      qty: item.quantity,
      rate: parseFloat(item.price),
      amt: parseFloat(item.price) * item.quantity,
      hsno: item.hsn || '',
      gstrt: item.gst_rate || 18
    }));

    const customerName = shopifyOrder.customer
      ? `${shopifyOrder.customer.first_name || ''} ${shopifyOrder.customer.last_name || ''}`.trim() || 'Shopify Retail Customer'
      : 'Shopify Retail Customer';

    const payload = {
      action: 'A',
      origin: config.salesVoucherType, // 'S' for Sales Voucher
      vouno: String(shopifyOrder.order_number || shopifyOrder.name),
      voudt: new Date(shopifyOrder.created_at || Date.now()).toISOString().split('T')[0],
      accnm: customerName,
      netamt: parseFloat(shopifyOrder.total_price),
      det: items,
      ufddet: {
        'SHOPIFY_ORDER_ID': String(shopifyOrder.id),
        'PAYMENT_GATEWAY': shopifyOrder.gateway || 'Online'
      }
    };

    return await this.post('TPA/M2/V1/Voucher', payload);
  }

  /**
   * Section 10: Fetch Inventory Stock / Product Opening
   * GET TPA/M2/V1/GetProductOpening
   */
  async getProductStock(productNameOrSku) {
    return await this.get('TPA/M2/V1/GetProductOpening', {
      product: productNameOrSku
    });
  }

  /**
   * Section 18: Get Branch List
   * GET TPA/M2/V1/GetBranchList
   */
  async getBranchList() {
    return await this.get('TPA/M2/V1/GetBranchList');
  }
}

module.exports = MiracleERPClient;
