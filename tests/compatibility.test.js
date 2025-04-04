const { test, expect } = require('@playwright/test');
const { webkit, chromium, firefox } = require('@playwright/test');

const browsers = [
  { name: 'WebKit (Safari-like)', instance: webkit },
  { name: 'Chromium', instance: chromium },
  { name: 'Firefox', instance: firefox },
];

for (const browser of browsers) {
  test(`${browser.name} - Check for Errors`, async ({ page }) => {
    // Capture console errors
    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Capture uncaught exceptions
    const pageErrors = [];
    page.on('pageerror', (err) => pageErrors.push(err.message));

    // Go to your app
    await page.goto('http://localhost:3000');

    // Wait for async operations
    await page.waitForTimeout(2000);

    // Check for errors
    expect(consoleErrors).toEqual([]); // No console errors
    expect(pageErrors).toEqual([]); // No uncaught exceptions
  });
}