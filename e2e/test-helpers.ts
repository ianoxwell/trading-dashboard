import { Page, expect } from '@playwright/test';

/**
 * Common test utilities for Stake Dashboard E2E tests
 */

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to a specific tab and wait for it to load
   */
  async navigateToTab(tabName: 'portfolio' | 'market'): Promise<void> {
    await this.page.click(`ion-tab-button[tab="${tabName}"]`);
    await this.page.waitForSelector(`app-${tabName}`);
    await this.page.waitForTimeout(1000); // Allow content to load
  }

  /**
   * Wait for the app to fully load
   */
  async waitForAppLoad(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('ion-app');
  }

  /**
   * Check if an element is present without throwing an error
   */
  async isElementPresent(selector: string): Promise<boolean> {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Fill an input field and verify the value
   */
  async fillAndVerifyInput(selector: string, value: string): Promise<void> {
    await this.page.fill(selector, value);
    await expect(this.page.locator(selector)).toHaveValue(value);
  }

  /**
   * Wait for network requests to complete (useful for API calls)
   */
  async waitForNetworkIdle(timeout = 5000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }

  /**
   * Take a screenshot with a descriptive name
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `e2e/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Check if the current page is the expected page
   */
  async verifyCurrentPage(expectedComponent: string): Promise<void> {
    await expect(this.page.locator(expectedComponent)).toBeVisible();
  }

  /**
   * Search for a term in the market search bar
   */
  async searchInMarket(searchTerm: string): Promise<void> {
    await this.navigateToTab('market');
    const searchBar = this.page.locator('#marketSearchBar input');
    await searchBar.fill(searchTerm);
    await this.page.waitForTimeout(1000); // Wait for search results
  }

  /**
   * Get the count of visible elements matching a selector
   */
  async getElementCount(selector: string): Promise<number> {
    try {
      await this.page.waitForSelector(selector, { timeout: 2000 });
      return await this.page.locator(selector).count();
    } catch {
      return 0;
    }
  }

  /**
   * Check if the app is in mobile viewport
   */
  isMobileViewport(): boolean {
    const viewport = this.page.viewportSize();
    return viewport ? viewport.width <= 768 : false;
  }

  /**
   * Handle modal dialogs if they appear
   */
  async handleModalIfPresent(modalSelector = 'ion-modal, ion-alert, ion-popover'): Promise<void> {
    const modal = this.page.locator(modalSelector);
    if (await modal.isVisible()) {
      // Try to close the modal (adjust based on your modal structure)
      const closeButton = modal.locator('ion-button:has-text("Close"), ion-button:has-text("Cancel"), .close-button');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  }

  /**
   * Wait for loading indicators to disappear
   */
  async waitForLoadingToComplete(): Promise<void> {
    const loadingIndicators = [
      'ion-loading',
      'ion-spinner',
      '.loading',
      '.spinner',
      '[data-testid="loading"]'
    ];

    for (const indicator of loadingIndicators) {
      try {
        await this.page.waitForSelector(indicator, { state: 'hidden', timeout: 10000 });
      } catch {
        // Ignore if loading indicator doesn't exist
      }
    }
  }

  /**
   * Verify that a toast message appears
   */
  async verifyToastMessage(expectedMessage?: string): Promise<void> {
    const toast = this.page.locator('ion-toast');
    await expect(toast).toBeVisible();
    
    if (expectedMessage) {
      await expect(toast).toContainText(expectedMessage);
    }
    
    // Wait for toast to disappear
    await toast.waitFor({ state: 'hidden', timeout: 5000 });
  }
}

/**
 * Mock data generators for testing
 */
export class MockDataGenerators {
  static generateMockStock() {
    return {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 150.00,
      category: 'Equity',
      change: 2.50,
      changePercent: 1.69
    };
  }

  static generateMockPortfolioHolding() {
    return {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      quantity: 10,
      avgBuyPrice: 145.00,
      currentPrice: 150.00,
      totalValue: 1500.00,
      gainLoss: 50.00,
      gainLossPercent: 3.45
    };
  }
}

/**
 * Custom assertions for the Stake Dashboard
 */
export class StakeAssertions {
  constructor(private page: Page) {}

  /**
   * Assert that a price is formatted correctly
   */
  async assertPriceFormat(selector: string): Promise<void> {
    const priceText = await this.page.locator(selector).first().textContent();
    expect(priceText).toMatch(/^\$[\d,]+\.?\d{0,2}$/); // Matches $1,234.56 format
  }

  /**
   * Assert that a percentage is formatted correctly
   */
  async assertPercentageFormat(selector: string): Promise<void> {
    const percentText = await this.page.locator(selector).first().textContent();
    const trimmedText = percentText?.trim() || '';
    expect(trimmedText).toMatch(/^[(\s]*[+-]?\d+\.?\d{0,2}%[\s)]*$/); // Matches (+1.23%) format with optional whitespace and parentheses
  }

  /**
   * Assert that a stock symbol is valid
   */
  async assertValidStockSymbol(selector: string): Promise<void> {
    const symbolText = await this.page.locator(selector).textContent();
    expect(symbolText).toMatch(/^[A-Z]{1,5}$/); // 1-5 uppercase letters
  }

  /**
   * Assert that navigation is working correctly
   */
  async assertNavigationState(expectedTab: string, expectedComponent: string): Promise<void> {
    // Check displayed component first (more reliable)
    await expect(this.page.locator(expectedComponent)).toBeVisible();
    
    // Check active tab
    const activeTab = this.page.locator(`ion-tab-button[tab="${expectedTab}"]`);
    await expect(activeTab).toBeVisible();
  }
}
