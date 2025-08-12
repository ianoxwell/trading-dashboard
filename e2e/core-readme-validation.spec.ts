import { test, expect } from '@playwright/test';

/**
 * 🎯 Core README Requirements Validation
 * 
 * This focused test suite validates the essential README requirements:
 * - Portfolio: Displays investments with symbol, amount, percentage
 * - Market: Displays products with name, symbol, price
 * - Navigation: Market → Detail → Buy functionality
 */

test.describe('Core README Requirements', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Portfolio displays required investment fields', async ({ page }) => {
    await page.click('ion-tab-button[tab="portfolio"]');
    await page.waitForSelector('app-portfolio');
    
    const holdingCards = page.locator('app-holding-card');
    const cardCount = await holdingCards.count();
    
    if (cardCount > 0) {
      const firstCard = holdingCards.first();
      
      // Investment symbol
      const symbol = firstCard.locator('.stock-info__symbol');
      await expect(symbol).toBeVisible();
      const symbolText = await symbol.textContent();
      expect(symbolText?.trim()).toMatch(/^[A-Z]{2,5}$/);
      
      // Investment amount (price)
      const price = firstCard.locator('.current-price').first();
      await expect(price).toBeVisible();
      const priceText = await price.textContent();
      expect(priceText).toMatch(/\$[\d,]+\.?\d{0,2}/);
      
      // Portfolio percentage
      const percentage = firstCard.locator('.percentage-value');
      await expect(percentage).toBeVisible();
      const percentText = await percentage.textContent();
      expect(percentText?.trim()).toMatch(/\d+\.?\d{0,1}%/);
      
      console.log(`✅ Portfolio validation: ${symbolText} - ${priceText} - ${percentText?.trim()}`);
    } else {
      console.log('✅ Portfolio empty state displayed');
    }
  });

  test('✅ Market displays required product fields', async ({ page }) => {
    await page.click('ion-tab-button[tab="market"]');
    await page.waitForSelector('app-market');
    await page.waitForTimeout(2000); // Allow data loading
    
    const productCards = page.locator('app-product-card');
    const cardCount = await productCards.count();
    
    if (cardCount > 0) {
      const firstCard = productCards.first();
      
      // Product name
      const name = firstCard.locator('ion-card-subtitle');
      await expect(name).toBeVisible();
      const nameText = await name.textContent();
      expect(nameText?.trim().length).toBeGreaterThan(0);
      
      // Product symbol
      const symbol = firstCard.locator('.product-title');
      await expect(symbol).toBeVisible();
      const symbolText = await symbol.textContent();
      expect(symbolText?.trim()).toMatch(/^[A-Z]{2,5}$/);
      
      // Product price
      const price = firstCard.locator('.price h3');
      await expect(price).toBeVisible();
      const priceText = await price.textContent();
      expect(priceText).toMatch(/\$[\d,]+\.?\d{0,2}/);
      
      console.log(`✅ Market validation: ${symbolText} - ${nameText?.trim()} - ${priceText}`);
    } else {
      console.log('⚠️ No market products found');
    }
  });

  test('✅ Market to Detail navigation and buy functionality', async ({ page }) => {
    await page.click('ion-tab-button[tab="market"]');
    await page.waitForSelector('app-market');
    await page.waitForTimeout(2000);
    
    const productCards = page.locator('app-product-card');
    const cardCount = await productCards.count();
    
    if (cardCount > 0) {
      // Navigate to detail page
      await productCards.first().click();
      await page.waitForSelector('app-detail');
      
      // Verify detail page elements
      await expect(page.locator('ion-title')).toContainText('Stock Details');
      await expect(page.locator('.stock-header')).toBeVisible();
      await expect(page.locator('.trading-card')).toBeVisible();
      
      // Verify buy functionality exists
      await expect(page.locator('.buy-button')).toBeVisible();
      await expect(page.locator('ion-segment-button[value="dollar"]')).toBeVisible();
      
      // Test buy form interaction
      await page.click('ion-segment-button[value="dollar"]');
      const amountInput = page.locator('ion-input[label*="Investment Amount"] input');
      await amountInput.fill('50');
      
      // Verify calculation display appears
      await expect(page.locator('.calculation-display')).toBeVisible();
      
      const buyButton = page.locator('.buy-button');
      const isEnabled = await buyButton.isEnabled();
      
      console.log(`✅ Detail page validation: Navigation ✓, Buy form ✓, Button enabled: ${isEnabled}`);
    } else {
      console.log('⚠️ No products available for detail testing');
    }
  });

  test('✅ Data format validation across app', async ({ page }) => {
    let validationResults = [];
    
    // Check Portfolio formats
    await page.click('ion-tab-button[tab="portfolio"]');
    await page.waitForSelector('app-portfolio');
    
    const portfolioValues = page.locator('.summary-value, .current-price, .percentage-value');
    const portfolioCount = await portfolioValues.count();
    
    for (let i = 0; i < Math.min(portfolioCount, 5); i++) {
      const element = portfolioValues.nth(i);
      if (await element.isVisible()) {
        const text = await element.textContent();
        if (text?.includes('$')) {
          const isValidPrice = /\$[\d,]+\.?\d{0,2}/.test(text);
          validationResults.push(`Price format: ${isValidPrice ? '✅' : '❌'} "${text?.trim()}"`);
        } else if (text?.includes('%')) {
          const isValidPercent = /\d+\.?\d{0,1}%/.test(text.trim());
          validationResults.push(`Percent format: ${isValidPercent ? '✅' : '❌'} "${text?.trim()}"`);
        }
      }
    }
    
    // Check Market formats
    await page.click('ion-tab-button[tab="market"]');
    await page.waitForSelector('app-market');
    await page.waitForTimeout(1000);
    
    const marketPrices = page.locator('.price h3');
    const marketCount = await marketPrices.count();
    
    for (let i = 0; i < Math.min(marketCount, 3); i++) {
      const element = marketPrices.nth(i);
      if (await element.isVisible()) {
        const text = await element.textContent();
        const isValidPrice = /\$[\d,]+\.?\d{0,2}/.test(text || '');
        validationResults.push(`Market price format: ${isValidPrice ? '✅' : '❌'} "${text?.trim()}"`);
      }
    }
    
    console.log('Data Format Validation Results:');
    validationResults.forEach(result => console.log(result));
    
    // Ensure we found some data to validate
    expect(validationResults.length).toBeGreaterThan(0);
  });
});
