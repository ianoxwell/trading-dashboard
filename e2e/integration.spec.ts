import { test, expect } from '@playwright/test';
import { TestHelpers, StakeAssertions } from './test-helpers';

test.describe('Stake Dashboard - Integration Tests with Helpers', () => {
  let testHelpers: TestHelpers;
  let stakeAssertions: StakeAssertions;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
    stakeAssertions = new StakeAssertions(page);
    
    await testHelpers.waitForAppLoad();
  });

  test('should navigate through the app workflow', async ({ page }) => {
    // Start at portfolio
    await testHelpers.navigateToTab('portfolio');
    await stakeAssertions.assertNavigationState('portfolio', 'app-portfolio');

    // Navigate to market
    await testHelpers.navigateToTab('market');
    await stakeAssertions.assertNavigationState('market', 'app-market');

    // Search for a stock
    await testHelpers.searchInMarket('AAPL');
    
    // Check if we have search results
    const productCount = await testHelpers.getElementCount('app-product-card');
    
    if (productCount > 0) {
      // Click on first product to view details
      await page.click('app-product-card:first-child');
      await testHelpers.verifyCurrentPage('app-detail');
      
      // Verify stock symbol format
      if (await testHelpers.isElementPresent('.stock-symbol')) {
        await stakeAssertions.assertValidStockSymbol('.stock-symbol');
      }
      
      // Verify price format
      if (await testHelpers.isElementPresent('.current-price')) {
        await stakeAssertions.assertPriceFormat('.current-price');
      }
      
      // Navigate back
      await page.click('ion-button:has(ion-icon[name="arrow-back"])');
      await testHelpers.verifyCurrentPage('app-market');
    }
  });

  test('should handle mobile and desktop viewports', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    await testHelpers.navigateToTab('portfolio');
    
    // Check if desktop-specific elements are visible
    const isMobile = testHelpers.isMobileViewport();
    expect(isMobile).toBeFalsy();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile-specific behavior
    const isMobileNow = testHelpers.isMobileViewport();
    expect(isMobileNow).toBeTruthy();
  });

  test('should handle loading states properly', async ({ page }) => {
    await testHelpers.navigateToTab('market');
    
    // Wait for any loading to complete
    await testHelpers.waitForLoadingToComplete();
    
    // Verify content is loaded
    await testHelpers.verifyCurrentPage('app-market');
    
    // Check for market summary
    if (await testHelpers.isElementPresent('app-market-summary')) {
      await expect(page.locator('app-market-summary')).toBeVisible();
    }
  });

  test('should validate data formats across the app', async ({ page }) => {
    // Test portfolio data formats
    await testHelpers.navigateToTab('portfolio');
    
    const holdingCards = await testHelpers.getElementCount('app-holding-card');
    
    if (holdingCards > 0) {
      // Check price format in holding cards
      if (await testHelpers.isElementPresent('app-holding-card .current-price')) {
        await stakeAssertions.assertPriceFormat('app-holding-card:first-child .current-price');
      }
      
      // Check percentage format
      if (await testHelpers.isElementPresent('app-holding-card .percentage')) {
        await stakeAssertions.assertPercentageFormat('app-holding-card:first-child .percentage');
      }
    }
    
    // Test market data formats
    await testHelpers.navigateToTab('market');
    
    const productCards = await testHelpers.getElementCount('app-product-card');
    
    if (productCards > 0) {
      // Check stock symbol format
      if (await testHelpers.isElementPresent('app-product-card .product-symbol')) {
        await stakeAssertions.assertValidStockSymbol('app-product-card:first-child .product-symbol');
      }
      
      // Check price format
      if (await testHelpers.isElementPresent('app-product-card .product-price')) {
        await stakeAssertions.assertPriceFormat('app-product-card:first-child .product-price');
      }
    }
  });
});
