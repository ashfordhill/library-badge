import { chromium } from "playwright";
import fs from "node:fs/promises";

async function run() {
  const LOGIN = "https://ops.swanlibraries.net/MyAccount/Home";
  const HISTORY = "https://ops.swanlibraries.net/MyAccount/ReadingHistory";

  const USER = process.env.LIB_USER;
  const PASS = process.env.LIB_PASS;
  const DEBUG = process.env.DEBUG === 'true';

  if (!USER || !PASS) {
    throw new Error("LIB_USER and LIB_PASS environment variables are required");
  }

  console.log(`Starting scraper (debug mode: ${DEBUG ? 'ON' : 'OFF'})`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  // Helper function for debug screenshots
  const debugScreenshot = async (name) => {
    if (DEBUG) {
      try {
        await page.screenshot({ path: `debug-${name}.png`, fullPage: true });
        console.log(`Debug screenshot saved: debug-${name}.png`);
      } catch (e) {
        console.log(`Failed to take screenshot ${name}:`, e.message);
      }
    }
  };

  try {
    // 1) Login
    console.log("Navigating to login page...");
    await page.goto(LOGIN, { waitUntil: "domcontentloaded" });
    await debugScreenshot('01-login-page');
    
    // Wait for login form to be visible
    await page.waitForSelector("#username", { timeout: 10000 });
    await page.waitForSelector("#password", { timeout: 10000 });
    await page.waitForSelector("#login", { timeout: 10000 });
    
    console.log("Login form found, filling credentials...");
    await page.fill("#username", USER);
    await page.fill("#password", PASS);
    await debugScreenshot('02-credentials-filled');
    
    console.log("Clicking login button...");
    // Use a more robust approach for login
    await page.click("#login");
    
    // Wait for either successful login (redirect) or error message
    try {
      await page.waitForURL(url => !url.includes('/MyAccount/Home'), { timeout: 15000 });
      console.log("Login successful, navigating to reading history...");
      await debugScreenshot('03-login-success');
    } catch (urlError) {
      // Check if we're still on login page or got redirected somewhere else
      const currentUrl = page.url();
      console.log("Current URL after login attempt:", currentUrl);
      await debugScreenshot('03-login-attempt');
      
      // Check for error messages
      const errorMessage = await page.locator('.alert-danger, .error, .login-error').first().textContent().catch(() => null);
      if (errorMessage) {
        throw new Error(`Login failed: ${errorMessage}`);
      }
      
      // If no error message but still on login page, credentials might be wrong
      if (currentUrl.includes('/MyAccount/Home')) {
        throw new Error("Login failed: Still on login page, check credentials");
      }
      
      console.log("Login may have succeeded, continuing...");
    }

    // 2) Reading History
    console.log("Navigating to reading history page...");
    await page.goto(HISTORY, { waitUntil: "domcontentloaded" });
    await debugScreenshot('04-history-page');

    // Wait for the reading history to load
    console.log("Waiting for reading history results...");
    try {
      await page.waitForSelector('.row.result', { timeout: 15000 });
      console.log("Reading history results found!");
      await debugScreenshot('05-history-results');
    } catch (historyError) {
      console.log("No reading history results found, checking page content...");
      await debugScreenshot('05-history-no-results');
      const pageContent = await page.content();
      console.log("Page title:", await page.title());
      console.log("Current URL:", page.url());
      
      // Check if there's a "no results" message
      const noResults = await page.locator('text=No items found').first().textContent().catch(() => null);
      if (noResults) {
        console.log("No reading history found - user may not have any checked out books");
        throw new Error("No reading history available");
      }
      
      // Log part of the page content for debugging
      console.log("Page content preview:", pageContent.substring(0, 1000));
      throw new Error("Reading history page did not load properly");
    }

    // First row container (from screenshot: `.row.result` with specific ID)
    const firstRow = page.locator(".row.result").first();

    // Debug: log the HTML structure
    try {
      const rowHTML = await firstRow.innerHTML();
      console.log('First row HTML:', rowHTML.substring(0, 500) + '...');
    } catch (htmlError) {
      console.log('Could not get first row HTML:', htmlError.message);
    }

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