import { EInstrumentCategory } from './category.model';

export interface IPortfolio {
  id: string; // UUID of the holding
  symbol: string; // Ticker symbol, e.g. TSLA
  name: string; // Security name
  category: EInstrumentCategory; // e.g., Equity, ETF, Bond Fund
  quantity: number; // Units held
  avgBuyPrice: number; // Average cost basis per unit
  isNew?: boolean;
  currentValue?: number; // Optional for current value calculation
  percentTotal?: number; // Optional for percent of total portfolio calculation
  currentPrice?: number; // Current market price per unit
  totalGainLoss?: number; // Total gain/loss in dollars
  totalGainLossPercent?: number; // Total gain/loss as percentage
  dailyGainLoss?: number; // Daily gain/loss in dollars
  dailyGainLossPercent?: number; // Daily gain/loss as percentage
  isUp?: boolean; // Whether the position is up or down for the day
}
