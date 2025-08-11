import { Component } from '@angular/core';
import { FaviconService } from './core/favicon.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'stake-dashboard';
  constructor(private favicon: FaviconService) {
    // Service constructor initializes favicon based on OS preference.
    // To force mode, call this.favicon.setMode(true|false).
  }
}
