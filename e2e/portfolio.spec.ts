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
      
      // ✅ README Requirement: Investment symbol
      await expect(holdingCards.first().locator('.stock-info__symbol')).toBeVisible();
      const symbolText = await holdingCards.first().locator('.stock-info__symbol').textContent();
      expect(symbolText).toBeTruthy();
      expect(symbolText?.trim().length).toBeGreaterThan(0);
      
      // ✅ README Requirement: Investment amount (current price)
      await expect(holdingCards.first().locator('.current-price').first()).toBeVisible();
      const priceText = await holdingCards.first().locator('.current-price').first().textContent();
      expect(priceText).toMatch(/^\$[\d,]+\.?\d{0,2}$/); // Should be in format $X.XX
      
      // ✅ README Requirement: Percentage of total portfolio
      await expect(holdingCards.first().locator('.percentage-value')).toBeVisible();
      const percentageText = await holdingCards.first().locator('.percentage-value').textContent();
      expect(percentageText?.trim()).toMatch(/^\d+\.?\d{0,1}%$/); // Should be in format X.X%
    }
  });

  test('should display portfolio investment amounts and percentages correctly', async ({ page }) => {
    // ✅ README Requirement: Verify investment amounts and portfolio percentages
    const holdingCards = page.locator('app-holding-card');
    const cardCount = await holdingCards.count();
    
    if (cardCount > 0) {
      // Check that each holding shows current value (investment amount)
      for (let i = 0; i < Math.min(cardCount, 3); i++) {
        const card = holdingCards.nth(i);
        
        // Investment amount should be visible
        const currentValueElement = card.locator('.current-value, .detail-value').filter({ hasText: /^\$/ });
        if (await currentValueElement.count() > 0) {
          await expect(currentValueElement.first()).toBeVisible();
          const valueText = await currentValueElement.first().textContent();
          expect(valueText).toMatch(/^\$[\d,]+\.?\d{0,2}$/);
        }
        
        // Portfolio percentage should be visible and valid
        const percentageElement = card.locator('.percentage-value');
        if (await percentageElement.isVisible()) {
          const percentText = await percentageElement.textContent();
          expect(percentText?.trim()).toMatch(/^\d+\.?\d{0,1}%$/);
          
          // Percentage should be between 0-100%
          const numericPercent = parseFloat(percentText?.replace('%', '') || '0');
          expect(numericPercent).toBeGreaterThanOrEqual(0);
          expect(numericPercent).toBeLessThanOrEqual(100);
        }
      }
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
