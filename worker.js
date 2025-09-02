// Cloudflare Worker for Library Badge
// This worker fetches the latest data directly from GitHub

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

export default {
  async fetch(request, env, ctx) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Fetch the latest current.json directly from GitHub
      // Using the raw GitHub URL to get the latest version
      const githubUrl = 'https://raw.githubusercontent.com/ashfordhill/library-badge/main/public/current.json';
      
      const response = await fetch(githubUrl, {
        headers: {
          'User-Agent': 'Library-Badge-Worker/1.0',
          // Add cache busting to ensure we get the latest version
          'Cache-Control': 'no-cache',
        },
      });

      let data = null;
      if (response.ok) {
        try {
          data = await response.json();
        } catch (e) {
          console.error("Failed to parse current.json from GitHub:", e);
        }
      } else {
        console.error("Failed to fetch from GitHub:", response.status, response.statusText);
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
        labelColor: "4A148C", // Dark purple for the left side
        message,
        color: displayTitle ? "7B1FA2" : "inactive" // Light purple for the right side
      };

      return new Response(JSON.stringify(body), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=1800", // 30 min cache
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (error) {
      console.error("Worker error:", error);
      
      // Return a fallback response
      const fallbackBody = {
        schemaVersion: 1,
        label: "borrowed",
        labelColor: "4A148C",
        message: "error",
        color: "red"
      };

      return new Response(JSON.stringify(fallbackBody), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=300", // 5 min cache for errors
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};