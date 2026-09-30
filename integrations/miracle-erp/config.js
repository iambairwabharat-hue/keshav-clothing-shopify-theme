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

  // Voucher type mapping for Shopify → Miracle ERP Sales Voucher
  // `origin`  → Module code sent as 'origin' field  (e.g. 'SL' = Sales Ledger)
  // `voutyp`  → Voucher Type name as configured in Miracle ERP (e.g. 'Sales Invoice')
  salesVoucherOrigin: process.env.MIRACLE_VOUCHER_ORIGIN || 'SL',
  salesVoucherType: process.env.MIRACLE_VOUCHER_TYPE || 'Sales Invoice',
  salesOrderType: 'SO', // SO = Sales Order

  // Account (Customer) defaults for B2C Shopify customers
  defaultCustomerGroup: 'Sundry Debtors',
  defaultState: 'Gujarat',
  defaultAccountBalMethod: 'Bill to Bill',
  // GST registration type for retail (B2C unregistered) customers
  // regtypedet = List<RegistrationTypeDetail> — must be a JSON array with `regtype` property
  defaultRegistrationDetail: [
    { regtype: process.env.MIRACLE_REG_TYPE || 'Unregistered' }
  ]
};
