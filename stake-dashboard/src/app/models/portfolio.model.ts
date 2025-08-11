export interface IPortfolio {
  id: string;        // UUID of the holding
  symbol: string;    // Ticker symbol, e.g. TSLA
  name: string;      // Security name
  category: string;  // e.g., Equity, ETF, Bond Fund
  quantity: number;  // Units held
  avgBuyPrice: number; // Average cost basis per unit
}
