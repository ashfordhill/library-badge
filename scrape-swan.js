import { chromium } from "playwright";
import fs from "node:fs/promises";

async function run() {
  const LOGIN = "https://ops.swanlibraries.net/MyAccount/Home";
  const HISTORY = "https://ops.swanlibraries.net/MyAccount/ReadingHistory";

  const USER = process.env.LIB_USER;
  const PASS = process.env.LIB_PASS;

  if (!USER || !PASS) {
    throw new Error("LIB_USER and LIB_PASS environment variables are required");
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // 1) Login
    console.log("Navigating to login page...");
    await page.goto(LOGIN, { waitUntil: "domcontentloaded" });
    
    await page.fill("#username", USER);
    await page.fill("#password", PASS);
    
    await Promise.all([
      page.waitForNavigation({ waitUntil: "networkidle" }),
      page.click("#login")
    ]);

    console.log("Login successful, navigating to reading history...");

    // 2) Reading History
    await page.goto(HISTORY, { waitUntil: "networkidle" });

    // Wait for the reading history to load
    await page.waitForSelector('.row.result', { timeout: 10000 });

    // First row container (from screenshot: `.row.result` with specific ID)
    const firstRow = page.locator(".row.result").first();

    // Debug: log the HTML structure
    const rowHTML = await firstRow.innerHTML();
    console.log('First row HTML:', rowHTML.substring(0, 500) + '...');

    // Title: inside `.result-title.notranslate a.title`
    let title = null;
    try {
      title = (await firstRow.locator(".result-title.notranslate a.title").first().textContent())?.trim() || null;
      if (!title) {
        // Fallback: try without .notranslate
        title = (await firstRow.locator(".result-title a.title").first().textContent())?.trim() || null;
      }
    } catch (e) {
      console.log('Title extraction failed:', e.message);
    }

    // Author: find the result-label with "Author" text, then get the adjacent result-value link
    let author = null;
    try {
      // Try the xpath approach first
      author = (await firstRow
          .locator('.result-label:has-text("Author")')
          .locator('xpath=following-sibling::div[contains(@class,"result-value")]//a')
          .first()
          .textContent())?.trim() || null;
      
      if (!author) {
        // Fallback: try a more direct approach
        const authorRow = firstRow.locator('.row').filter({ hasText: 'Author' });
        author = (await authorRow.locator('.result-value a').first().textContent())?.trim() || null;
      }
    } catch (e) {
      console.log('Author extraction failed:', e.message);
    }

    console.log(`Found: ${title} by ${author}`);

    const payload = {
      scrapedAt: new Date().toISOString(),
      title,
      author,
      source: "ReadingHistory:firstRow"
    };

    await fs.mkdir("public", { recursive: true });
    await fs.writeFile("public/library.json", JSON.stringify(payload, null, 2), "utf8");

    console.log("Successfully updated library.json");

  } finally {
    await browser.close();
  }
}

run().catch(async (e) => {
  console.error("Error during scraping:", e);
  // Write a fallback JSON so your badge still renders
  const payload = {
    scrapedAt: new Date().toISOString(),
    title: null,
    author: null,
    source: "ReadingHistory:firstRow"
  };
  
  try {
    await fs.mkdir("public", { recursive: true });
    await fs.writeFile("public/library.json", JSON.stringify(payload, null, 2), "utf8");
    console.log("Wrote fallback library.json");
  } catch (writeError) {
    console.error("Failed to write fallback JSON:", writeError);
  }
  
  process.exit(1);
});