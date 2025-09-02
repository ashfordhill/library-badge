// Test the deployed worker
console.log('🧪 Testing deployed Cloudflare Worker...\n');

async function testDeployedWorker() {
  try {
    // Test the workers.dev URL first
    const workerUrl = 'https://library-badge.ashfordhill92.workers.dev';
    console.log(`🌐 Testing worker at: ${workerUrl}`);
    
    const response = await fetch(workerUrl);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Worker is live!');
      console.log(`📊 Badge message: "${data.message}"`);
      console.log(`🎨 Badge color: ${data.color}`);
      console.log(`🏷️  Badge label: ${data.label}`);
      
      // Test if it shows the current book
      if (data.message.includes('Sand Talk')) {
        console.log('🎉 SUCCESS: Showing current book "Sand Talk"!');
      } else {
        console.log('⚠️  Note: Not showing expected book "Sand Talk"');
      }
    } else {
      console.log(`❌ Worker request failed: ${response.status} ${response.statusText}`);
    }
    
    // Test the custom domain (if routes are enabled)
    console.log('\n🌐 Testing custom domain...');
    const customUrl = 'https://library.ashhill.dev/api/library-badge';
    
    try {
      const customResponse = await fetch(customUrl);
      if (customResponse.ok) {
        const customData = await customResponse.json();
        console.log('✅ Custom domain is working!');
        console.log(`📊 Custom domain message: "${customData.message}"`);
      } else {
        console.log(`⚠️  Custom domain not working yet: ${customResponse.status}`);
        console.log('   This is expected if routes aren\'t configured yet.');
      }
    } catch (e) {
      console.log('⚠️  Custom domain not accessible yet (expected if routes not set up)');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDeployedWorker();