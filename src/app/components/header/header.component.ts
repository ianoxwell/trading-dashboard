import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ComponentBase } from '@app/core/base.component.base';
import { FaviconService } from '@app/core/favicon.service';
import { TradingService } from '@app/core/trading.service';
import { IInstrument } from '@app/models/instrument.model';
import { MarketService } from '@app/pages/market/market.service';
import Fuse from 'fuse.js';
import { firstValueFrom, Observable, timer } from 'rxjs';
import { debounceTime, filter, map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends ComponentBase implements OnInit {
  isDarkMode$!: Observable<boolean>;
  hasPendingTrades$!: Observable<boolean>;

  // Search functionality using reactive forms
  searchControl = new FormControl('');
  searchResults: IInstrument[] = [];
  showSearchResults = false;
  isSearchFocused = false;
  BLUR_DEBOUNCE_MS = 300

  private allProducts: IInstrument[] = [];
  private fuse!: Fuse<IInstrument>;

  constructor(
    private faviconService: FaviconService,
    private tradingService: TradingService,
    private marketService: MarketService,
    private router: Router
  ) {
    super();
    this.isDarkMode$ = this.faviconService.isDarkMode$;
    this.hasPendingTrades$ = this.tradingService.hasPendingTrades$;
  }

  ngOnInit() {
    this.loadInstruments();
    this.setupSearchResults().subscribe();
  }

  private async loadInstruments() {
    this.allProducts = await firstValueFrom(this.marketService.loadInstruments());
    this.setupFuse();
  }

  private setupSearchResults() {
    return this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(this.BLUR_DEBOUNCE_MS),
      // distinctUntilChanged(),
      filter(() => !!this.fuse), // Only proceed if fuse is initialized
      map((searchTerm) => this.performSearch(searchTerm || '')),
      takeUntil(this.ngUnsubscribe)
    );
  }

  private setupFuse() {
    if (this.allProducts.length > 0) {
      this.fuse = new Fuse(this.allProducts, {
        keys: ['name', 'symbol', 'description'],
        threshold: 0.3,
        includeScore: true
      });
    }
  }

  private performSearch(searchTerm: string): IInstrument[] {
    if (!searchTerm.trim() || !this.fuse) {
      this.showSearchResults = false;
      return [];
    }

    const results = this.fuse.search(searchTerm).slice(0, 10); // Top 10 results
    const searchResults = results.map((result) => result.item);
    this.showSearchResults = searchResults.length > 0 && this.isSearchFocused;
    this.searchResults = searchResults;
    return searchResults;
  }

  onSearchFocus() {
    this.isSearchFocused = true;
    // Check current search results and show dropdown if there are results
    const currentValue = this.searchControl.value || '';
    if (currentValue.trim()) {
      this.showSearchResults = true;
    }
  }

  async onSearchBlur() {
    // Delay hiding results to allow for result click
    await firstValueFrom(timer(this.BLUR_DEBOUNCE_MS));
    this.isSearchFocused = false;
    this.showSearchResults = false;
  }

  onResultClick(product: IInstrument) {
    this.router.navigate(['/market', product.symbol]);
    this.clearSearch();
  }

  clearSearch() {
    this.searchControl.setValue('', { emitEvent: false });
    this.showSearchResults = false;
  }

  trackBySymbol(_: number, product: IInstrument): string {
    return product.symbol;
  }

  async toggleDarkMode() {
    const isDarkMode = await firstValueFrom(this.isDarkMode$);
    this.faviconService.setMode(!isDarkMode);
  }
}
