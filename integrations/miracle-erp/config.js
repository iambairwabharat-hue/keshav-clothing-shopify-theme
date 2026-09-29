/**
 * Miracle Cloud ERP API Configuration
 * 
 * Replace placeholder values with your production/staging credentials
 * generated from Miracle Cloud ERP:
 * Partner Login -> Setup -> TPA Setup -> TPA User Setup
 */
module.exports = {
  baseUrl: process.env.MIRACLE_BASE_URL || 'https://tpaapi.miracleclouderp.com/',
  urlKey: process.env.MIRACLE_URL_KEY || 'MKYOURURLKEY',
  clientId: process.env.MIRACLE_CLIENT_ID || 'CLYOURCLIENTID',
  apiKey: process.env.MIRACLE_API_KEY || 'AKYOURAPIKEY',

  // Default voucher mapping settings for Shopify orders
  salesVoucherType: 'S', // S = Sales Invoice / Voucher
  salesOrderType: 'SO', // SO = Sales Order
  defaultCustomerGroup: 'Sundry Debtors',
  defaultState: 'Gujarat',
  defaultAccountBalMethod: 'Bill to Bill'
};
