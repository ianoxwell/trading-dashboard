import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComponentBase } from '@app/core/base.component.base';
import { filterNullish } from '@app/core/filter-nullish';
import { TradingService } from '@app/core/trading.service';
import { IMarketProduct } from '@app/models/market-product.model';
import { IWallet } from '@app/models/wallet.model';
import { ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MarketService } from '../market/market.service';
import { TradeConfirmationModalComponent } from './trade-confirmation-modal.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent extends ComponentBase implements OnInit {
  product$!: Observable<IMarketProduct | undefined>;
  wallet$!: Observable<IWallet>;

  // Trading form
  orderType: 'dollar' | 'quantity' = 'dollar';
  dollarAmount: number = 100;
  quantity: number = 1;

  // Calculated values - will be updated reactively
  estimatedShares: number = 0;
  estimatedCost: number = 0;
  currentProduct: IMarketProduct | null = null;
  currentWallet: IWallet | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private modalController: ModalController,
    private marketService: MarketService,
    private tradingService: TradingService
  ) {
    super();
    this.wallet$ = this.tradingService.wallet$;
  }

  ngOnInit() {
    this.product$ = this.loadProductDetails();
    this.listenWallet().subscribe();
    this.setupCalculations();
  }

  private loadProductDetails() {
    let symbol: string | null;
    return this.route.paramMap.pipe(
      switchMap((params) => {
        symbol = params.get('symbol');
        return this.marketService.getMarketProducts();
      }),
      map((products) => products.find((p) => p.symbol === symbol)),
      filterNullish(),
      tap((product) => {
        this.currentProduct = product || null;
        this.updateCalculations();
      }),
      takeUntil(this.ngUnsubscribe)
    );
  }

  /** Unpack the wallet observable */
  private listenWallet() {
    return this.wallet$.pipe(
      tap((wallet) => {
        this.currentWallet = wallet || null;
      })
    );
  }

  private setupCalculations() {
    // Update calculations when order type or amounts change
    this.updateCalculations();
  }

  onOrderTypeChange(event?: any) {
    if (event) {
      this.orderType = event.detail.value;
    }
    this.updateCalculations();
  }

  onDollarAmountChange() {
    if (this.orderType === 'dollar') {
      this.updateCalculations();
    }
  }

  onQuantityChange() {
    if (this.orderType === 'quantity') {
      this.updateCalculations();
    }
  }

  private updateCalculations() {
    if (!this.currentProduct) return;

    if (this.orderType === 'dollar') {
      this.estimatedShares = Math.floor(this.dollarAmount / this.currentProduct.price);
      this.estimatedCost = this.estimatedShares * this.currentProduct.price;
    } else {
      this.estimatedShares = this.quantity;
      this.estimatedCost = this.quantity * this.currentProduct.price;
    }
  }

  // Getter methods for template (these are simple calculations, not complex functions)
  get canAffordPurchase(): boolean {
    if (this.estimatedCost === 0) return true;
    return this.currentWallet ? this.estimatedCost <= this.currentWallet.balance && this.estimatedCost > 0 : false;
  }

  get insufficientFundsAmount(): number {
    return this.currentWallet ? Math.max(0, this.estimatedCost - this.currentWallet.balance) : 0;
  }

  get priceHigh52W(): number {
    return this.currentProduct ? this.currentProduct.price * 1.25 : 0;
  }

  get priceLow52W(): number {
    return this.currentProduct ? this.currentProduct.price * 0.75 : 0;
  }

  async onBuy() {
    if (!this.currentProduct) return;

    // Show confirmation modal first
    const confirmed = await this.showConfirmationModal();
    if (!confirmed) return;

    const success = await this.tradingService.executeTrade(
      this.currentProduct.symbol,
      this.currentProduct.name,
      this.currentProduct.price,
      this.orderType,
      this.orderType === 'dollar' ? this.dollarAmount : undefined,
      this.orderType === 'quantity' ? this.quantity : undefined
    );

    if (success) {
      // Navigate to portfolio page after successful purchase
      this.router.navigate(['/portfolio']);
    }
  }

  private async showConfirmationModal(): Promise<boolean> {
    if (!this.currentProduct) return false;
    const availableBalance = (await this.tradingService.getWallet()).balance;

    const modal = await this.modalController.create({
      component: TradeConfirmationModalComponent,
      componentProps: {
        product: this.currentProduct,
        orderType: this.orderType,
        shares: this.estimatedShares,
        totalCost: this.estimatedCost,
        availableBalance
      },
      cssClass: 'trade-confirmation-modal'
    });

    await modal.present();
    const { data } = await modal.onWillDismiss();
    return data?.confirmed === true;
  }

  goBack() {
    this.location.back();
  }

  navigateToMarket() {
    this.router.navigate(['/market']);
  }

  // Keep this method for modal usage - but mark as deprecated for template use
  /** @deprecated Use canAfford$ observable in template instead */
  async canAfford(): Promise<boolean> {
    const wallet = await this.tradingService.getWallet();
    return this.estimatedCost <= wallet.balance;
  }
}
