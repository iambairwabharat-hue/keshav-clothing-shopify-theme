const MiracleERPClient = require('./miracle_client');

async function runExperiments() {
  const client = new MiracleERPClient();
  await client.authenticate();

  console.log('=== EXPERIMENT 1: regtypedet variations ===');
  const regTypeCandidates = [
    [],
    [{ regtype: 'Unregistered' }],
    [{ regstyp: 'Unregistered' }],
    [{ registrationtype: 'Unregistered' }],
    [{ gstregtype: 'Unregistered' }],
    [{ regtypnm: 'Unregistered' }],
    [{ type: 'Unregistered' }],
    [{ gsttype: 'Unregistered' }],
    [{ name: 'Unregistered' }],
    [{ reg_type: 'Unregistered' }],
    [{ registration_type: 'Unregistered' }],
  ];

  for (let i = 0; i < regTypeCandidates.length; i++) {
    const candidate = regTypeCandidates[i];
    const payload = {
      action: 'A',
      accnm: `Test Acc ${Date.now()}`,
      accgrpnm: 'Sundry Debtors',
      balmethod: 'Bill to Bill',
      regtypedet: candidate,
      addr: { statenm: 'Gujarat', citynm: 'Surat', pincode: '395001' }
    };

    const res = await client.post('TPA/M2/V1/Account', payload);
    if (!res.IsError) {
      console.log(`✅ SUCCESS for regtypedet:`, JSON.stringify(candidate), '=> Response:', res);
      break;
    } else {
      console.log(`❌ FAIL for regtypedet:`, JSON.stringify(candidate), `[${res.ErrorCode}]: ${res.Message}`);
    }
  }

  console.log('\n=== EXPERIMENT 2: Voucher Type & Origin variations ===');
  const voucherTypeCandidates = [
    { origin: 'SL', voutyp: 'Sales' },
    { origin: 'SL', voutyp: 'Sales Voucher' },
    { origin: 'SL', voutyp: 'Tax Invoice' },
    { origin: 'SL', voutyp: 'Retail Invoice' },
    { origin: 'SL', voutyp: 'GST Invoice' },
    { origin: 'SL', voutyp: 'Sales Bill' },
    { origin: 'SL', voutyp: 'Invoice' },
    { origin: 'S', voutyp: 'Sales Invoice' },
    { origin: 'S', voutyp: 'Sales' },
    { origin: 'S', voutyp: 'Tax Invoice' },
    { origin: 'SALES', voutyp: 'Sales Invoice' },
    { origin: 'SO', voutyp: 'Sales Order' },
  ];

  for (const item of voucherTypeCandidates) {
    const payload = {
      action: 'A',
      origin: item.origin,
      voutyp: item.voutyp,
      vouno: `TEST-${Date.now()}`,
      voudt: new Date().toISOString().split('T')[0],
      accnm: 'Cash Account',
      netamt: 100,
      det: [{ pname: 'Test Item', qty: 1, rate: 100, amt: 100 }]
    };

    const res = await client.post('TPA/M2/V1/Voucher', payload);
    if (!res.IsError) {
      console.log(`✅ SUCCESS for voucher:`, item, '=> Response:', res);
      break;
    } else {
      console.log(`❌ FAIL for voucher:`, item, `[${res.ErrorCode}]: ${res.Message}`);
      if (res.DataModel) console.log('   DataModel:', JSON.stringify(res.DataModel));
    }
  }
}

runExperiments().catch(err => console.error(err));
