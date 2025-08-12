import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CoreModule } from '@core/core.module';
import { IonicModule } from '@ionic/angular';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { TradeConfirmationModalComponent } from './trade-confirmation-modal.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, DetailRoutingModule, CoreModule],
  declarations: [DetailComponent, TradeConfirmationModalComponent]
})
export class DetailModule {}
