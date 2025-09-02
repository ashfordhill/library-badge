// Test the Cloudflare Worker locally
import worker from './worker.js';

async function testWorker() {
  console.log('🧪 Testing Cloudflare Worker locally...\n');
  
  try {
    // Create a mock request
    const request = new Request('http://localhost:8787/api/library-badge', {
      method: 'GET',
    });
    
    // Create mock environment and context
    const env = {};
    const ctx = {
      waitUntil: (promise) => promise,
      passThroughOnException: () => {},
    };
    
    // Call the worker
    const response = await worker.fetch(request, env, ctx);
    
    console.log('📊 Response Status:', response.status);
    console.log('📋 Response Headers:');
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    
    const body = await response.text();
    console.log('\n📄 Response Body:');
    console.log(body);
    
    // Parse and display the badge data
    try {
      const badgeData = JSON.parse(body);
      console.log('\n🏷️  Badge Message:', `"${badgeData.message}"`);
      console.log('🎨 Badge Color:', badgeData.color);
      console.log('🏷️  Badge Label:', badgeData.label);
    } catch (e) {
      console.log('⚠️  Could not parse response as JSON');
    }
    
    console.log('\n✅ Worker test completed successfully!');
    
  } catch (error) {
    console.error('❌ Worker test failed:', error.message);
    console.error(error.stack);
  }
}

testWorker();