export interface IInstrument {
  id: string;          // UUID of the instrument
  name: string;        // Display name
  symbol: string;      // Ticker symbol
  description: string; // Human-readable summary
  category: string;    // e.g., ETF, Stock, Bond
}
