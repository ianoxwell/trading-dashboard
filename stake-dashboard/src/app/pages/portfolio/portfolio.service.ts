import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TradingService } from '@core/trading.service';
import { IPortfolio } from '@models/portfolio.model';
import { ITradeOrder } from '@models/wallet.model';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioSubject = new BehaviorSubject<IPortfolio[] | null>(null);
  private newItemsSubject = new BehaviorSubject<string[]>([]);
  private processedTradeIds = new Set<string>(); // Track processed trades

  public portfolio$ = this.portfolioSubject.asObservable();
  public newItems$ = this.newItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tradingService: TradingService
  ) {}

  getPortfolio(): Observable<IPortfolio[]> {
    // If data is already loaded, combine it with current trades
    if (this.portfolioSubject.value !== null) {
      return combineLatest([this.portfolioSubject.asObservable() as Observable<IPortfolio[]>, this.tradingService.tradeHistory$]).pipe(
        map(([portfolio, trades]) => this.mergePortfolioWithTrades(portfolio, trades))
      );
    }

    // Load data from JSON file and cache it, then combine with trades
    return this.http.get<IPortfolio[]>('assets/data/portfolio.json').pipe(
      map((portfolio) => portfolio.map((item) => ({ ...item, isNew: false }))),
      switchMap((portfolio) => {
        this.portfolioSubject.next(portfolio);
        return combineLatest([of(portfolio), this.tradingService.tradeHistory$]);
      }),
      map(([portfolio, trades]) => {
        const result = this.mergePortfolioWithTrades(portfolio, trades);
        return result;
      })
    );
  }

  private mergePortfolioWithTrades(portfolio: IPortfolio[], trades: ITradeOrder[]): IPortfolio[] {
    const completedTrades = trades.filter((trade) => trade.status === 'completed');
    const newTrades = completedTrades.filter((trade) => !this.processedTradeIds.has(trade.id));

    if (newTrades.length === 0) {
      return portfolio; // No new trades to process
    }

    const updatedPortfolio = structuredClone(portfolio);

    newTrades.forEach((trade) => {
      // Mark this trade as processed
      this.processedTradeIds.add(trade.id);

      // Check if this symbol already exists in portfolio
      const existingIndex = updatedPortfolio.findIndex((item: IPortfolio) => item.symbol === trade.symbol);

      if (existingIndex >= 0) {
        // Update existing holding
        const existing = updatedPortfolio[existingIndex];
        const newQuantity = existing.quantity + trade.quantity!;
        const newTotalValue = existing.quantity * existing.avgBuyPrice + trade.quantity! * trade.price;
        const newAveragePrice = newTotalValue / newQuantity;

        updatedPortfolio[existingIndex] = {
          ...existing,
          quantity: newQuantity,
          avgBuyPrice: newAveragePrice,
          isNew: true
        };

        this.addToNewItems(trade.symbol);
      } else {
        // Add new holding
        const newHolding: IPortfolio = {
          id: `new_${trade.id}`,
          symbol: trade.symbol,
          name: trade.productName,
          category: 'Equity', // Default category, could be enhanced
          quantity: trade.quantity!,
          avgBuyPrice: trade.price,
          isNew: true
        };

        updatedPortfolio.unshift(newHolding); // Add to beginning for prominence
        this.addToNewItems(trade.symbol);
      }
    });

    return updatedPortfolio;
  }

  // Simple method to add items to new items list - component will handle timers
  addToNewItems(symbol: string): void {
    const currentNewItems = this.newItemsSubject.value;
    if (!currentNewItems.includes(symbol)) {
      this.newItemsSubject.next([...currentNewItems, symbol]);
    }
  }

  // Method to remove new item status - called by component
  removeNewItemStatus(symbol: string): void {
    const portfolio = this.portfolioSubject.value;
    if (portfolio) {
      const updated = portfolio.map((item) => (item.symbol === symbol ? { ...item, isNew: false } : item));
      this.portfolioSubject.next(updated);
    }

    // Remove from new items list
    const newItems = this.newItemsSubject.value;
    this.newItemsSubject.next(newItems.filter((item) => item !== symbol));
  }

  // Clear all new item statuses - called when component is destroyed or refreshed
  clearAllNewItemStatuses(): void {
    const portfolio = this.portfolioSubject.value;
    if (portfolio) {
      const updated = portfolio.map((item) => ({ ...item, isNew: false }));
      this.portfolioSubject.next(updated);
    }
    this.newItemsSubject.next([]);
  }

  getTotalPortfolioValue(): Observable<number> {
    return this.getPortfolio().pipe(
      map((portfolio) => {
        if (!portfolio || portfolio.length === 0) return 0;
        return portfolio.reduce((total, item) => total + item.quantity * item.avgBuyPrice, 0);
      })
    );
  }

  getCombinedValue(): Observable<{ portfolioValue: number; walletBalance: number; totalValue: number }> {
    return combineLatest([this.getTotalPortfolioValue(), this.tradingService.wallet$]).pipe(
      map(([portfolioValue, wallet]) => ({
        portfolioValue,
        walletBalance: wallet.balance,
        totalValue: portfolioValue + wallet.balance
      }))
    );
  }
}
