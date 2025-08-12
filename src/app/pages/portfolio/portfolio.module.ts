import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { IonicModule } from '@ionic/angular';
import { HoldingCardComponent } from './holding-card/holding-card.component';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';

@NgModule({
  imports: [CommonModule, IonicModule, PortfolioRoutingModule, CoreModule],
  declarations: [PortfolioComponent, HoldingCardComponent]
})
export class PortfolioModule {}
