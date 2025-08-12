import { Component } from '@angular/core';
import { FaviconService } from '@app/core/favicon.service';
import { TradingService } from '@app/core/trading.service';
import { firstValueFrom, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isDarkMode$!: Observable<boolean>;
  hasPendingTrades$!: Observable<boolean>;

  constructor(
    private faviconService: FaviconService,
    private tradingService: TradingService
  ) {
    this.isDarkMode$ = this.faviconService.isDarkMode$;
    this.hasPendingTrades$ = this.tradingService.hasPendingTrades$;
  }

  async toggleDarkMode() {
    const isDarkMode = await firstValueFrom(this.isDarkMode$);
    this.faviconService.setMode(!isDarkMode);
  }
}
