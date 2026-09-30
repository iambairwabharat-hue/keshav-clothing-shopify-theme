const MiracleERPClient = require('./miracle_client');

// Discover remaining valid Product fields — now we know prdnm works
// Test 411 (wrong type) and 422 (missing mandatory) errors reveal valid fields
async function discoverMoreProductFields() {
  const client = new MiracleERPClient();
  await client.authenticate();

  // Focus on fields that returned 411 (valid field, wrong type) — we know: salrate, purrate, gstper
  // Now try more variations to find all fields
  const fieldGuesses = [
    // We know salrate, purrate, gstper are valid — find others
    'mrprate', 'mrp', 'mrprt', 'salerate', 'salert', 'srp',
    'salrate2', 'salrate3', 'prdmrp', 'prdsal', 'prdpur',
    'salrte2', 'srate2',
    // Unit fields  
    'prduom', 'prdunit', 'uomnm', 'untnm', 'unm',
    // Group
    'prdcat', 'catgrpnm', 'catgrp', 'subgrpnm',
    // HSN related
    'hsncd', 'hsncde', 'hsncode2',
    // Other number fields
    'opnqty', 'opnstk', 'opstock', 'opstk',
    'reordlvl', 'minlvl', 'maxlvl',
    // Barcode/SKU
    'barcd', 'bcd', 'skucd', 'prdalias2', 'palias2',
    // company
    'cmpnm', 'cmpy', 'cmpyname',
    // Additional rates
    'gstrate2', 'igst', 'cgst', 'sgst',
    'gstper2', 'cessper',
    'gstno', 'taxcode', 'taxcd'
  ];

  let valid = [];

  for (const field of fieldGuesses) {
    const payload = { action: 'A', prdnm: `Test-${field}`, [field]: 'TestValue' };
    const res = await client.post('TPA/M2/V1/Product', payload);
    if (!res.IsError) {
      console.log(`✅ "${field}" works!`, res.UniqueId);
      valid.push({ field, result: 'success' });
    } else if (res.ErrorCode === '411') {
      console.log(`⚠️ [411 TYPE ERROR] "${field}" is VALID but needs a number`);
      valid.push({ field, result: 'type_error' });
    } else if (res.ErrorCode === '422') {
      console.log(`⚠️ [422 MANDATORY MISSING] "${field}" is VALID`);
      valid.push({ field, result: 'mandatory_missing' });
    }
    // 410 = invalid field — skip
  }

  console.log('\n=== RESULTS ===');
  console.log(JSON.stringify(valid, null, 2));
}

discoverMoreProductFields().catch(err => console.error(err));
