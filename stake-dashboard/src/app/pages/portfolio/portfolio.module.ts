import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { PortfolioRoutingModule } from './portfolio-routing.module';
import { PortfolioComponent } from './portfolio.component';

@NgModule({
  imports: [CommonModule, IonicModule, PortfolioRoutingModule],
  declarations: [PortfolioComponent]
})
export class PortfolioModule {}
