import { EInstrumentCategory } from './category.model';

export interface IMarketProduct {
  id: string;
  symbol: string;
  name: string;
  description: string;
  category: EInstrumentCategory;
  price: number;
}
