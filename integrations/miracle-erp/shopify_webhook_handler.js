const MiracleERPClient = require('./miracle_client');

const miracleClient = new MiracleERPClient();

/**
 * Handle Incoming Shopify Order Creation Webhook
 * Syncs customer account and creates a Sales Voucher in Miracle Cloud ERP
 */
async function handleShopifyOrderCreated(shopifyOrder) {
  console.log(`[Integration] Processing Shopify Order #${shopifyOrder.order_number || shopifyOrder.name}`);

  try {
    // 1. Ensure Customer Account exists in Miracle Cloud ERP
    if (shopifyOrder.customer) {
      const customer = shopifyOrder.customer;
      const address = shopifyOrder.shipping_address || shopifyOrder.billing_address || {};
      
      const accountResult = await miracleClient.upsertAccount({
        name: `${customer.first_name || ''} ${customer.last_name || ''}`.trim() || 'Shopify Retail Customer',
        email: customer.email,
        mobile: customer.phone || address.phone || '',
        state: address.province || 'Gujarat',
        city: address.city || '',
        pincode: address.zip || '',
        address1: address.address1 || '',
        address2: address.address2 || ''
      });

      console.log('[Integration] Customer Account synced with Miracle ERP:', accountResult);
    }

    // 2. Create Sales Voucher in Miracle Cloud ERP
    const voucherResult = await miracleClient.createSalesVoucher(shopifyOrder);
    
    if (voucherResult && !voucherResult.IsError) {
      console.log(`[Integration] Sales Voucher #${voucherResult.UniqueId} created successfully in Miracle ERP for Order #${shopifyOrder.order_number}`);
      return { success: true, voucherId: voucherResult.UniqueId };
    } else {
      console.error('[Integration] Error creating Sales Voucher:', voucherResult ? voucherResult.Message : 'Unknown error');
      return { success: false, error: voucherResult ? voucherResult.Message : 'Unknown error' };
    }

  } catch (err) {
    console.error('[Integration Exception]:', err.message);
    throw err;
  }
}

/**
 * Sync Miracle Cloud ERP Inventory Stock back to Shopify
 */
async function syncStockFromMiracleToShopify(productSkuOrName) {
  console.log(`[Integration] Fetching stock from Miracle ERP for ${productSkuOrName}`);
  const stockData = await miracleClient.getProductStock(productSkuOrName);
  console.log('[Integration] Received Stock Data from Miracle ERP:', stockData);
  return stockData;
}

module.exports = {
  handleShopifyOrderCreated,
  syncStockFromMiracleToShopify
};
