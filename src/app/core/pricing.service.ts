import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IMarketSummary, IPrice, IPriceData } from '@models/pricing.model';
import { BehaviorSubject, EMPTY, Observable, of, timer } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PricingService {
  private readonly PRICE_UPDATE_INTERVAL = 15000; // 15 seconds
  private readonly PRICE_VARIATION = 0.1; // ±$0.10

  private pricesSubject = new BehaviorSubject<Map<string, IPriceData>>(new Map());
  private marketSummarySubject = new BehaviorSubject<IMarketSummary | null>(null);

  // Public observables
  public prices$ = this.pricesSubject.asObservable();
  public marketSummary$ = this.marketSummarySubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Load initial prices from JSON file and set them as opening prices
   */
  initializePricing(): Observable<Map<string, IPriceData>> {
    return this.http.get<IPrice[]>('assets/data/pricing.json').pipe(
      map((prices) => {
        const priceMap = new Map<string, IPriceData>();
        const now = new Date();

        prices.forEach((price) => {
          const priceData: IPriceData = {
            ...price,
            openingPrice: price.price, // Set current price as opening price
            dailyChange: 0,
            dailyChangePercent: 0,
            isUp: false,
            lastUpdated: now
          };
          priceMap.set(price.symbol, priceData);
        });

        this.pricesSubject.next(priceMap);
        this.updateMarketSummary(priceMap);

        return priceMap;
      }),
      catchError((error) => {
        console.error('Failed to load initial prices:', error);
        return EMPTY;
      })
    );
  }

  /**
   * Start the polling mechanism for price updates
   * Returns an observable that components should subscribe to for continuous updates
   */
  public startPolling(): Observable<Map<string, IPriceData> | null> {
    return timer(this.PRICE_UPDATE_INTERVAL, this.PRICE_UPDATE_INTERVAL).pipe(
      switchMap(() => this.updatePrices()),
      catchError((error) => {
        console.error('Error in price polling:', error);
        // Continue polling even if there's an error
        return of(null);
      })
    );
  }

  /**
   * Update all prices with random movements
   */
  private updatePrices(): Observable<Map<string, IPriceData>> {
    return this.prices$.pipe(
      take(1), // Only take the current snapshot of prices
      map((currentPrices) => {
        const updatedPrices = new Map<string, IPriceData>();
        const now = new Date();
        let hasChanges = false;

        currentPrices.forEach((priceData, symbol) => {
          // Generate random price movement between -$0.10 and +$0.10
          const movement = (Math.random() - 0.5) * 2 * this.PRICE_VARIATION;
          const newPrice = Math.max(0.01, priceData.price + movement); // Ensure price doesn't go below $0.01

          // Calculate daily change based on opening price
          const dailyChange = newPrice - priceData.openingPrice;
          const dailyChangePercent = (dailyChange / priceData.openingPrice) * 100;

          const updatedPriceData: IPriceData = {
            ...priceData,
            price: Math.round(newPrice * 100) / 100, // Round to 2 decimal places
            dailyChange: Math.round(dailyChange * 100) / 100,
            dailyChangePercent: Math.round(dailyChangePercent * 100) / 100,
            isUp: dailyChange > 0,
            lastUpdated: now
          };

          updatedPrices.set(symbol, updatedPriceData);

          // Check if price actually changed
          if (Math.abs(newPrice - priceData.price) > 0.001) {
            hasChanges = true;
          }
        });

        if (hasChanges) {
          this.pricesSubject.next(updatedPrices);
          this.updateMarketSummary(updatedPrices);
        }

        return updatedPrices;
      })
    );
  }

  /**
   * Update market summary statistics
   */
  private updateMarketSummary(prices: Map<string, IPriceData>): void {
    let symbolsUp = 0;
    let symbolsDown = 0;
    let symbolsFlat = 0;

    prices.forEach((priceData) => {
      if (priceData.dailyChange > 0.01) {
        symbolsUp++;
      } else if (priceData.dailyChange < -0.01) {
        symbolsDown++;
      } else {
        symbolsFlat++;
      }
    });

    const totalSymbols = prices.size;
    let marketTrend: 'up' | 'down' | 'mixed' = 'mixed';

    if (symbolsUp > symbolsDown * 1.5) {
      marketTrend = 'up';
    } else if (symbolsDown > symbolsUp * 1.5) {
      marketTrend = 'down';
    }

    const summary: IMarketSummary = {
      totalSymbols,
      symbolsUp,
      symbolsDown,
      symbolsFlat,
      marketTrend,
      lastUpdated: new Date()
    };

    this.marketSummarySubject.next(summary);
  }
}
