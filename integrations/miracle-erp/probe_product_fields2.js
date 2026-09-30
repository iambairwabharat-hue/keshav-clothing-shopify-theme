const MiracleERPClient = require('./miracle_client');

// Miracle ERP API field names found in official docs/patterns
async function probeProductFields2() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const fieldGuesses = [
    'pnm', 'prd', 'prname', 'nm', 'prnm', 'piname', 'pin',
    'iname', 'itmname', 'itmn', 'itmno', 'itmnum', 'itemno',
    'itemnum', 'stockname', 'stkname', 'stkn', 'godown',
    'grp', 'grpnm', 'pgrp', 'pgrpnm', 'unit', 'unitnm',
    'tax', 'taxrate', 'taxrt', 'rate', 'price', 'salerate',
    'purchrate', 'costrate', 'openqty', 'openamt', 'openrate',
    'batchno', 'batch', 'serial', 'serialno', 'barcode',
    'description', 'desc', 'remarks', 'remark',
    'pcode', 'scode', 'code', 'shortcode', 'alias',
    'category', 'cat', 'brand', 'company', 'compnm',
    'hsncode', 'hsn', 'saccode', 'sac'
  ];

  let validFields = [];
  let mandatoryMissing = [];

  for (const field of fieldGuesses) {
    const payload = { action: 'A', [field]: 'TestValue' };
    const res = await client.post('TPA/M2/V1/Product', payload);
    if (!res.IsError) {
      console.log(`✅ "${field}" works!`);
      validFields.push(field);
    } else if (res.ErrorCode === '422') {
      console.log(`⚠️ [422] "${field}" is VALID (other mandatory fields missing)`);
      mandatoryMissing.push(field);
    } else if (res.ErrorCode === '416') {
      console.log(`⚠️ [416] "${field}" is valid but has wrong value`);
    }
    // 410 = invalid field, just skip
  }

  console.log('\n=== VALID FIELDS FOUND ===');
  console.log('Worked:', validFields);
  console.log('Valid but needs more:', mandatoryMissing);
}

probeProductFields2().catch(err => console.error(err));
