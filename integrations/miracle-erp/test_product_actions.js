const MiracleERPClient = require('./miracle_client');

async function testActions() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const actions = ['S', 'G', 'L', 'Q', 'V', 'I', 'ST', 'GET', 'VIEW', 'QUERY', 'FETCH', 'STOCK', 'C', 'F'];

  for (const act of actions) {
    const payload = {
      action: act,
      pname: 'Keshav Tee'
    };

    const res = await client.post('TPA/M2/V1/Product', payload);
    console.log(`Action "${act}" => [${res.ErrorCode || 'OK'}]: ${res.Message}`);
    if (!res.IsError || res.DataModel) {
      console.log('   Response Data:', JSON.stringify(res, null, 2));
    }
  }
}

testActions().catch(err => console.error(err));
