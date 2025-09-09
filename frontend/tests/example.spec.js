import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  
  // Wait for the page to load
  await page.waitForLoadState('networkidle');
  
  // Check that the page has loaded by looking for common elements
  await expect(page).toHaveTitle(/MERN Stack Project/i);
});