import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IPortfolio } from '../../models/portfolio.model';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private portfolioSubject = new BehaviorSubject<IPortfolio[] | null>(null);
  public portfolio$ = this.portfolioSubject.asObservable();

  constructor(private http: HttpClient) { }

  getPortfolio(): Observable<IPortfolio[]> {
    // If data is already loaded, return the cached data
    if (this.portfolioSubject.value !== null) {
      return this.portfolioSubject.asObservable() as Observable<IPortfolio[]>;
    }

    // Load data from JSON file and cache it
    return this.http.get<IPortfolio[]>('assets/data/portfolio.json').pipe(
      tap(portfolio => this.portfolioSubject.next(portfolio))
    );
  }

  refreshPortfolio(): Observable<IPortfolio[]> {
    return this.http.get<IPortfolio[]>('assets/data/portfolio.json').pipe(
      tap(portfolio => this.portfolioSubject.next(portfolio))
    );
  }
}
