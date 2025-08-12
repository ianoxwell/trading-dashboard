import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatShares',
  pure: true
})
export class FormatSharesPipe implements PipeTransform {
  transform(shares: number): string {
    if (shares == null || isNaN(shares)) {
      return '0';
    }
    return shares.toFixed(0); // Always show whole numbers
  }
}
