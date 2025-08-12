import { EInstrumentCategory } from './category.model';

export interface IMarketProduct {
  id: string;
  symbol: string;
  name: string;
  description: string;
  category: EInstrumentCategory;
  price: number;
  dailyChange?: number; // Daily change percentage
  isUp?: boolean; // Whether the price is up or down today
}
