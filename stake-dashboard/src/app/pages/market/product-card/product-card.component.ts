import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMarketProduct } from '@models/market-product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: IMarketProduct;
  @Output() productClick = new EventEmitter<IMarketProduct>();

  constructor() {}

  onProductClick(): void {
    this.productClick.emit(this.product);
  }
}
