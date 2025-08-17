import { chromium } from "playwright";
import fs from "node:fs/promises";

type Payload = {
  scrapedAt: string;
  title: string | null;
  author: string | null;
  source: "ReadingHistory:firstRow";
};

async function run() {
  const LOGIN = "https://ops.swanlibraries.net/MyAccount/Home";
  const HISTORY = "https://ops.swanlibraries.net/MyAccount/ReadingHistory";

  const USER = process.env.LIB_USER!;
  const PASS = process.env.LIB_PASS!;

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

    // First row container (your screenshot shows `.row.result`)
    const firstRow = page.locator(".row.result").first();

    // Title: inside `.result-title a.title`
    const title = (await firstRow.locator(".result-title a.title").first().textContent())
                    ?.trim() || null;

    // Author: label/value pattern -> find the value next to label "Author"
    // This uses :has-text in Playwright to find the label div then select the nearest value link.
    const author = (await firstRow
        .locator('.result-label:has-text("Author")')
        .locator('xpath=following-sibling::*[contains(@class,"result-value")]//a')
        .first()
        .textContent())?.trim() || null;

    console.log(`Found: ${title} by ${author}`);

    const payload: Payload = {
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
  const payload: Payload = {
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