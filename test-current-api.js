import fs from 'fs';

// Helper function to format title (truncate after ":")
function formatTitle(title) {
  if (!title) return title;
  const colonIndex = title.indexOf(':');
  return colonIndex > 0 ? title.substring(0, colonIndex).trim() : title;
}

// Helper function to format author (Last name, First initial)
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
  const data = JSON.parse(fs.readFileSync('./public/current.json', 'utf8'));
  console.log('Raw data from current.json:');
  console.log(JSON.stringify(data, null, 2));
  
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
    labelColor: "4A148C",
    message,
    color: displayTitle ? "7B1FA2" : "inactive"
  };
  
  console.log('\nAPI Response:');
  console.log(JSON.stringify(body, null, 2));
  console.log(`\nBadge message: "${message}"`);
} catch (error) {
  console.error('Error:', error.message);
}