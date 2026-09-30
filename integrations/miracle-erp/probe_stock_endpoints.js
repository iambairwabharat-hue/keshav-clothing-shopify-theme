const MiracleERPClient = require('./miracle_client');

async function probeStockEndpoints() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const candidates = [
    'TPA/M2/V1/GetProductStock',
    'TPA/M2/V1/GetStock',
    'TPA/M2/V1/GetItemStock',
    'TPA/M2/V1/GetStockList',
    'TPA/M2/V1/GetInventory',
    'TPA/M2/V1/ProductStock',
    'TPA/M2/V1/Stock',
    'TPA/M2/V1/GetProduct',
    'TPA/M2/V1/Product',
    'TPA/M2/V1/ProductList',
    'TPA/M2/V1/GetProducts',
    'TPA/M2/V1/GetClosingStock',
    'TPA/M2/V1/ClosingStock'
  ];

  console.log('Testing GET stock endpoints...');
  for (const ep of candidates) {
    try {
      const res = await client.get(ep);
      console.log(`✅ [GET 200 OK] ${ep} =>`, typeof res === 'object' ? JSON.stringify(res).slice(0, 300) : res);
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.log(`⚠️ [GET ${err.response.status}] ${ep} =>`, err.response.data);
      } else {
        console.log(`❌ [404] GET ${ep}`);
      }
    }
  }

  console.log('\nTesting POST stock endpoints...');
  for (const ep of candidates) {
    try {
      const res = await client.post(ep, { product: 'Tee' });
      console.log(`✅ [POST 200 OK] ${ep} =>`, typeof res === 'object' ? JSON.stringify(res).slice(0, 300) : res);
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        console.log(`⚠️ [POST ${err.response.status}] ${ep} =>`, err.response.data);
      } else {
        console.log(`❌ [404] POST ${ep}`);
      }
    }
  }
}

probeStockEndpoints().catch(err => console.error(err));
