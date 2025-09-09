import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should allow a user to sign up', async ({ page }) => {
    const username = `testuser_${Math.random().toString(36).substring(2, 10)}`;
    const password = 'password123';

    await page.goto('/signup');

    await page.fill('input[placeholder="John Doe"]', 'Test User');
    await page.fill('input[placeholder="johndoe"]', username);
    await page.fill('input[placeholder="Enter Password"]', password);
    await page.fill('input[placeholder="Confirm Password"]', password);
    await page.check('input[type="checkbox"] >> nth=0'); // Select the first gender checkbox

    await page.click('button:has-text("Sign Up")');

    // After signup, the user should be logged in and on the home page.
    // A good indicator of being on the home page is the presence of the logout button.
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should allow a user to login', async ({ page }) => {
    const username = `testuser_${Math.random().toString(36).substring(2, 10)}`;
    const password = 'password123';
    const fullName = 'Test User';
    const gender = 'male';

    // Create a new user via API
    const response = await page.request.post('/api/auth/signup', {
      data: {
        fullName,
        username,
        password,
        confirmPassword: password,
        gender,
      },
    });
    expect(response.ok()).toBeTruthy();

    await page.goto('/login');

    await page.fill('input[placeholder="Enter username"]', username);
    await page.fill('input[placeholder="Enter Password"]', password);

    await page.click('button:has-text("Login")');

    // After login, the user should be on the home page.
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });
});
