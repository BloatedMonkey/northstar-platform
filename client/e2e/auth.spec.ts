/**
 * @author Arman Hazrati
 * E2E tests for authentication flows
 */
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByPlaceholder(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.getByPlaceholder(/email/i).fill('invalid-email');
    await page.getByPlaceholder(/password/i).fill('123');
    await page.getByRole('button', { name: /sign in/i }).click();

    await expect(page.getByText(/invalid email/i)).toBeVisible();
    await expect(page.getByText(/password must be at least/i)).toBeVisible();
  });

  test('should switch to registration form', async ({ page }) => {
    await page.getByRole('button', { name: /don't have an account/i }).click();
    await expect(page.getByRole('heading', { name: /get started/i })).toBeVisible();
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
  });

  test('should display registration form fields', async ({ page }) => {
    await page.getByRole('button', { name: /don't have an account/i }).click();

    await expect(page.getByPlaceholder(/full name/i)).toBeVisible();
    await expect(page.getByPlaceholder(/email/i)).toBeVisible();
    await expect(page.getByRole('combobox', { name: /account type/i })).toBeVisible();
    await expect(page.getByPlaceholder(/password/i).first()).toBeVisible();
    await expect(page.getByPlaceholder(/confirm password/i)).toBeVisible();
  });

  test('should show password mismatch error', async ({ page }) => {
    await page.getByRole('button', { name: /don't have an account/i }).click();

    await page.getByPlaceholder(/full name/i).fill('John Doe');
    await page.getByPlaceholder(/email/i).fill('john@example.com');
    await page.getByPlaceholder(/password/i).first().fill('Password123');
    await page.getByPlaceholder(/confirm password/i).fill('Password456');
    await page.getByRole('button', { name: /create account/i }).click();

    await expect(page.getByText(/passwords don't match/i)).toBeVisible();
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/');
  });
});
