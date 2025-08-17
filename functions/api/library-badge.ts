// Helper function to format title (truncate after ":")
function formatTitle(title: string): string {
  if (!title) return title;
  const colonIndex = title.indexOf(':');
  return colonIndex > 0 ? title.substring(0, colonIndex).trim() : title;
}

// Helper function to format author (Last name, First initial)
function formatAuthor(author: string): string {
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

// Cloudflare Pages Function
export const onRequestGet: PagesFunction = async ({ request, env }) => {
  // Read the static file we just published
  const url = new URL(request.url);
  const jsonReq = new Request(new URL("/current.json", url).toString());

  // On Pages, ASSETS binding lets you fetch your static assets
  // @ts-ignore env.ASSETS provided by CF
  const assetRes = await env.ASSETS.fetch(jsonReq);
  let data: any = null;
  if (assetRes.ok) {
    try { 
      data = await assetRes.json(); 
    } catch (e) {
      console.error("Failed to parse current.json:", e);
    }
  }

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
    logo: "bookstack" // Use SimpleIcons BookStack
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=1800", // 30 min; tune as you like
      "Access-Control-Allow-Origin": "*"
    }
  });
};