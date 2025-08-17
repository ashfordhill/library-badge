// Simple test to simulate the badge endpoint locally
// Run with: node test-badge.js

import fs from 'node:fs/promises';

async function testBadge() {
  console.log('Testing badge endpoint...');
  
  try {
    // Read the library.json file
    const jsonContent = await fs.readFile('public/library.json', 'utf8');
    const data = JSON.parse(jsonContent);
    
    const title = data?.title ?? null;
    const author = data?.author ?? null;
    const message = title
      ? `${title}${author ? " — " + author : ""}`.slice(0, 64)
      : "none";

    const body = {
      schemaVersion: 1,
      label: "last read",
      message,
      color: title ? "blue" : "inactive",
      namedLogo: "bookstack"
    };
    
    console.log('🏷️  Badge JSON:');
    console.log(JSON.stringify(body, null, 2));
    
    console.log('\n🔗 Shields URL would be:');
    const encodedUrl = encodeURIComponent('https://your-domain.pages.dev/api/library-badge');
    console.log(`https://img.shields.io/endpoint?url=${encodedUrl}&style=flat-square`);
    
  } catch (error) {
    console.error('❌ Badge test failed:', error.message);
  }
}

testBadge();