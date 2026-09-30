const MiracleERPClient = require('./miracle_client');

async function testVoucherTypes() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const origins = ['SL', 'S', 'SI', 'SV', 'SALES', 'S1', ''];
  const voutyps = [
    '',
    'Sales',
    'Sale',
    'Sales Invoice',
    'Tax Invoice',
    'Retail Invoice',
    'GST Sales',
    'Sales (GST)',
    'Sales GST',
    'Sales - Tax Invoice',
    'Retail Sales',
    'Local Sales',
    'Interstate Sales',
    'Sales Account',
    'General Sales',
    'Standard Sales',
    'Cash Sales',
    'Credit Sales',
    'Sales (Local)',
    'Sales (Interstate)',
    'Sales (Tax)',
    'Sales Invoice (GST)',
    'Sales Voucher',
    'Sale Invoice',
    'Sales Entry',
    'GST Invoice',
    'TAX INVOICE',
    'SALES INVOICE',
    'SALES',
    'Sales Tax Invoice',
    'Main Sales'
  ];

  console.log(`Testing ${origins.length * voutyps.length} combinations of origin + voutyp...`);

  for (const origin of origins) {
    for (const voutyp of voutyps) {
      const payload = {
        action: 'A',
        origin: origin,
        voutyp: voutyp,
        vouno: `T-${Date.now().toString().slice(-6)}`,
        voudt: new Date().toISOString().split('T')[0],
        accnm: 'Test Customer 1010',
        netamt: 100,
        det: [{ pname: 'Keshav Tee', qty: 1, rate: 100, amt: 100 }]
      };

      const res = await client.post('TPA/M2/V1/Voucher', payload);
      if (!res.IsError) {
        console.log(`\n🎉🎉🎉 FOUND VALID COMBINATION! 🎉🎉🎉`);
        console.log(`origin: "${origin}", voutyp: "${voutyp}"`);
        console.log('Response:', JSON.stringify(res, null, 2));
        return;
      } else {
        if (res.ErrorCode !== 'TPA006') {
          console.log(`\nDIFFERENT ERROR for origin: "${origin}", voutyp: "${voutyp}" => Error [${res.ErrorCode}]: ${res.Message}`);
          if (res.DataModel) console.log('DataModel:', res.DataModel);
        }
      }
    }
  }

  console.log('\nDone testing all candidates. None returned success.');
}

testVoucherTypes().catch(err => console.error(err));
