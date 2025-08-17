// Simple test to simulate the badge endpoint locally
// Run with: node test-badge.js

import fs from 'node:fs/promises';

async function testBadge() {
  console.log('Testing badge endpoint...');
  
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

  try {
    // Read the current.json file
    const jsonContent = await fs.readFile('public/current.json', 'utf8');
    const data = JSON.parse(jsonContent);
    
    const rawTitle = data?.title ?? null;
    const rawAuthor = data?.author ?? null;
    
    // Format for display
    const displayTitle = rawTitle ? formatTitle(rawTitle) : null;
    const displayAuthor = rawAuthor ? formatAuthor(rawAuthor) : null;
    
    const message = displayTitle
      ? `${displayTitle}${displayAuthor ? " — " + displayAuthor : ""}`.slice(0, 64)
      : "none";

    const body = {
      schemaVersion: 1,
      label: "borrowed",
      labelColor: "4A148C", // Much darker purple for the left side
      message,
      color: displayTitle ? "7B1FA2" : "inactive", // Rich purple that complements Spotify green
      logo: "bookstack", // Use SimpleIcons BookStack
      logoColor: "7B1FA2" // Make the "borrowed" text the same color as right side background
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