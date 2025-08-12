import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IInstrument } from '@models/instrument.model';
import { IMarketProduct } from '@models/market-product.model';
import { IPricing } from '@models/pricing.model';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MarketService {
  private instrumentsSubject = new BehaviorSubject<IInstrument[] | null>(null);
  private pricingSubject = new BehaviorSubject<IPricing[] | null>(null);

  public instruments$ = this.instrumentsSubject.asObservable();
  public pricing$ = this.pricingSubject.asObservable();

  constructor(private http: HttpClient) {}

  getMarketProducts(): Observable<IMarketProduct[]> {
    // If data is already loaded, return the combined cached data
    return combineLatest([this.instruments$, this.pricing$]).pipe(
      switchMap(([instruments, pricing]) => {
        if (instruments !== null && pricing !== null) {
          return this.combineInstrumentsAndPricing();
        }

        return this.loadMarketData();
      })
    );
  }

  private loadMarketData(): Observable<IMarketProduct[]> {
    // Load both datasets and combine them
    return combineLatest([this.loadInstruments(), this.loadPricing()]).pipe(
      map(([instruments, pricing]) => this.mergeData(instruments, pricing))
    );
  }

  refreshMarketData(): Observable<IMarketProduct[]> {
    return combineLatest([
      this.http
        .get<IInstrument[]>('assets/data/instrument-list.json')
        .pipe(tap((instruments) => this.instrumentsSubject.next(instruments))),
      this.http.get<IPricing[]>('assets/data/pricing.json').pipe(tap((pricing) => this.pricingSubject.next(pricing)))
    ]).pipe(map(([instruments, pricing]) => this.mergeData(instruments, pricing)));
  }

  private loadInstruments(): Observable<IInstrument[]> {
    if (this.instrumentsSubject.value !== null) {
      return this.instrumentsSubject.asObservable() as Observable<IInstrument[]>;
    }

    return this.http
      .get<IInstrument[]>('assets/data/instrument-list.json')
      .pipe(tap((instruments) => this.instrumentsSubject.next(instruments)));
  }

  private loadPricing(): Observable<IPricing[]> {
    if (this.pricingSubject.value !== null) {
      return this.pricingSubject.asObservable() as Observable<IPricing[]>;
    }

    return this.http.get<IPricing[]>('assets/data/pricing.json').pipe(tap((pricing) => this.pricingSubject.next(pricing)));
  }

  private combineInstrumentsAndPricing(): Observable<IMarketProduct[]> {
    return combineLatest([this.instruments$, this.pricing$]).pipe(
      map(([instruments, pricing]) => {
        if (!instruments || !pricing) return [];
        return this.mergeData(instruments, pricing);
      })
    );
  }

  private mergeData(instruments: IInstrument[], pricing: IPricing[]): IMarketProduct[] {
    const pricingMap = new Map(pricing.map((p) => [p.symbol, p.price]));

    return instruments
      .map((instrument) => ({
        id: instrument.id,
        symbol: instrument.symbol,
        name: instrument.name,
        description: instrument.description,
        category: instrument.category,
        price: pricingMap.get(instrument.symbol) || 0
      }))
      .filter((product) => product.price > 0); // Only include products with pricing data
  }
}
