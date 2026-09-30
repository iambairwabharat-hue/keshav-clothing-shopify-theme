const MiracleERPClient = require('./miracle_client');

async function testMoreVoucherTypes() {
  const client = new MiracleERPClient();
  await client.authenticate();

  const candidates = [
    // Standard Miracle ERP Voucher Type Names
    'Sales',
    'Sale',
    'Sales Invoice',
    'Tax Invoice',
    'Retail Invoice',
    'Sales (Tax Invoice)',
    'Sales (Retail Invoice)',
    'Sales (GST)',
    'Sales GST',
    'Sales - Tax Invoice',
    'Sales - Retail Invoice',
    'Sales Local',
    'Sales Interstate',
    'Sales - Local',
    'Sales - Interstate',
    'Sales (Local)',
    'Sales (Interstate)',
    'Sales (GST Tax Invoice)',
    'Sales GST Tax Invoice',
    'Sales (Tax)',
    'Sales Cash',
    'Sales Credit',
    'Sales (Cash)',
    'Sales (Credit)',
    'Sales Bill',
    'Sales Receipt',
    'Shopify Sales',
    'Shopify',
    'Online Sales',
    'Ecommerce Sales',
    'E-Commerce Sales',
    'Web Sales',
    'Website Sales',
    'Main Sales',
    'General Sales',
    'Standard Sales',
    'GST Invoice',
    'Bill',
    'Invoice',
    'Cash Sales',
    'Credit Sales',
    'Sales Account',
    'Sales A/c',
    'Sales Ledger',
    'Sales Voucher',
    'Sales Order',
    'Sales Return',
    'Sales Chalan',
    'Challan',
    'Sales Challan',
    'Taxable Sales',
    'Exempt Sales',
    'Sales Taxable',
    'Sales Exempt',
    'Sales (Taxable)',
    'Sales (Exempt)',
    'Local Sales (Taxable)',
    'Sales 18%',
    'Sales (18%)',
    'Sales Invoice 18%',
    'Sales Tax Invoice 18%',
    'Direct Sales',
    'Indirect Sales',
    'Retail Invoice (GST)',
    'Tax Invoice (GST)',
    'GST Tax Invoice',
    'Invoice (GST)'
  ];

  console.log(`Testing ${candidates.length} candidates with origin = 'SL'...`);

  for (const voutyp of candidates) {
    const payload = {
      action: 'A',
      origin: 'SL',
      voutyp: voutyp,
      vouno: `T-${Date.now().toString().slice(-6)}`,
      voudt: new Date().toISOString().split('T')[0],
      accnm: 'Test Customer 1010',
      netamt: 100,
      det: [{ pname: 'Keshav Tee', qty: 1, rate: 100, amt: 100 }]
    };

    const res = await client.post('TPA/M2/V1/Voucher', payload);
    if (!res.IsError) {
      console.log(`\n🎉🎉🎉 SUCCESS FOR origin: "SL", voutyp: "${voutyp}" 🎉🎉🎉`);
      console.log('Response:', JSON.stringify(res, null, 2));
      return voutyp;
    }
  }

  console.log('Testing with origin = "S"...');
  for (const voutyp of candidates) {
    const payload = {
      action: 'A',
      origin: 'S',
      voutyp: voutyp,
      vouno: `T-${Date.now().toString().slice(-6)}`,
      voudt: new Date().toISOString().split('T')[0],
      accnm: 'Test Customer 1010',
      netamt: 100,
      det: [{ pname: 'Keshav Tee', qty: 1, rate: 100, amt: 100 }]
    };

    const res = await client.post('TPA/M2/V1/Voucher', payload);
    if (!res.IsError) {
      console.log(`\n🎉🎉🎉 SUCCESS FOR origin: "S", voutyp: "${voutyp}" 🎉🎉🎉`);
      console.log('Response:', JSON.stringify(res, null, 2));
      return voutyp;
    }
  }

  console.log('None of the candidates matched.');
}

testMoreVoucherTypes().catch(err => console.error(err));
