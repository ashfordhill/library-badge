// Simple test script to verify the scraper works
// Run with: node test-scraper.js
// Make sure to set LIB_USER and LIB_PASS environment variables

import fs from 'node:fs/promises';

async function testScraper() {
  console.log('Testing scraper...');
  
  // Check if environment variables are set
  if (!process.env.LIB_USER || !process.env.LIB_PASS) {
    console.log('⚠️  LIB_USER and LIB_PASS environment variables not set');
    console.log('Set them like this:');
    console.log('$env:LIB_USER="your-username"; $env:LIB_PASS="your-password"; node test-scraper.js');
    return;
  }
  
  try {
    // Import and run the scraper
    await import('./scrape-swan.js');
    console.log('✅ Scraper completed successfully');
    
    // Check if the JSON file was created
    const jsonContent = await fs.readFile('public/library.json', 'utf8');
    const data = JSON.parse(jsonContent);
    
    console.log('📚 Latest book data:');
    console.log(`   Title: ${data.title || 'None'}`);
    console.log(`   Author: ${data.author || 'None'}`);
    console.log(`   Scraped at: ${data.scrapedAt}`);
    
  } catch (error) {
    console.error('❌ Scraper failed:', error.message);
  }
}

testScraper();