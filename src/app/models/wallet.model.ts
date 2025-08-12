export interface IWallet {
  balance: number;
  currency: string;
}

export interface ITradeOrder {
  id: string;
  symbol: string;
  productName: string;
  type: 'buy' | 'sell';
  orderType: 'dollar' | 'quantity';
  dollarAmount?: number;
  quantity?: number;
  price: number;
  totalValue: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}

export interface IPendingTrade {
  id: string;
  symbol: string;
  productName: string;
  quantity: number;
  price: number;
  totalValue: number;
  timestamp: Date;
  timeoutId?: any;
}
