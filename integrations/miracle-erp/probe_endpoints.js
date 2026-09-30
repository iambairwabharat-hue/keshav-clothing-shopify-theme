const MiracleERPClient = require('./miracle_client');

async function probeEndpoints() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const endpoints = [
    'TPA/M2/V1/GetAccountList',
    'TPA/M2/V1/GetProductList',
    'TPA/M2/V1/GetVoucherTypeList',
    'TPA/M2/V1/GetVoucherType',
    'TPA/M2/V1/GetVoucherTypes',
    'TPA/M2/V1/GetCompany',
    'TPA/M2/V1/GetCompanyInfo',
    'TPA/M2/V1/GetCompanyList',
    'TPA/M2/V1/GetBranchList',
    'TPA/M2/V1/GetSetup',
    'TPA/M2/V1/GetConfig',
    'TPA/M2/V1/GetVoucherList'
  ];

  for (const ep of endpoints) {
    try {
      const res = await client.get(ep);
      console.log(`✅ [200 OK] ${ep} =>`, typeof res === 'object' ? JSON.stringify(res).slice(0, 300) : res);
    } catch (err) {
      console.log(`❌ [${err.response ? err.response.status : err.message}] ${ep}`);
    }
  }
}

probeEndpoints().catch(err => console.error(err));
