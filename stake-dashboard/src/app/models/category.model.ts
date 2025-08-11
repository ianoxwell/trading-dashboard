export enum EInstrumentCategory {
  EQUITY = 'Equity',
  ETF = 'ETF',
  BOND_FUND = 'Bond Fund',
  SUSTAINABLE_FUND = 'Sustainable Fund',
  INCOME_FUND = 'Income Fund',
  THEMATIC_FUND = 'Thematic Fund',
  COMMODITY_FUND = 'Commodity Fund'
}

export const CATEGORY_COLORS: Record<EInstrumentCategory, string> = {
  [EInstrumentCategory.EQUITY]: 'primary',
  [EInstrumentCategory.ETF]: 'secondary',
  [EInstrumentCategory.BOND_FUND]: 'success',
  [EInstrumentCategory.SUSTAINABLE_FUND]: 'warning',
  [EInstrumentCategory.INCOME_FUND]: 'tertiary',
  [EInstrumentCategory.THEMATIC_FUND]: 'dark',
  [EInstrumentCategory.COMMODITY_FUND]: 'medium'
};

export const CATEGORY_LABELS: Record<EInstrumentCategory, string> = {
  [EInstrumentCategory.EQUITY]: 'Equity',
  [EInstrumentCategory.ETF]: 'ETF',
  [EInstrumentCategory.BOND_FUND]: 'Bond Fund',
  [EInstrumentCategory.SUSTAINABLE_FUND]: 'Sustainable Fund',
  [EInstrumentCategory.INCOME_FUND]: 'Income Fund',
  [EInstrumentCategory.THEMATIC_FUND]: 'Thematic Fund',
  [EInstrumentCategory.COMMODITY_FUND]: 'Commodity Fund'
};

export const ALL_CATEGORIES = Object.values(EInstrumentCategory);

export type InstrumentCategoryType = EInstrumentCategory;
