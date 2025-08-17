// Test the API endpoint logic locally
// This simulates what the Cloudflare Pages Function does

import fs from 'node:fs/promises';

async function testAPI() {
  console.log('🧪 Testing API endpoint logic...\n');
  
  try {
    // Read the library.json file (simulating ASSETS.fetch)
    const jsonContent = await fs.readFile('public/library.json', 'utf8');
    const data = JSON.parse(jsonContent);
    
    console.log('📄 Raw data from library.json:');
    console.log(JSON.stringify(data, null, 2));
    console.log();
    
    // Simulate the Pages Function logic
    const title = data?.title ?? null;
    const author = data?.author ?? null;
    const message = title
      ? `${title}${author ? " — " + author : ""}`.slice(0, 64)
      : "none";

    const body = {
      schemaVersion: 1,
      label: "borrowed",
      message,
      color: title ? "blue" : "inactive",
      namedLogo: "bookstack"
    };
    
    console.log('🏷️  Shields.io endpoint response:');
    console.log(JSON.stringify(body, null, 2));
    console.log();
    
    console.log('✅ API endpoint test successful!');
    console.log(`📊 Badge will show: "${body.message}"`);
    
    // Test with sample data
    console.log('\n🔬 Testing with sample book data...');
    const sampleData = {
      title: "Right story, wrong story : how to have fearless conversations in hell",
      author: "Yunkaporte, Tyson",
      scrapedAt: new Date().toISOString(),
      source: "ReadingHistory:firstRow"
    };
    
    const sampleTitle = sampleData?.title ?? null;
    const sampleAuthor = sampleData?.author ?? null;
    const sampleMessage = sampleTitle
      ? `${sampleTitle}${sampleAuthor ? " — " + sampleAuthor : ""}`.slice(0, 64)
      : "none";

    const sampleBody = {
      schemaVersion: 1,
      label: "borrowed",
      message: sampleMessage,
      color: sampleTitle ? "blue" : "inactive",
      namedLogo: "bookstack"
    };
    
    console.log('Sample badge response:');
    console.log(JSON.stringify(sampleBody, null, 2));
    console.log(`📊 Sample badge would show: "${sampleBody.message}"`);
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPI();