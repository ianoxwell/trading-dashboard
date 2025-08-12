import { test, expect } from '@playwright/test';

test.describe('Stock Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to market to find a stock to view details
    await page.click('ion-tab-button[tab="market"]');
    await page.waitForSelector('app-market');
    await page.waitForTimeout(2000);
    
    // Click on the first product card to navigate to details
    const productCards = page.locator('app-product-card');
    const cardCount = await productCards.count();
    
    if (cardCount > 0) {
      await productCards.first().click();
      await page.waitForSelector('app-detail');
    }
  });

  test('should display stock detail page elements', async ({ page }) => {
    // Check for navigation buttons
    await expect(page.locator('ion-button:has(ion-icon[name="arrow-back"])')).toBeVisible();
    await expect(page.locator('ion-button:has(ion-icon[name="close"])')).toBeVisible();
    
    // Check for page title
    await expect(page.locator('ion-title')).toContainText('Stock Details');
    
    // Check for stock header information
    await expect(page.locator('.stock-header')).toBeVisible();
    await expect(page.locator('.stock-symbol')).toBeVisible();
    await expect(page.locator('.stock-name')).toBeVisible();
    await expect(page.locator('.stock-price .current-price')).toBeVisible();
  });

  test('should display stock information correctly', async ({ page }) => {
    // Check that stock symbol and name are displayed
    const stockSymbol = page.locator('.stock-symbol');
    const stockName = page.locator('.stock-name');
    
    await expect(stockSymbol).toBeVisible();
    await expect(stockName).toBeVisible();
    
    // Check that the symbol is not empty
    const symbolText = await stockSymbol.textContent();
    expect(symbolText).toBeTruthy();
    expect(symbolText?.trim().length).toBeGreaterThan(0);
    
    // Check that current price is displayed in the price section
    await expect(page.locator('.stock-price .current-price')).toBeVisible();
    
    // Check for category chip in the stock header - use more specific selector
    await expect(page.locator('.stock-header .category-chip')).toBeVisible();
  });

  test('should display trading form', async ({ page }) => {
    // Check for trading card
    await expect(page.locator('.trading-card')).toBeVisible();
    
    // Check for order type segment
    await expect(page.locator('.order-type-tabs ion-segment')).toBeVisible();
    
    // Check for input fields
    await expect(page.locator('ion-input')).toBeVisible();
    
    // Check for buy button
    await expect(page.locator('.buy-button')).toBeVisible();
  });

  test('should handle order type switching', async ({ page }) => {
    // Switch to quantity order
    await page.click('ion-segment-button[value="quantity"]');
    await page.waitForTimeout(500);
    
    // Switch back to dollar order
    await page.click('ion-segment-button[value="dollar"]');
    await page.waitForTimeout(500);
    
    // Verify the switching worked
    await expect(page.locator('ion-segment-button[value="dollar"]')).toHaveClass(/segment-button-checked/);
  });

  test('should navigate back correctly', async ({ page }) => {
    // Click back button
    await page.click('ion-button:has(ion-icon[name="arrow-back"])');
    
    // Should return to market page
    await expect(page.locator('app-market')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Market' })).toBeVisible();
  });

  test('should close and navigate to market', async ({ page }) => {
    // Click close button
    await page.click('ion-button:has(ion-icon[name="close"])');
    
    // Should navigate to market page
    await expect(page.locator('app-market')).toBeVisible();
    await expect(page.locator('h2').filter({ hasText: 'Market' })).toBeVisible();
  });

  test('should display wallet information', async ({ page }) => {
    // Check for wallet card
    await expect(page.locator('.wallet-card')).toBeVisible();
  });

  test('should show estimated calculations', async ({ page }) => {
    // Enter a dollar amount to trigger calculations
    await page.click('ion-segment-button[value="dollar"]');
    await page.fill('ion-input[label*="Investment Amount"] input', '100');
    
    // Check for calculation display
    await expect(page.locator('.calculation-display')).toBeVisible();
  });
});
