import { Pipe, PipeTransform } from '@angular/core';
import { EInstrumentCategory, CATEGORY_COLORS } from '../models/category.model';

@Pipe({
  name: 'categoryColor',
  pure: true
})
export class CategoryColorPipe implements PipeTransform {
  transform(category: EInstrumentCategory | string): string {
    if (!category) {
      return 'medium';
    }
    
    // Handle both enum values and string values for backward compatibility
    const categoryEnum = category as EInstrumentCategory;
    
    return CATEGORY_COLORS[categoryEnum] || 'medium';
  }
}
