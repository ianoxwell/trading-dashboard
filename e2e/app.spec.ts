import { test, expect } from '@playwright/test';

test.describe('Stake Dashboard App', () => {
  test('should load the application successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the app to load
    await page.waitForLoadState('networkidle');
    
    // Check that the app container is present
    await expect(page.locator('ion-app')).toBeVisible();
    
    // Check for the presence of the tab navigation
    await expect(page.locator('ion-tab-bar')).toBeVisible();
    
    // Verify the page title
    await expect(page).toHaveTitle(/StakeDashboard/);
  });

  test('should navigate between tabs', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to Portfolio tab
    await page.click('ion-tab-button[tab="portfolio"]');
    await expect(page.locator('app-portfolio')).toBeVisible();
    
    // Navigate to Market tab
    await page.click('ion-tab-button[tab="market"]');
    await expect(page.locator('app-market')).toBeVisible();
  });

  test('should display header component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that the header is visible
    await expect(page.locator('app-header')).toBeVisible();
  });
});
