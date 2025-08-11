import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatPrice'
})
export class FormatPricePipe implements PipeTransform {
  transform(price: number, currency: string = 'AUD'): string {
    if (price == null || isNaN(price)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  }
}
