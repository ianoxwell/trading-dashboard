import { Component, OnInit, OnDestroy } from '@angular/core';
import { PricingService } from '@core/pricing.service';
import { IMarketSummary } from '@models/pricing.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-market-summary',
  templateUrl: './market-summary.component.html',
  styleUrls: ['./market-summary.component.scss']
})
export class MarketSummaryComponent implements OnInit {
  marketSummary$!: Observable<IMarketSummary | null>;

  constructor(private pricingService: PricingService) {}

  ngOnInit() {
    this.marketSummary$ = this.pricingService.marketSummary$;
  }

  getTrendIcon(trend: string): string {
    switch (trend) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      default:
        return 'trending-up'; // mixed/flat
    }
  }

  getTrendColor(trend: string): string {
    switch (trend) {
      case 'up':
        return 'success';
      case 'down':
        return 'danger';
      default:
        return 'warning'; // mixed/flat
    }
  }

  getTrendText(trend: string): string {
    switch (trend) {
      case 'up':
        return 'Bullish';
      case 'down':
        return 'Bearish';
      default:
        return 'Mixed';
    }
  }
}
