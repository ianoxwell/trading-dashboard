# Playwright E2E Testing Suite for Stake Dashboard

This directory contains end-to-end tests for the Stake Dashboard Angular application using Playwright.

## Setup

The Playwright testing suite is already configured. To run tests:

### Prerequisites

- Node.js 16+ (Node.js 18+ recommended for latest Playwright features)
- npm or yarn package manager

### Installation

```bash
# Install dependencies (if not already done)
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

### Local Development

```bash
# Run all tests headlessly
npm run e2e

# Run tests with browser visible (headed mode)
npm run e2e:headed

# Run tests in debug mode (step through tests)
npm run e2e:debug

# Run tests with UI mode (interactive)
npm run e2e:ui

# View test results report
npm run e2e:report
```

### Running Specific Tests

```bash
# Run a specific test file
npx playwright test app.spec.ts

# Run tests matching a pattern
npx playwright test --grep "Portfolio"

# Run tests in a specific browser
npx playwright test --project=chromium
```

## Test Structure

### Test Files

- `app.spec.ts` - Basic application loading and navigation tests
- `portfolio.spec.ts` - Portfolio page functionality tests
- `market.spec.ts` - Market page functionality tests  
- `detail.spec.ts` - Stock detail page tests
- `integration.spec.ts` - End-to-end workflow tests
- `test-helpers.ts` - Utility functions and custom assertions

### Test Organization

Each test file follows this structure:

```typescript
test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup for each test
  });

  test('should do something', async ({ page }) => {
    // Test implementation
  });
});
```

## Test Helpers

The `test-helpers.ts` file provides utility functions:

### TestHelpers Class

- `navigateToTab(tabName)` - Navigate between app tabs
- `waitForAppLoad()` - Wait for app initialization
- `isElementPresent(selector)` - Check element existence
- `searchInMarket(term)` - Perform market search
- `getElementCount(selector)` - Count visible elements
- `takeScreenshot(name)` - Capture screenshots

### StakeAssertions Class
- `assertPriceFormat(selector)` - Validate price formatting
- `assertPercentageFormat(selector)` - Validate percentage formatting
- `assertValidStockSymbol(selector)` - Validate stock symbol format
- `assertNavigationState(tab, component)` - Validate navigation

### Usage Example

```typescript
import { TestHelpers, StakeAssertions } from './test-helpers';

test('example test', async ({ page }) => {
  const helpers = new TestHelpers(page);
  const assertions = new StakeAssertions(page);
  
  await helpers.waitForAppLoad();
  await helpers.navigateToTab('portfolio');
  await assertions.assertNavigationState('portfolio', 'app-portfolio');
});
```

## Configuration

### Playwright Config (`playwright.config.ts`)

- **Test Directory**: `./e2e`
- **Base URL**: `http://localhost:4200`
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Web Server**: Automatically starts Angular dev server
- **Reports**: HTML reporter with screenshots and videos on failure

### Key Settings

- Tests run in parallel by default
- Screenshots captured on failure
- Videos recorded on failure
- Traces collected on retry

## Browser Support

Tests run across multiple browsers and devices:
- **Desktop**: Chrome, Firefox, Safari
- **Mobile**: Chrome (Pixel 5), Safari (iPhone 12)
- **Optional**: Edge, branded Chrome

## CI/CD Integration

### GitHub Actions
The `.github/workflows/playwright.yml` file configures automated testing:
- Runs on push/PR to main branches
- Tests against Node.js 18
- Uploads test reports and artifacts
- Fails builds on test failures

### Local CI Testing
```bash
# Simulate CI environment
CI=true npm run e2e
```

## Best Practices

### Test Writing
1. **Use Page Object Pattern**: Encapsulate page interactions in helper methods
2. **Wait for Elements**: Use `waitForSelector` instead of timeouts when possible
3. **Stable Selectors**: Prefer `data-testid` or semantic selectors over CSS classes
4. **Test Independence**: Each test should be independent and clean up after itself
5. **Error Handling**: Use try/catch for optional elements

### Debugging
1. **Use Debug Mode**: `npm run e2e:debug` for step-by-step execution
2. **Screenshots**: Automatically captured on failure
3. **Console Logs**: Check browser console for JavaScript errors
4. **Network Tab**: Monitor network requests in debug mode

### Performance
1. **Parallel Execution**: Tests run in parallel by default
2. **Selective Testing**: Use `--grep` to run specific test subsets
3. **Browser Reuse**: Configure browser reuse for faster test runs

## Troubleshooting

### Common Issues

#### Tests Timing Out
```bash
# Increase timeout in test
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
});
```

#### Elements Not Found
```typescript
// Wait for element before interaction
await page.waitForSelector('.my-element');
await page.click('.my-element');
```

#### Flaky Tests
```typescript
// Use retry mechanism
test('flaky test', async ({ page }) => {
  test.setTimeout(30000);
  // Test implementation with proper waits
});
```

### Debug Commands
```bash
# Run with verbose output
npx playwright test --reporter=line

# Generate trace files
npx playwright test --trace=on

# Run in headed mode with slow motion
npx playwright test --headed --slow-mo=1000
```

## Coverage and Reporting

### Test Reports
- **HTML Report**: Generated after test runs (`playwright-report/`)
- **Screenshots**: Captured on failures
- **Videos**: Recorded for failed tests
- **Traces**: Available for debugging

### Viewing Reports
```bash
# Open HTML report
npm run e2e:report

# Or manually
npx playwright show-report
```

## Contributing

When adding new tests:
1. Follow existing naming conventions
2. Add appropriate assertions
3. Use test helpers when possible
4. Update this documentation for new patterns
5. Ensure tests are stable and independent

## Environment Variables

Set these for different test environments:
```bash
# Base URL for tests
PLAYWRIGHT_BASE_URL=http://localhost:4200

# CI mode
CI=true

# Browser selection
PLAYWRIGHT_BROWSER=chromium
```
