const express = require('express');
const { handleShopifyOrderCreated, syncStockFromMiracleToShopify } = require('./shopify_webhook_handler');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health Check
app.get('/health', (req, res) => {
  const config = require('./config');
  res.json({
    status: 'online',
    service: 'Shopify <-> Miracle Cloud ERP Integration Middleware v1.4',
    timestamp: new Date().toISOString(),
    config: {
      urlKey: config.urlKey,
      salesVoucherOrigin: config.salesVoucherOrigin,
      salesVoucherType: config.salesVoucherType,
      defaultCustomerGroup: config.defaultCustomerGroup
    }
  });
});

// Shopify Webhook: Orders Create
app.post('/webhooks/shopify/orders-create', async (req, res) => {
  try {
    const shopifyOrder = req.body;
    const result = await handleShopifyOrderCreated(shopifyOrder);
    res.status(200).json(result);
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Trigger Manual Stock Sync
app.post('/sync/stock', async (req, res) => {
  try {
    const { sku } = req.body;
    const stock = await syncStockFromMiracleToShopify(sku);
    res.json({ success: true, stock });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug: List Voucher Types configured in Miracle ERP
const MiracleERPClient = require('./miracle_client');
const config = require('./config');
const debugClient = new MiracleERPClient();

app.get('/debug/voucher-types', async (req, res) => {
  try {
    const result = await debugClient.getVoucherTypes(req.query.origin || 'SL');
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Debug: Test a specific voucher type
app.get('/debug/test-voucher-type', async (req, res) => {
  const { voutyp, origin } = req.query;
  if (!voutyp) return res.status(400).json({ error: 'Pass ?voutyp=YourVoucherTypeName' });
  try {
    const result = await debugClient.post('TPA/M2/V1/Voucher', {
      action: 'A',
      origin: origin || config.salesVoucherOrigin,
      voutyp: voutyp,
      vouno: `TEST-${Date.now()}`,
      voudt: new Date().toISOString().split('T')[0],
      accnm: 'Shopify Retail Customer',
      netamt: 1,
      det: [{ prdnm: 'Test Item', qty: 1, rate: 1, amt: 1 }]
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update voucher type config at runtime (POST /config with JSON body)
app.post('/config', (req, res) => {
  const { salesVoucherType, salesVoucherOrigin } = req.body;
  if (salesVoucherType) {
    config.salesVoucherType = salesVoucherType;
    console.log(`[Config] salesVoucherType updated to: "${salesVoucherType}"`);
  }
  if (salesVoucherOrigin) {
    config.salesVoucherOrigin = salesVoucherOrigin;
    console.log(`[Config] salesVoucherOrigin updated to: "${salesVoucherOrigin}"`);
  }
  res.json({ success: true, config: { salesVoucherType: config.salesVoucherType, salesVoucherOrigin: config.salesVoucherOrigin } });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Miracle ERP Middleware] Server listening on port ${PORT}`);
  });
}

module.exports = app;
