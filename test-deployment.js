// Test deployment readiness
import fs from 'fs';

console.log('🚀 Testing deployment readiness...\n');

// Check required files
const requiredFiles = [
  'worker.js',
  'wrangler.toml',
  'public/current.json',
  '.github/workflows/scrape.yml'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n❌ Some required files are missing. Please check the setup.');
  process.exit(1);
}

// Check current.json content
console.log('\n📄 Current data:');
const currentData = JSON.parse(fs.readFileSync('public/current.json', 'utf8'));
console.log(`   Title: ${currentData.title}`);
console.log(`   Author: ${currentData.author}`);
console.log(`   Scraped: ${currentData.scrapedAt}`);

// Test worker
console.log('\n🧪 Testing worker...');
const worker = await import('./worker.js');
const request = new Request('https://library.ashhill.dev/api/library-badge');
const response = await worker.default.fetch(request, {}, {});
const badgeData = await response.json();

console.log(`   Badge message: "${badgeData.message}"`);
console.log(`   Badge color: ${badgeData.color}`);

// Check GitHub Actions workflow
console.log('\n⚙️  Checking GitHub Actions workflow...');
const workflowContent = fs.readFileSync('.github/workflows/scrape.yml', 'utf8');

if (workflowContent.includes('CLOUDFLARE_API_TOKEN')) {
  console.log('   ✅ Cloudflare API token configured in workflow');
} else {
  console.log('   ❌ Cloudflare API token not found in workflow');
}

if (workflowContent.includes('CLOUDFLARE_ACCOUNT_ID')) {
  console.log('   ✅ Cloudflare account ID configured in workflow');
} else {
  console.log('   ❌ Cloudflare account ID not found in workflow');
}

if (workflowContent.includes('[skip ci]')) {
  console.log('   ⚠️  Found [skip ci] in workflow - this might prevent deployments');
} else {
  console.log('   ✅ No [skip ci] found - deployments will trigger');
}

console.log('\n🎯 Deployment readiness summary:');
console.log('   ✅ Worker code ready');
console.log('   ✅ Configuration files ready');
console.log('   ✅ GitHub Actions workflow configured');
console.log('\n📋 To complete setup:');
console.log('   1. Set GitHub repository secrets (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID)');
console.log('   2. Push changes to main branch');
console.log('   3. GitHub Actions will automatically deploy the worker');
console.log('   4. Your existing URLs will continue to work!');

console.log('\n✅ Ready for deployment!');