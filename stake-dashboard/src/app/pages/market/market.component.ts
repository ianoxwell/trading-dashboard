import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Fuse from 'fuse.js';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ALL_CATEGORIES, CATEGORY_LABELS, EInstrumentCategory } from '../../models/category.model';
import { IMarketProduct } from '../../models/market-product.model';
import { MarketService } from './market.service';

@Component({
  selector: 'app-market',
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.scss']
})
export class MarketComponent implements OnInit {
  allProducts: IMarketProduct[] = [];
  filteredProducts$!: Observable<IMarketProduct[]>;
  paginatedProducts$!: Observable<IMarketProduct[]>;

  // Search and filter controls
  private searchSubject = new BehaviorSubject<string>('');
  private categoryFilterSubject = new BehaviorSubject<EInstrumentCategory | ''>('');
  private pageSizeSubject = new BehaviorSubject<number>(20);
  private currentPageSubject = new BehaviorSubject<number>(1);

  // Public observables for template
  searchTerm$ = this.searchSubject.asObservable();
  categoryFilter$ = this.categoryFilterSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  // Pagination info
  totalProducts$ = new BehaviorSubject<number>(0);
  totalPages$ = new BehaviorSubject<number>(0);

  categories: EInstrumentCategory[] = ALL_CATEGORIES;
  categoryLabels = CATEGORY_LABELS;
  pageSizeOptions = [10, 20, 50];

  private fuse!: Fuse<IMarketProduct>;

  constructor(
    private marketService: MarketService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadMarketData().subscribe();
    this.setupFiltering();
    this.setupPagination();
  }

  trackByProduct(index: number, product: IMarketProduct): string {
    return product.id;
  }

  get currentPage(): number {
    return this.currentPageSubject.value;
  }

  get totalPages(): number {
    return this.totalPages$.value;
  }

  private loadMarketData(): Observable<IMarketProduct[]> {
    return this.marketService.getMarketProducts().pipe(
      tap((products) => {
        this.allProducts = products;
        this.setupFuse();
        this.applyFilters();
      })
    );
  }

  private setupFuse() {
    this.fuse = new Fuse(this.allProducts, {
      keys: ['name', 'symbol', 'description', 'category'],
      threshold: 0.3,
      includeScore: true
    });
  }

  private setupFiltering() {
    this.filteredProducts$ = combineLatest([
      this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()),
      this.categoryFilterSubject
    ]).pipe(
      map(([searchTerm, category]) => {
        let filtered = this.allProducts;

        // Apply search
        if (searchTerm.trim()) {
          const results = this.fuse.search(searchTerm);
          filtered = results.map((result: { item: IMarketProduct }) => result.item);
        }

        // Apply category filter
        if (category) {
          filtered = filtered.filter((product) => product.category === category);
        }

        this.totalProducts$.next(filtered.length);
        this.totalPages$.next(Math.ceil(filtered.length / this.pageSizeSubject.value));

        return filtered;
      })
    );
  }

  private setupPagination() {
    this.paginatedProducts$ = combineLatest([this.filteredProducts$, this.currentPageSubject, this.pageSizeSubject]).pipe(
      map(([products, currentPage, pageSize]) => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return products.slice(startIndex, endIndex);
      })
    );
  }

  onSearch(event: any) {
    const searchTerm = event.target.value || '';
    this.searchSubject.next(searchTerm);
    this.currentPageSubject.next(1); // Reset to first page
  }

  onCategoryFilter(category: EInstrumentCategory | '') {
    this.categoryFilterSubject.next(category);
    this.currentPageSubject.next(1); // Reset to first page
  }

  onPageSizeChange(pageSize: number) {
    this.pageSizeSubject.next(pageSize);
    this.currentPageSubject.next(1); // Reset to first page
  }

  onPageChange(page: number) {
    this.currentPageSubject.next(page);
  }

  onProductClick(product: IMarketProduct) {
    this.router.navigate(['/market', product.symbol]);
  }

  private applyFilters() {
    this.searchSubject.next('');
    this.categoryFilterSubject.next('');
    this.currentPageSubject.next(1);
  }

  get pageNumbers(): number[] {
    const totalPages = this.totalPages$.value;
    const currentPage = this.currentPageSubject.value;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, -1);
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push(-1, totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }
}
