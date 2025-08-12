import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IMarketProduct } from '../../models/market-product.model';

@Component({
  selector: 'app-trade-confirmation-modal',
  templateUrl: './trade-confirmation-modal.component.html',
  styleUrls: ['./trade-confirmation-modal.component.scss'],
})
export class TradeConfirmationModalComponent {
  @Input() product!: IMarketProduct;
  @Input() orderType!: 'dollar' | 'quantity';
  @Input() shares!: number;
  @Input() totalCost!: number;
  @Input() availableBalance!: number;

  constructor(private modalController: ModalController) {}

  async confirmTrade() {
    await this.modalController.dismiss({ confirmed: true });
  }

  async cancelTrade() {
    await this.modalController.dismiss({ confirmed: false });
  }

  getFormattedPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(price);
  }

  getFormattedShares(shares: number): string {
    return shares.toFixed(0);
  }

  getShareText(shares: number): string {
    return shares === 1 ? 'share' : 'shares';
  }

  getRemainingBalance(): number {
    return this.availableBalance - this.totalCost;
  }
}
