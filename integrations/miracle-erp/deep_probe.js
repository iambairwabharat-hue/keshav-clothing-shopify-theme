const MiracleERPClient = require('./miracle_client');

async function deepProbe() {
  const client = new MiracleERPClient();
  await client.authenticate();

  // --- Test 1: Send Voucher with NO voutyp/origin at all — see which fields are mandatory ---
  console.log('\n=== Test 1: Voucher with NO voutyp/origin ===');
  const r1 = await client.post('TPA/M2/V1/Voucher', {
    action: 'A',
    vouno: 'T-001',
    voudt: new Date().toISOString().split('T')[0],
    accnm: 'Test Customer 1010',
    netamt: 100,
    det: [{ pname: 'Keshav Tee', qty: 1, rate: 100, amt: 100 }]
  });
  console.log('Result:', JSON.stringify(r1, null, 2));

  // --- Test 2: Voucher with origin but no voutyp ---
  console.log('\n=== Test 2: Voucher with origin but no voutyp ===');
  const r2 = await client.post('TPA/M2/V1/Voucher', {
    action: 'A',
    origin: 'SL',
    vouno: 'T-002',
    voudt: new Date().toISOString().split('T')[0],
    accnm: 'Test Customer 1010',
    netamt: 100,
    det: [{ pname: 'Keshav Tee', qty: 1, rate: 100, amt: 100 }]
  });
  console.log('Result:', JSON.stringify(r2, null, 2));

  // --- Test 3: Add product to Miracle ERP ---
  console.log('\n=== Test 3: Add product (Keshav Oversized Tee) ===');
  const r3 = await client.post('TPA/M2/V1/Product', {
    action: 'A',
    pname: 'Keshav Oversized Tee',
    palias: 'KESHAV-OVR-TEE',
    salert: 1299,
    mrp: 1299,
    gstrt: 12
  });
  console.log('Result:', JSON.stringify(r3, null, 2));

  // --- Test 4: Try Account endpoint with 'S' (search/stock?) action ---
  console.log('\n=== Test 4: Account with action S ===');
  const r4 = await client.post('TPA/M2/V1/Account', {
    action: 'S',
    accnm: 'Test'
  });
  console.log('Result:', JSON.stringify(r4, null, 2));

  // --- Test 5: Voucher endpoint - try action 'S' (like search/list) ---
  console.log('\n=== Test 5: Voucher with action S ===');
  const r5 = await client.post('TPA/M2/V1/Voucher', {
    action: 'S'
  });
  console.log('Result:', JSON.stringify(r5, null, 2));
}

deepProbe().catch(err => console.error('Error:', err.message));
