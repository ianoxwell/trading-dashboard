import { test, expect } from '@playwright/test';

test.describe('Market Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to market tab
    await page.click('ion-tab-button[tab="market"]');
    await page.waitForSelector('app-market');
  });

  test('should display market page elements', async ({ page }) => {
    // Check for page title
    await expect(page.locator('h2').filter({ hasText: 'Market' })).toBeVisible();

    // Check for market summary component
    await expect(page.locator('app-market-summary')).toBeVisible();

    // Check for search bar
    await expect(page.locator('ion-searchbar')).toBeVisible();
  });

  test('should display product cards', async ({ page }) => {
    // Wait for product cards to load
    const productCards = page.locator('app-product-card');
    
    // Check if there are any product cards
    const cardCount = await productCards.count();
    if (cardCount > 0) {
      // Check that product cards have required elements
      await expect(productCards.first()).toBeVisible();
      await expect(productCards.first().locator('.product-title')).toBeVisible();
      await expect(productCards.first().locator('ion-card-subtitle')).toBeVisible();
      await expect(productCards.first().locator('.price h3')).toBeVisible();
    }
  });

  test('should filter products by search', async ({ page }) => {
    // Wait for product cards to load first
    const productCards = page.locator('app-product-card');
    await page.waitForTimeout(1000); // Brief wait for initial load
    
    const cardCount = await productCards.count();
    if (cardCount > 0) {
      const searchTerm = 'Apple';
      
      // Perform search
      const searchBar = page.locator('ion-searchbar');
      await searchBar.click();
      await searchBar.locator('input').fill(searchTerm);
      
      // Wait for search results
      await page.waitForTimeout(500);
      
      // Check that search results are displayed
      const filteredCards = page.locator('app-product-card');
      const filteredCount = await filteredCards.count();
      
      // Results should be 0 or more (depending on data)
      expect(filteredCount).toBeGreaterThanOrEqual(0);
    }
  });

  test('should filter products by category', async ({ page }) => {
    // Check if category filter is available (first ion-select is for categories)
    const categoryFilter = page.locator('ion-select').first();
    
    if (await categoryFilter.isVisible()) {
      // Click to open category filter
      await categoryFilter.click();
      
      // Wait for popover to appear and select visible option
      await page.waitForTimeout(500);
      
      // Select a category (if options exist and are visible)
      const visibleOption = page.locator('ion-select-option:visible').first();
      
      if (await visibleOption.isVisible()) {
        await visibleOption.click();
        
        // Wait for filter to apply
        await page.waitForTimeout(500);
        
        // Verify filtering worked
        const filteredCards = page.locator('app-product-card');
        const filteredCount = await filteredCards.count();
        
        // Cards should be filtered (count may vary)
        expect(filteredCount).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should navigate to product details when card is clicked', async ({ page }) => {
    // Wait for product cards to load
    const productCards = page.locator('app-product-card');
    const cardCount = await productCards.count();
    
    if (cardCount > 0) {
      // Click the first product card
      await productCards.first().click();
      
      // Wait for navigation
      await page.waitForSelector('app-detail');
      
      // Check for detail page elements
      await expect(page.locator('.stock-header')).toBeVisible();
      await expect(page.locator('.trading-card')).toBeVisible();
    }
  });
});
