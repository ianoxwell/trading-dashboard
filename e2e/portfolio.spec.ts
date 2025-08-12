import { test, expect } from '@playwright/test';

test.describe('Portfolio Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to portfolio tab
    await page.click('ion-tab-button[tab="portfolio"]');
    await page.waitForSelector('app-portfolio');
  });

  test('should display portfolio page elements', async ({ page }) => {
    // Check for page title
    await expect(page.locator('h2').filter({ hasText: 'Portfolio' })).toBeVisible();
    
    // Check for account summary section
    await expect(page.locator('.summary-card')).toBeVisible();
    
    // Check for portfolio value display
    await expect(page.locator('.summary-value.portfolio')).toBeVisible();

    // Check for holdings section
    await expect(page.locator('.holdings-section')).toBeVisible();
  });

  test('should display holding cards when portfolio has data', async ({ page }) => {
    // Wait for any holding cards to load
    const holdingCards = page.locator('app-holding-card');
    
    // If portfolio has data, cards should be visible
    const cardCount = await holdingCards.count();
    if (cardCount > 0) {
      await expect(holdingCards.first()).toBeVisible();
      
      // Check that holding cards have required elements
      await expect(holdingCards.first().locator('.stock-info__symbol')).toBeVisible();
      await expect(holdingCards.first().locator('.current-price').first()).toBeVisible();
    }
  });

  test('should allow sorting of holdings', async ({ page }) => {
    // Check if sort controls are present
    const sortSegment = page.locator('.sort-segment');
    
    if (await sortSegment.isVisible()) {
      // Test sorting functionality
      await page.click('ion-segment-button[value="name"]');
      
      // Verify the selection was made by checking if the button is selected
      await expect(page.locator('ion-segment-button[value="name"]')).toHaveClass(/segment-button-checked/);
    }
  });

  test('should navigate to holding details when card is clicked', async ({ page }) => {
    // Wait for holding cards to load
    const holdingCards = page.locator('app-holding-card');
    const cardCount = await holdingCards.count();
    
    if (cardCount > 0) {
      // Click the first holding card (it's a button)
      await holdingCards.first().click();
      
      // Should navigate to detail page
      await expect(page.locator('app-detail')).toBeVisible();
      await expect(page.locator('ion-title')).toContainText('Stock Details');
    }
  });

  test('should display empty state when no holdings', async ({ page }) => {
    // This test assumes the portfolio might be empty
    // Check for empty state messaging if no holding cards are present
    const holdingCards = page.locator('app-holding-card');
    const cardCount = await holdingCards.count();
    
    if (cardCount === 0) {
      // Look for empty state message
      const emptyState = page.locator('.empty-state');
      await expect(emptyState).toBeVisible();
      await expect(emptyState.locator('h3')).toContainText('No Holdings Yet');
    }
  });
});
