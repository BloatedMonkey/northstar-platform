/**
 * @author Arman Hazrati
 * E2E tests for homepage
 */
import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display main heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /enterprise service/i })).toBeVisible();
  });

  test('should display feature cards', async ({ page }) => {
    await expect(page.getByText(/enterprise ready/i)).toBeVisible();
    await expect(page.getByText(/secure by default/i)).toBeVisible();
    await expect(page.getByText(/real-time updates/i)).toBeVisible();
    await expect(page.getByText(/multi-tenancy/i)).toBeVisible();
  });

  test('should display tech stack badges', async ({ page }) => {
    await expect(page.getByText(/next\.js 14/i)).toBeVisible();
    await expect(page.getByText(/nestjs/i)).toBeVisible();
    await expect(page.getByText(/typescript/i)).toBeVisible();
    await expect(page.getByText(/postgresql/i)).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await expect(page.getByRole('link', { name: /features/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /docs/i })).toBeVisible();
  });

  test('should display footer with copyright', async ({ page }) => {
    await expect(page.getByText(/arman hazrati/i)).toBeVisible();
    await expect(page.getByText(/mit license/i)).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByRole('heading', { name: /enterprise service/i })).toBeVisible();

    // Tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.getByRole('heading', { name: /enterprise service/i })).toBeVisible();

    // Mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByRole('heading', { name: /enterprise service/i })).toBeVisible();
  });
});
