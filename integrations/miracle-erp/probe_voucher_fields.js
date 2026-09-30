const MiracleERPClient = require('./miracle_client');

// Check what fields the Voucher endpoint accepts besides voutyp
// By sending without det/netamt/accnm to see mandatory field messages

async function probeVoucherFields() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const voucherFieldGuesses = [
    // Voucher number field variants
    'vno', 'vouchno', 'voucherNo', 'vouchernumber', 'vounum', 'vnum',
    // Date
    'vdt', 'voucherdt', 'voucherdate', 'date', 'dt',
    // Account name
    'accname', 'accountname', 'acnm', 'acname', 'partyname', 'partynm', 'custnm', 'custname',
    // Net amount
    'net', 'total', 'totalamt', 'totamt', 'amount', 'amt', 'totalamount', 'tamount',
    // Details
    'detail', 'details', 'items', 'lineItems', 'lineitems',
    // User defined fields
    'udf', 'udfdet', 'ufdfields', 'usrfld',
    // Tax
    'taxamt', 'taxamount', 'gstamt', 'gstamount',
    // Narration
    'narration', 'narr', 'note', 'notes', 'remarks',
    // Branch
    'branchnm', 'branch',
    // Cost center
    'costcenter', 'cc', 'ccnm',
  ];

  let validFields = [];

  // Use a minimal valid-ish payload (known fields from experiment 1):
  // action, origin, voutyp (we'll use a dummy voutyp but that's the one that fails)
  // Instead, let's test WITHOUT voutyp — we'll see which other fields are valid
  for (const field of voucherFieldGuesses) {
    const payload = { action: 'A', [field]: 'TestValue' };
    const res = await client.post('TPA/M2/V1/Voucher', payload);
    if (!res.IsError) {
      console.log(`✅ "${field}" works!`);
      validFields.push(field);
    } else if (res.ErrorCode === '411') {
      console.log(`⚠️ [411 TYPE] "${field}" is VALID but needs number`);
      validFields.push(field);
    } else if (res.ErrorCode === '416') {
      console.log(`⚠️ [416 VALUE] "${field}" is VALID but wrong value format`);
      validFields.push(field);
    } else if (res.ErrorCode === '422') {
      console.log(`⚠️ [422 MANDATORY] "${field}" is VALID`);
      validFields.push(field);
    }
    // 410 = invalid — skip
  }

  console.log('\n=== VALID VOUCHER FIELDS ===');
  console.log(validFields);
}

probeVoucherFields().catch(err => console.error(err));
