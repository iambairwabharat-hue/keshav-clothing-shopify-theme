const MiracleERPClient = require('./miracle_client');
const config = require('./config');

async function test() {
  const client = new MiracleERPClient();
  
  console.log('--- Step 1: Authenticating ---');
  await client.authenticate();

  console.log('\n--- Step 2: Testing upsertAccount ---');
  const accountRes = await client.upsertAccount({
    name: 'Test Customer 1010',
    groupName: config.defaultCustomerGroup,
    state: 'Gujarat',
    city: 'Surat',
    pincode: '395001',
    address1: 'Test Address',
    mobile: '9876540010',
    email: 'test10@test.com'
  });
  console.log('Account response:', JSON.stringify(accountRes, null, 2));

  console.log('\n--- Step 3: Testing createSalesVoucher ---');
  const shopifyOrder = {
    id: 9010,
    order_number: '1010',
    name: '#1010',
    created_at: new Date().toISOString(),
    total_price: '1299.00',
    gateway: 'razorpay',
    customer: {
      first_name: 'Test',
      last_name: 'User',
      email: 'test10@test.com',
      phone: '9876540010'
    },
    line_items: [
      {
        title: 'Keshav Tee',
        name: 'Keshav Tee - L',
        quantity: 1,
        price: '1299.00'
      }
    ]
  };

  const voucherRes = await client.createSalesVoucher(shopifyOrder);
  console.log('Voucher response:', JSON.stringify(voucherRes, null, 2));
}

test().catch(err => {
  console.error('Test script caught error:', err.response ? err.response.data : err.message);
});
