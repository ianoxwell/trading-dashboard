import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IMarketProduct } from '@models/market-product.model';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {
  @Input() product!: IMarketProduct;
  @Output() productClick = new EventEmitter<IMarketProduct>();

  constructor() { }

  ngOnInit() {}

  onProductClick(): void {
    this.productClick.emit(this.product);
  }
}
