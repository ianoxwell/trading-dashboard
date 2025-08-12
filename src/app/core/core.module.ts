import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatPricePipe } from './format-price.pipe';
import { GainLossPipe } from './gain-loss.pipe';
import { FormatSharesPipe } from './format-shares.pipe';
import { CategoryColorPipe } from './category-color.pipe';

@NgModule({
  declarations: [
    FormatPricePipe,
    GainLossPipe,
    FormatSharesPipe,
    CategoryColorPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FormatPricePipe,
    GainLossPipe,
    FormatSharesPipe,
    CategoryColorPipe
  ]
})
export class CoreModule { }
