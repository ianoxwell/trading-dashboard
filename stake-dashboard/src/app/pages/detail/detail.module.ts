import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';

@NgModule({
  imports: [CommonModule, IonicModule, DetailRoutingModule],
  declarations: [DetailComponent]
})
export class DetailModule {}
