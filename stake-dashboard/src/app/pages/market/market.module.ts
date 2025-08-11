import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';

@NgModule({
  imports: [CommonModule, IonicModule, MarketRoutingModule],
  declarations: [MarketComponent]
})
export class MarketModule {}
