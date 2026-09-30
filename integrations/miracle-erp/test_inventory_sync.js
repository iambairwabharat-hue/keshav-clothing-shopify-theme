const MiracleERPClient = require('./miracle_client');

async function testInventory() {
  const client = new MiracleERPClient();
  await client.authenticate();

  console.log('\n--- Step 1: Testing getProductStock ---');
  // Test with empty string, general terms, or specific product names
  const testTerms = ['', 'Tee', 'Shirt', 'Keshav', 'Oversized'];

  for (const term of testTerms) {
    try {
      console.log(`\nQuerying stock for: "${term}"...`);
      const stockRes = await client.getProductStock(term);
      console.log('Stock response:', JSON.stringify(stockRes, null, 2));
    } catch (err) {
      console.error(`Error querying "${term}":`, err.response ? err.response.data : err.message);
    }
  }
}

testInventory().catch(err => console.error(err));
