import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '@app/core/base.component.base';
import { TradingService } from '@app/core/trading.service';
import { IPortfolio } from '@app/models/portfolio.model';
import { IWallet } from '@app/models/wallet.model';
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { first, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PortfolioService } from './portfolio.service';

export type SortField = 'name' | 'currentValue' | 'portfolioWeight';
export type SortDirection = 'asc' | 'desc';

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

  // Sorting properties
  private sortField$ = new BehaviorSubject<SortField>('portfolioWeight');
  private sortDirection$ = new BehaviorSubject<SortDirection>('desc');
  
  currentSortField$ = this.sortField$.asObservable();
  currentSortDirection$ = this.sortDirection$.asObservable();

  private newItemTimers = new Map<string, Observable<number>>(); // Track active timers

  constructor(
    private portfolioService: PortfolioService,
    private tradingService: TradingService
  ) {
    super();
  }

  ngOnInit() {
    // Set up observables first
    this.wallet$ = this.tradingService.wallet$;
    this.portfolioValue$ = this.portfolioService.getTotalPortfolioValue();
    this.combinedValue$ = this.portfolioService.getCombinedValue();

    // Get base portfolio data with calculated values
    const basePortfolio$ = this.portfolioService.getPortfolio().pipe(
      map(portfolio => this.calculateCurrentValuesSync(portfolio))
    );

    // Combine base portfolio with sorting
    this.portfolio$ = combineLatest([
      basePortfolio$,
      this.sortField$,
      this.sortDirection$,
      this.portfolioValue$
    ]).pipe(
      map(([portfolio, sortField, sortDirection, totalValue]) => {
        return this.sortPortfolio(portfolio, sortField, sortDirection, totalValue);
      }),
    );

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

  // Sorting methods
  setSortField(field: SortField): void {
    const currentField = this.sortField$.value;
    if (currentField === field) {
      // Toggle direction if same field is clicked
      this.toggleSortDirection();
    } else {
      // Set new field and default to descending for value fields, ascending for name
      this.sortField$.next(field);
      this.sortDirection$.next(field === 'name' ? 'asc' : 'desc');
    }
  }

  onSortFieldChange(event: any): void {
    const field = event.detail.value as SortField;
    if (field) {
      this.setSortField(field);
    }
  }

  toggleSortDirection(): void {
    const currentDirection = this.sortDirection$.value;
    this.sortDirection$.next(currentDirection === 'asc' ? 'desc' : 'asc');
  }

  private sortPortfolio(portfolio: IPortfolio[], field: SortField, direction: SortDirection, totalValue: number): IPortfolio[] {
    return [...portfolio].sort((a, b) => {
      let comparison = 0;
      
      switch (field) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'currentValue':
          comparison = (a.currentValue || 0) - (b.currentValue || 0);
          break;
        case 'portfolioWeight':
          const aWeight = a.currentValue ? (a.currentValue / totalValue) * 100 : 0;
          const bWeight = b.currentValue ? (b.currentValue / totalValue) * 100 : 0;
          comparison = aWeight - bWeight;
          break;
      }
      
      return direction === 'asc' ? comparison : -comparison;
    });
  }

  private getTotalPortfolioValue(): number {
    // This is a simplified approach - in a real app you might want to cache this value
    let totalValue = 0;
    this.portfolioValue$.pipe(first()).subscribe(value => totalValue = value);
    return totalValue || 1; // Avoid division by zero
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
            percentTotal: portfolioValue > 0 ? (currentValue / portfolioValue) * 100 : 0
          };
        });
      })
    );
  }

  calculateCurrentValuesSync(holdings: IPortfolio[]): IPortfolio[] {
    // Calculate total portfolio value for percentage calculations
    const totalValue = holdings.reduce((total, holding) => {
      return total + (holding.quantity * holding.avgBuyPrice);
    }, 0);
    
    const result = holdings.map((holding: IPortfolio) => {
      const currentValue = holding.quantity * holding.avgBuyPrice;
      return {
        ...holding,
        currentValue,
        percentTotal: totalValue > 0 ? (currentValue / totalValue) * 100 : 0
      };
    });
    
    return result;
  }
}
