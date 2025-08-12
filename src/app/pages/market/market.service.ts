import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PricingService } from '@core/pricing.service';
import { IInstrument } from '@models/instrument.model';
import { IMarketProduct } from '@models/market-product.model';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { map, switchMap, tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private instrumentsSubject = new BehaviorSubject<IInstrument[] | null>(null);

  public instruments$ = this.instrumentsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private pricingService: PricingService
  ) {}

  getMarketProducts(): Observable<IMarketProduct[]> {
    return this.loadInstruments().pipe(
      switchMap((instruments) => {
        return combineLatest([of(instruments), this.pricingService.prices$]);
      }),
      map(([instruments, prices]) => this.mergeData(instruments, prices))
    );
  }

  loadInstruments(): Observable<IInstrument[]> {
    return this.instruments$.pipe(
      take(1), // Only take current state to avoid infinite streams
      switchMap((instruments) => {
        // If instruments are already loaded, return them
        if (instruments !== null) {
          return of(instruments);
        }
        
        // Otherwise load from HTTP and cache in subject
        return this.http
          .get<IInstrument[]>('assets/data/instrument-list.json')
          .pipe(tap((loadedInstruments) => this.instrumentsSubject.next(loadedInstruments)));
      })
    );
  }

  private mergeData(instruments: IInstrument[], prices: Map<string, any>): IMarketProduct[] {
    return instruments
      .map((instrument) => {
        const priceData = prices.get(instrument.symbol);
        const price = priceData?.price || 0;
        const dailyChange = priceData?.dailyChangePercent || 0;
        const isUp = priceData?.isUp || false;

        return {
          id: instrument.id,
          symbol: instrument.symbol,
          name: instrument.name,
          description: instrument.description,
          category: instrument.category,
          price,
          dailyChange,
          isUp
        };
      })
      .filter((product) => product.price > 0); // Only include products with pricing data
  }
}
