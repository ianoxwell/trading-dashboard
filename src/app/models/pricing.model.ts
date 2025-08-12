/**
 * Basic price interface for individual stocks, matching src/assets/data/pricing.json
 */
export interface IPrice {
  id: string;
  symbol: string;
  price: number;
}

/**
 * Extended price data with daily tracking and calculations
 */
export interface IPriceData extends IPrice {
  openingPrice: number;
  dailyChange: number;
  dailyChangePercent: number;
  isUp: boolean;
  lastUpdated: Date;
}

/**
 * Market summary statistics and trend information
 */
export interface IMarketSummary {
  totalSymbols: number;
  symbolsUp: number;
  symbolsDown: number;
  symbolsFlat: number;
  marketTrend: 'up' | 'down' | 'mixed';
  lastUpdated: Date;
}
