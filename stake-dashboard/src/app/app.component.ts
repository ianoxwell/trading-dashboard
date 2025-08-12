import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { PricingService } from './core/pricing.service';
import { ComponentBase } from './core/base.component.base';
import { IPriceData } from './models/pricing.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends ComponentBase implements OnInit, OnDestroy {
  constructor(private pricingService: PricingService) {
    super();
  }

  ngOnInit(): void {
    // Initialize pricing service and start polling
    this.listenForPriceUpdates().subscribe();
  }

  listenForPriceUpdates(): Observable<Map<string, IPriceData> | null> {
    return this.pricingService.initializePricing().pipe(
      switchMap(() => this.pricingService.startPolling()),
      catchError((error) => {
        console.error('❌ Error in price update stream:', error);
        return of(null);
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }
}
