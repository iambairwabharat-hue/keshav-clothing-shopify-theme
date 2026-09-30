const MiracleERPClient = require('./miracle_client');

async function probeProductFields() {
  const client = new MiracleERPClient();
  await client.authenticate();

  // Probe which fields are valid on Product endpoint with 'A' action
  // by sending them one at a time
  const fieldSets = [
    // Basic name fields
    { action: 'A', productname: 'Keshav Tee' },
    { action: 'A', name: 'Keshav Tee' },
    { action: 'A', itemname: 'Keshav Tee' },
    { action: 'A', item: 'Keshav Tee' },
    { action: 'A', product: 'Keshav Tee' },
    { action: 'A', prodnm: 'Keshav Tee' },
    { action: 'A', itemnm: 'Keshav Tee' },
    { action: 'A', productnm: 'Keshav Tee' },
    { action: 'A', prod_name: 'Keshav Tee' },
    { action: 'A', prod_nm: 'Keshav Tee' },
  ];

  for (const payload of fieldSets) {
    const res = await client.post('TPA/M2/V1/Product', payload);
    const field = Object.keys(payload).find(k => k !== 'action');
    if (!res.IsError) {
      console.log(`✅ ${field} works! Response:`, JSON.stringify(res));
    } else if (res.ErrorCode === '422') {
      console.log(`⚠️ [422 MANDATORY MISSING] field "${field}" is VALID - other fields are missing`);
    } else {
      console.log(`❌ ${field}: [${res.ErrorCode}]: ${res.Message}`);
    }
  }
}

probeProductFields().catch(err => console.error(err));
