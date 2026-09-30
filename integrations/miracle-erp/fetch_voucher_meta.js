const MiracleERPClient = require('./miracle_client');

// Attempt to fetch existing voucher data from the company to discover valid voutyp names
// Try different GET endpoints and patterns
async function fetchVoucherMeta() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const endpointsToTry = [
    // Variations on fetching voucher-related configuration
    'TPA/M2/V1/GetVoucher',
    'TPA/M2/V1/VoucherType',
    'TPA/M2/V1/VoucherTypes',
    'TPA/M2/V1/GetVoucherSeries',
    'TPA/M2/V1/GetSalesSeries',
    'TPA/M2/V1/GetSeriesList',
    'TPA/M2/V1/GetMaster',
    'TPA/M2/V1/GetMasters',
    'TPA/M2/V1/GetSetupMaster',
    'TPA/M2/V1/GetCompanyDetails',
    'TPA/M2/V1/CompanyDetails',
    'TPA/M2/V1/GetCompanyMaster',
    'TPA/M2/V1/GetLedgerList',
    'TPA/M2/V1/GetGroupList',
    'TPA/M2/V1/GetGroup',
    'TPA/M2/V1/GetGroups',
    'TPA/M2/V1/Account', // POST only — skip
    'TPA/M2/V1/GetAccountMaster',
    'TPA/M2/V1/Voucher',  // POST only — skip
    'TPA/M2/V1/GetVoucherList',
    'TPA/M2/V1/GetVoucherNo',
    'TPA/M2/V1/GetVoucherAutoNo',
    'TPA/M2/V1/GetMaxVoucherNo',
    'TPA/M2/V1/VoucherSeriesList',
    'TPA/M2/V1/SalesVoucher',
    'TPA/M2/V1/GetSalesVoucherTypes',
    'TPA/M2/V1/SalesVoucherTypes'
  ];

  console.log('Probing GET endpoints...');
  for (const ep of endpointsToTry) {
    try {
      const res = await client.get(ep);
      if (res && !res.Message?.includes('No HTTP resource was found')) {
        console.log(`✅ [GET 200] ${ep}:`, JSON.stringify(res).slice(0, 400));
      }
    } catch (err) {
      if (err.response && err.response.status !== 404 && err.response.status !== 405) {
        console.log(`⚠️ [GET ${err.response.status}] ${ep}:`, err.response.data);
      }
    }
  }

  // Also try POST variations
  console.log('\nProbing POST endpoints with action G (get)...');
  const postEndpoints = [
    'TPA/M2/V1/VoucherType',
    'TPA/M2/V1/VoucherSeries',
    'TPA/M2/V1/GetVoucherType',
  ];
  for (const ep of postEndpoints) {
    try {
      const res = await client.post(ep, { action: 'G' });
      console.log(`✅ [POST 200] ${ep}:`, JSON.stringify(res).slice(0, 400));
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.log(`⚠️ [POST ${err.response.status}] ${ep}:`, err.response.data);
      }
    }
  }
}

fetchVoucherMeta().catch(err => console.error(err));
