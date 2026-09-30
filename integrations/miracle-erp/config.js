/**
 * Miracle Cloud ERP API Configuration
 * 
 * Replace placeholder values with your production/staging credentials
 * generated from Miracle Cloud ERP:
 * Partner Login -> Setup -> TPA Setup -> TPA User Setup
 */
module.exports = {
  baseUrl: process.env.MIRACLE_BASE_URL || 'https://tpaapi.miracleclouderp.com/',
  urlKey: process.env.MIRACLE_URL_KEY || 'wzlok1yokd',
  username: 'KESHAV',
  clientId: process.env.MIRACLE_CLIENT_ID || 'CL8b2a8da6e6944779b5',
  apiKey: process.env.MIRACLE_API_KEY || '1708446799c74639bdb61eac832deb530aae973f0c0d4a758da15486bfd591a6',

  // Default voucher mapping settings for Shopify orders
  salesVoucherType: 'S', // S = Sales Invoice / Voucher
  salesOrderType: 'SO', // SO = Sales Order
  defaultCustomerGroup: 'Sundry Debtors',
  defaultState: 'Gujarat',
  defaultAccountBalMethod: 'Bill to Bill'
};
