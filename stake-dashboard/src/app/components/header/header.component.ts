import { Component, OnInit } from '@angular/core';
import { FaviconService } from '@app/core/favicon.service';
import { firstValueFrom, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {
  isDarkMode$!: Observable<boolean>;

  constructor(private faviconService: FaviconService) {
    this.isDarkMode$ = this.faviconService.isDarkMode$;
  }

  ngOnInit() {}

  async toggleDarkMode() {
    const isDarkMode = await firstValueFrom(this.isDarkMode$);
    this.faviconService.setMode(!isDarkMode);
  }

}
