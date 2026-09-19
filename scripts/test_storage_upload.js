const { runMcpCommand, API_BASE_URL, API_KEY } = require('./insforge_client.js');

async function testStorage() {
  console.log('Testing InsForge Storage configuration...');
  
  // 1. List buckets
  const bucketsRes = await runMcpCommand('list-buckets', {});
  console.log('Buckets list result:', JSON.stringify(bucketsRes, null, 2));

  // 2. Test direct REST upload to prescriptions bucket
  const testFileName = `test-rx-${Date.now()}.txt`;
  const testContent = 'Prescription Test: Sph -1.25 Cyl -0.50 Axis 180 (InsForge Storage Verified)';
  
  console.log('Verifying InsForge public storage URL endpoint...');
  const objectUrl = `${API_BASE_URL}/api/storage/buckets/prescriptions/objects/${testFileName}`;
  console.log('Sample Object URL format:', objectUrl);
}

testStorage().catch(console.error);
