// Debug script to test just the login flow
// Run with: DEBUG=true LIB_USER=your_user LIB_PASS=your_pass node debug-login.js

import { chromium } from "playwright";

async function debugLogin() {
  const LOGIN = "https://ops.swanlibraries.net/MyAccount/Home";
  
  const USER = process.env.LIB_USER;
  const PASS = process.env.LIB_PASS;

  if (!USER || !PASS) {
    console.log("Please set LIB_USER and LIB_PASS environment variables");
    console.log("Example: $env:LIB_USER='username'; $env:LIB_PASS='password'; node debug-login.js");
    return;
  }

  console.log("🔍 Debug Login Test");
  console.log("==================");

  const browser = await chromium.launch({ headless: false, slowMo: 1000 }); // Visible browser with slow motion
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log("1. Navigating to login page...");
    await page.goto(LOGIN, { waitUntil: "domcontentloaded" });
    
    console.log("2. Current URL:", page.url());
    console.log("3. Page title:", await page.title());
    
    // Check what login elements are available
    console.log("4. Checking for login elements...");
    const usernameExists = await page.locator("#username").count();
    const passwordExists = await page.locator("#password").count();
    const loginExists = await page.locator("#loginFormSubmit").count();
    
    console.log(`   - Username field: ${usernameExists > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`   - Password field: ${passwordExists > 0 ? '✅ Found' : '❌ Not found'}`);
    console.log(`   - Login button: ${loginExists > 0 ? '✅ Found' : '❌ Not found'}`);
    
    if (usernameExists === 0 || passwordExists === 0 || loginExists === 0) {
      console.log("5. Login elements not found, checking page content...");
      const pageContent = await page.content();
      console.log("Page content preview:", pageContent.substring(0, 2000));
      
      // Look for alternative selectors
      const allInputs = await page.locator('input').count();
      console.log(`   - Total input fields found: ${allInputs}`);
      
      for (let i = 0; i < Math.min(allInputs, 10); i++) {
        const input = page.locator('input').nth(i);
        const type = await input.getAttribute('type');
        const name = await input.getAttribute('name');
        const id = await input.getAttribute('id');
        const placeholder = await input.getAttribute('placeholder');
        console.log(`   - Input ${i}: type="${type}" name="${name}" id="${id}" placeholder="${placeholder}"`);
      }
      
      return;
    }
    
    console.log("5. Filling credentials...");
    await page.fill("#username", USER);
    await page.fill("#password", PASS);
    
    console.log("6. Clicking login...");
    await page.click("#loginFormSubmit");
    
    console.log("7. Waiting for navigation...");
    await page.waitForTimeout(3000); // Wait 3 seconds
    
    console.log("8. After login attempt:");
    console.log("   - Current URL:", page.url());
    console.log("   - Page title:", await page.title());
    
    // Check for error messages
    const errorSelectors = ['.alert-danger', '.error', '.login-error', '.alert', '[class*="error"]'];
    for (const selector of errorSelectors) {
      const errorCount = await page.locator(selector).count();
      if (errorCount > 0) {
        const errorText = await page.locator(selector).first().textContent();
        console.log(`   - Error found (${selector}): ${errorText}`);
      }
    }
    
    // Check for login success indicators
    console.log("9. Checking for login success indicators:");
    const loggedInIndicators = [
      'a[href*="logout"]',
      'a[href*="Logout"]', 
      '.logoutOptions',
      'text=Logout',
      'text=Log Out',
      'text=My Account',
      '.myAccountMenu'
    ];
    
    for (const indicator of loggedInIndicators) {
      const count = await page.locator(indicator).count();
      console.log(`   - ${indicator}: ${count > 0 ? '✅ Found' : '❌ Not found'}`);
    }
    
    // Check if login form is still visible
    const loginFormVisible = await page.locator('#loginFormSubmit').count();
    console.log(`   - Login form still visible: ${loginFormVisible > 0 ? '❌ Yes (login failed)' : '✅ No (login likely succeeded)'}`);
    
    // Try to navigate to reading history
    console.log("10. Testing navigation to reading history...");
    await page.goto("https://ops.swanlibraries.net/MyAccount/ReadingHistory");
    await page.waitForTimeout(2000);
    console.log("   - Reading history URL:", page.url());
    console.log("   - Reading history title:", await page.title());
    
    console.log("11. Keeping browser open for 10 seconds for manual inspection...");
    await page.waitForTimeout(10000);
    
  } catch (error) {
    console.error("❌ Debug failed:", error.message);
  } finally {
    await browser.close();
  }
}

debugLogin();