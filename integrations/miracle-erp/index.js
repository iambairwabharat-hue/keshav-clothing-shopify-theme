const express = require('express');
const { handleShopifyOrderCreated, syncStockFromMiracleToShopify } = require('./shopify_webhook_handler');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Health Check
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Shopify <-> Miracle Cloud ERP Integration Middleware v1.3',
    timestamp: new Date().toISOString()
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Miracle ERP Middleware] Server listening on port ${PORT}`);
  });
}

module.exports = app;
