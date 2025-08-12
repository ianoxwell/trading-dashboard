import { EInstrumentCategory } from './category.model';

export interface IInstrument {
  id: string;          // UUID of the instrument
  name: string;        // Display name
  symbol: string;      // Ticker symbol
  description: string; // Human-readable summary
  category: EInstrumentCategory; // Instrument category enum
}
