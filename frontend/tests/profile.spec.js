import { test, expect } from '@playwright/test';

test.describe('Profile Management', () => {
  let user;

  test.beforeAll(async ({ request }) => {
    // Create a new user for the test suite
    const username = `testuser_${Math.random().toString(36).substring(2, 10)}`;
    const password = 'password123';
    const fullName = 'Test User';
    const gender = 'male';

    const response = await request.post('/api/auth/signup', {
      data: {
        fullName,
        username,
        password,
        confirmPassword: password,
        gender,
      },
    });
    expect(response.ok()).toBeTruthy();
    user = { username, password, fullName, gender };
  });

  test.beforeEach(async ({ page }) => {
    // Log in before each test
    await page.goto('/login');
    await page.fill('input[placeholder="Enter username"]', user.username);
    await page.fill('input[placeholder="Enter Password"]', user.password);
    await page.click('button:has-text("Login")');
    await expect(page.locator('button:has-text("Logout")')).toBeVisible();
  });

  test('should allow a user to update their profile', async ({ page }) => {
    // Navigate to the profile page
    await page.click('a[href="/profile"]');
    await expect(page).toHaveURL('/profile');

    // Go to the update page
    await page.click('button:has-text("Edit Profile")');
    await expect(page).toHaveURL('/update-profile');

    const newFullName = 'Updated Test User';
    await page.fill('label:has-text("Full Name") >> .. >> input', newFullName);
    await page.click('button:has-text("Update Profile")');

    // Assert that a success toast is shown
    await expect(page.locator('.hot-toast-success')).toBeVisible();
  });

  test('should allow a user to delete their profile', async ({ page }) => {
    // Navigate to the profile page
    await page.click('a[href="/profile"]');
    await expect(page).toHaveURL('/profile');

    // Go to the update page
    await page.click('button:has-text("Edit Profile")');
    await expect(page).toHaveURL('/update-profile');

    await page.click('button:has-text("Delete Profile")');

    // Click the confirm button in the toast
    await page.click('button:has-text("Yes, Delete")');

    // Assert that the user is redirected to the login page
    await expect(page.locator('a[href="/signup"]')).toBeVisible();

    // Try to log in with the deleted user's credentials
    await page.goto('/login');
    await page.fill('input[placeholder="Enter username"]', user.username);
    await page.fill('input[placeholder="Enter Password"]', user.password);
    await page.click('button:has-text("Login")');

    // Assert that an error toast is shown
    await expect(page.locator('.hot-toast-error')).toBeVisible();
  });
});
