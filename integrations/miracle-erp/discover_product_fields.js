const MiracleERPClient = require('./miracle_client');

// We know: prdnm = product name, grpnm = group name, hsncode = HSN code
// Now discover the rest of the fields

async function discoverProductFields() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const fieldGuesses = [
    'prdcd', 'prdcode', 'prdalias', 'prdaliascd', 'palias', 'prdpalias',
    'salrt', 'salrate', 'srte', 'srate', 'salertt', 'salrte',
    'purrt', 'purrate', 'prte', 'prate', 'purraet', 'purchrt',
    'mrprt', 'mrprate', 'mrprte',
    'gstrt', 'gstrate', 'gstp', 'gstper', 'gstpct',
    'igstrt', 'igstrate', 'cgstrt', 'sgstrt',
    'unitnm', 'unit', 'uom', 'unitofmeasure',
    'prdgrp', 'prdgrpnm', 'grp',
    'hsnno', 'hsncod', 'hsnnum',
    'openstock', 'opqty', 'opqt', 'openqt',
    'maxqty', 'minqty', 'reorder',
    'batch', 'batchnm', 'batchwise',
    'inactive', 'active',
    'compname', 'comp', 'brandnm',
    'imageurl', 'img', 'imgurl',
    'weight', 'wgt',
    'rack', 'location', 'godown', 'godownnm',
    'taxrt', 'taxper', 'taxrate',
    'cessrt', 'cess',
    'prdtype', 'type',
    'salert',
    'purrt',
    'mrp'
  ];

  let validFields = [];

  for (const field of fieldGuesses) {
    const payload = { action: 'A', prdnm: 'Keshav Tee', [field]: 'TestValue' };
    const res = await client.post('TPA/M2/V1/Product', payload);
    if (!res.IsError) {
      console.log(`✅ "${field}" works! Success!`);
      validFields.push(field);
    } else if (res.ErrorCode === '422') {
      console.log(`⚠️ [422] "${field}" is VALID (missing other mandatory field)`);
      validFields.push(field);
    } else if (res.ErrorCode === '416') {
      console.log(`⚠️ [416] "${field}" is valid but wrong value type`);
      validFields.push(field);
    }
    // 410 = invalid field — skip
  }

  console.log('\n=== VALID FIELDS DISCOVERED ===');
  console.log(validFields);

  // Now try adding a product with just prdnm
  console.log('\n=== Attempt to add product with prdnm only ===');
  const addRes = await client.post('TPA/M2/V1/Product', {
    action: 'A',
    prdnm: 'Keshav Oversized Tee - Test'
  });
  console.log('Add result:', JSON.stringify(addRes, null, 2));
}

discoverProductFields().catch(err => console.error(err));
