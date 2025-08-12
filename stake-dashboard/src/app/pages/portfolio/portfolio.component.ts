import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '@app/core/base.component.base';
import { TradingService } from '@app/core/trading.service';
import { IPortfolio } from '@app/models/portfolio.model';
import { IWallet } from '@app/models/wallet.model';
import { combineLatest, Observable, timer } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PortfolioService } from './portfolio.service';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent extends ComponentBase implements OnInit {
  portfolio$!: Observable<IPortfolio[]>;
  wallet$!: Observable<IWallet>;
  portfolioValue$!: Observable<number>;
  combinedValue$!: Observable<{ portfolioValue: number; walletBalance: number; totalValue: number }>;

  private newItemTimers = new Map<string, Observable<number>>(); // Track active timers

  constructor(
    private portfolioService: PortfolioService,
    private tradingService: TradingService
  ) {
    super();
  }

  ngOnInit() {
    this.portfolio$ = this.portfolioService.getPortfolio().pipe(switchMap((portfolio) => this.calculateCurrentValues(portfolio)));
    this.wallet$ = this.tradingService.wallet$;
    this.portfolioValue$ = this.portfolioService.getTotalPortfolioValue();
    this.combinedValue$ = this.portfolioService.getCombinedValue();

    // Listen for new items and set up timers
    this.listenNewPortfolioItems().subscribe();
  }

  override ngOnDestroy() {
    // Clear all timers and new item statuses when component is destroyed
    this.portfolioService.clearAllNewItemStatuses();
    super.ngOnDestroy();
  }

  private listenNewPortfolioItems(): Observable<number[]> {
    return this.portfolioService.newItems$.pipe(
      switchMap((newItems) => {
        return this.setupNewItemTimers(newItems);
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  private setupNewItemTimers(newItems: string[]): Observable<number[]> {
    // Set up timers for new items
    const newTimers = newItems
      .filter((symbol) => !!symbol)
      .map((symbol) => {
        const timer$ = timer(60000) // 60 seconds
          .pipe(
            tap(() => {
              this.portfolioService.removeNewItemStatus(symbol);
              this.newItemTimers.delete(symbol);
            })
          );

        this.newItemTimers.set(symbol, timer$);
        return timer$;
      });

    return combineLatest(newTimers).pipe(takeUntil(this.ngUnsubscribe));
  }

  trackByHolding(_: number, holding: IPortfolio): string {
    return holding.id;
  }

  calculateCurrentValues(holdings: IPortfolio[]): Observable<IPortfolio[]> {
    // For now, we'll use the avg buy price as current price
    // In a real app, this would fetch current market prices
    return this.portfolioValue$.pipe(
      first(),
      map((portfolioValue) => {
        return holdings.map((holding: IPortfolio) => {
          const currentValue = holding.quantity * holding.avgBuyPrice;
          return {
            ...holding,
            currentValue,
            percentTotal: (currentValue / portfolioValue) * 100
          };
        });
      })
    );
  }
}
