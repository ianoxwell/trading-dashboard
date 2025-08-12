import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@core/core.module';
import { IonicModule } from '@ionic/angular';
import { MarketRoutingModule } from './market-routing.module';
import { MarketComponent } from './market.component';
import { ProductCardComponent } from './product-card/product-card.component';

@NgModule({
  imports: [CommonModule, IonicModule, MarketRoutingModule, CoreModule],
  declarations: [MarketComponent, ProductCardComponent]
})
export class MarketModule {}
