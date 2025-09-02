// Setup verification script
console.log('🔍 Checking Cloudflare Worker setup...\n');

// Check if wrangler is available
try {
  const { execSync } = await import('child_process');
  
  console.log('1. Checking wrangler installation...');
  try {
    const wranglerVersion = execSync('npx wrangler --version', { encoding: 'utf8' });
    console.log('   ✅ Wrangler installed:', wranglerVersion.trim());
  } catch (e) {
    console.log('   ❌ Wrangler not found. Run: npm install');
    process.exit(1);
  }
  
  console.log('\n2. Checking authentication...');
  try {
    const whoami = execSync('npx wrangler whoami', { encoding: 'utf8' });
    console.log('   ✅ Authenticated with Cloudflare');
    console.log('   ', whoami.trim());
  } catch (e) {
    console.log('   ❌ Not authenticated. Run: npx wrangler login');
    console.log('   Or set CLOUDFLARE_API_TOKEN environment variable');
  }
  
  console.log('\n3. Checking configuration...');
  const fs = await import('fs');
  
  if (fs.existsSync('wrangler.toml')) {
    console.log('   ✅ wrangler.toml exists');
    const config = fs.readFileSync('wrangler.toml', 'utf8');
    if (config.includes('library.ashhill.dev')) {
      console.log('   ✅ Custom domain route configured');
    } else {
      console.log('   ⚠️  Custom domain route not found in wrangler.toml');
    }
  } else {
    console.log('   ❌ wrangler.toml not found');
  }
  
  if (fs.existsSync('worker.js')) {
    console.log('   ✅ worker.js exists');
  } else {
    console.log('   ❌ worker.js not found');
  }
  
  console.log('\n4. Testing worker locally...');
  const worker = await import('./worker.js');
  const request = new Request('http://localhost:8787/api/library-badge');
  const response = await worker.default.fetch(request, {}, {});
  const data = await response.json();
  
  console.log('   ✅ Worker test successful');
  console.log('   📊 Current badge message:', `"${data.message}"`);
  
  console.log('\n🎯 Next steps for GitHub Actions:');
  console.log('   1. Go to your GitHub repository settings');
  console.log('   2. Navigate to Secrets and variables > Actions');
  console.log('   3. Add these repository secrets:');
  console.log('      - CLOUDFLARE_API_TOKEN (get from https://dash.cloudflare.com/profile/api-tokens)');
  console.log('      - CLOUDFLARE_ACCOUNT_ID (get from: npx wrangler whoami)');
  console.log('   4. Push your changes to trigger the workflow');
  console.log('\n✅ Setup verification complete!');
  
} catch (error) {
  console.error('❌ Setup check failed:', error.message);
}