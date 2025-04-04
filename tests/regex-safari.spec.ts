import { test, expect } from '@playwright/test';

test.describe('Safari Regex Compatibility Tests', () => {
  test('should handle password validation without errors', async ({ page }) => {
    // Navigate to a page with the password form
    await page.goto('/apply/risk');
    
    // Wait for the form to be loaded
    await page.waitForSelector('form');

    // Try to submit with a complex password
    const password = 'Test123!@#';
    await page.fill('input[type="password"]', password);
    
    // Check that no regex errors appear in the console
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.click('button[type="submit"]');
    
    // Verify no regex-related errors occurred
    expect(errors.filter(e => e.includes('Invalid regular expression'))).toHaveLength(0);
  });

  test('should handle path checks without errors', async ({ page }) => {
    // Navigate to root to trigger language redirect
    await page.goto('/');
    
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Wait for navigation to complete
    await page.waitForURL(/\/(en|es)/);
    
    // Verify no regex-related errors occurred
    expect(errors.filter(e => e.includes('Invalid regular expression'))).toHaveLength(0);
  });
}); 