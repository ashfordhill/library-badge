// Complete system test - tests scraper, history, and badge formatting
// Run with: $env:LIB_USER="username"; $env:LIB_PASS="password"; node test-complete-system.js

import fs from 'node:fs/promises';

async function testCompleteSystem() {
  console.log('🧪 Testing Complete Library Badge System');
  console.log('=======================================');
  
  // Check if environment variables are set
  if (!process.env.LIB_USER || !process.env.LIB_PASS) {
    console.log('⚠️  LIB_USER and LIB_PASS environment variables not set');
    console.log('Set them like this:');
    console.log('$env:LIB_USER="your-username"; $env:LIB_PASS="your-password"; node test-complete-system.js');
    return;
  }
  
  try {
    console.log('1️⃣ Testing scraper...');
    
    // Save current state for comparison
    let beforeData = null;
    try {
      const beforeContent = await fs.readFile('public/current.json', 'utf8');
      beforeData = JSON.parse(beforeContent);
      console.log(`   Current book before: "${beforeData.title}" by ${beforeData.author}`);
    } catch (e) {
      console.log('   No existing current.json found');
    }
    
    // Run the scraper
    await import('./scrape-swan.js');
    console.log('   ✅ Scraper completed successfully');
    
    // Check results
    const afterContent = await fs.readFile('public/current.json', 'utf8');
    const afterData = JSON.parse(afterContent);
    
    console.log('\n2️⃣ Checking current book data...');
    console.log(`   Title: "${afterData.title || 'None'}"`);
    console.log(`   Author: "${afterData.author || 'None'}"`);
    console.log(`   Scraped at: ${afterData.scrapedAt}`);
    
    // Check if history was created/updated
    console.log('\n3️⃣ Checking history...');
    try {
      const historyContent = await fs.readFile('public/history.json', 'utf8');
      const historyData = JSON.parse(historyContent);
      
      console.log(`   History file exists: ✅`);
      console.log(`   Total books in history: ${historyData.totalBooks || 0}`);
      
      if (historyData.books && historyData.books.length > 0) {
        console.log('   Recent history:');
        historyData.books.slice(0, 3).forEach((book, index) => {
          console.log(`     ${index + 1}. "${book.title}" by ${book.author}`);
        });
      }
      
      // Check if a new book was detected
      if (beforeData && beforeData.title !== afterData.title) {
        console.log(`   🆕 New book detected! Previous book should be in history.`);
        const previousInHistory = historyData.books.some(book => book.title === beforeData.title);
        console.log(`   Previous book in history: ${previousInHistory ? '✅' : '❌'}`);
      } else {
        console.log(`   📖 Same book as before (no history update needed)`);
      }
      
    } catch (e) {
      console.log('   No history.json found (normal if no book changes yet)');
    }
    
    // Test badge formatting
    console.log('\n4️⃣ Testing badge formatting...');
    
    // Helper functions (same as in the API)
    function formatTitle(title) {
      if (!title) return title;
      const colonIndex = title.indexOf(':');
      return colonIndex > 0 ? title.substring(0, colonIndex).trim() : title;
    }

    function formatAuthor(author) {
      if (!author) return author;
      
      // Handle "Last, First" format
      if (author.includes(',')) {
        const parts = author.split(',').map(p => p.trim());
        const lastName = parts[0];
        const firstName = parts[1];
        if (firstName && firstName.length > 0) {
          return `${lastName}, ${firstName.charAt(0)}.`;
        }
        return lastName;
      }
      
      // Handle "First Last" format
      const parts = author.split(' ').filter(p => p.length > 0);
      if (parts.length >= 2) {
        const firstName = parts[0];
        const lastName = parts.slice(1).join(' ');
        return `${lastName}, ${firstName.charAt(0)}.`;
      }
      
      return author; // Return as-is if can't parse
    }
    
    const rawTitle = afterData.title;
    const rawAuthor = afterData.author;
    
    const displayTitle = rawTitle ? formatTitle(rawTitle) : null;
    const displayAuthor = rawAuthor ? formatAuthor(rawAuthor) : null;
    
    console.log(`   Raw title: "${rawTitle}"`);
    console.log(`   Formatted title: "${displayTitle}"`);
    console.log(`   Raw author: "${rawAuthor}"`);
    console.log(`   Formatted author: "${displayAuthor}"`);
    
    const message = displayTitle
      ? `${displayTitle}${displayAuthor ? " — " + displayAuthor : ""}`.slice(0, 64)
      : "none";
    
    console.log(`   Badge message: "${message}"`);
    console.log(`   Badge color: ${displayTitle ? '7B2D26 (maroon)' : 'inactive (gray)'}`);
    
    // Generate example URLs
    console.log('\n5️⃣ Example badge URLs (replace your-domain.pages.dev):');
    const baseUrl = 'https://your-domain.pages.dev/api/library-badge';
    const encodedUrl = encodeURIComponent(baseUrl);
    
    console.log(`   Flat: https://img.shields.io/endpoint?url=${encodedUrl}`);
    console.log(`   Flat Square: https://img.shields.io/endpoint?url=${encodedUrl}&style=flat-square`);
    console.log(`   For The Badge: https://img.shields.io/endpoint?url=${encodedUrl}&style=for-the-badge`);
    
    console.log('\n✅ Complete system test passed!');
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
  }
}

testCompleteSystem();