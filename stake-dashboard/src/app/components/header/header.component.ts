import { Component, OnInit } from '@angular/core';
import { FaviconService } from '@app/core/favicon.service';
import { TradingService } from '@app/core/trading.service';
import { firstValueFrom, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  isDarkMode$!: Observable<boolean>;
  hasPendingTrades$!: Observable<boolean>;

  constructor(
    private faviconService: FaviconService,
    private tradingService: TradingService
  ) {
    this.isDarkMode$ = this.faviconService.isDarkMode$;
    this.hasPendingTrades$ = this.tradingService.hasPendingTrades$;
  }

  ngOnInit() {}

  async toggleDarkMode() {
    const isDarkMode = await firstValueFrom(this.isDarkMode$);
    this.faviconService.setMode(!isDarkMode);
  }

}
