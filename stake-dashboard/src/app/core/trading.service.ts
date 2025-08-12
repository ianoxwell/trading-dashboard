import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, timer } from 'rxjs';
import { IWallet, ITradeOrder, IPendingTrade } from '../models/wallet.model';
import { IPortfolio } from '../models/portfolio.model';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class TradingService {
  private walletSubject = new BehaviorSubject<IWallet>({ 
    balance: 10000, 
    currency: 'AUD' 
  });
  
  private pendingTradesSubject = new BehaviorSubject<IPendingTrade[]>([]);
  private tradeHistorySubject = new BehaviorSubject<ITradeOrder[]>([]);
  
  public wallet$ = this.walletSubject.asObservable();
  public pendingTrades$ = this.pendingTradesSubject.asObservable();
  public tradeHistory$ = this.tradeHistorySubject.asObservable();
  
  // Reactive property for header indicator
  public hasPendingTrades$ = new BehaviorSubject<boolean>(false);

  constructor(private toastController: ToastController) {}

  async getWallet(): Promise<IWallet> {
    return await firstValueFrom(this.wallet$);
  }

  updateWallet(wallet: IWallet): void {
    this.walletSubject.next(wallet);
  }

  async executeTrade(
    symbol: string,
    productName: string,
    price: number,
    orderType: 'dollar' | 'quantity',
    dollarAmount?: number,
    quantity?: number
  ): Promise<boolean> {
    try {
      const currentWallet = await firstValueFrom(this.wallet$);
      
      // Calculate actual quantity and total value
      const actualQuantity = orderType === 'dollar' && dollarAmount 
        ? Math.floor(dollarAmount / price)  // Round down to whole shares only
        : quantity || 0;
      
      const totalValue = actualQuantity * price;
      
      // Check if user has sufficient funds
      if (totalValue > currentWallet.balance) {
        await this.showToast('Insufficient funds for this purchase', 'danger');
        return false;
      }

      // Create pending trade
      const pendingTrade: IPendingTrade = {
        id: this.generateTradeId(),
        symbol,
        productName,
        quantity: actualQuantity,
        price,
        totalValue,
        timestamp: new Date()
      };

      // Add to pending trades
      const currentPending = await firstValueFrom(this.pendingTrades$);
      this.pendingTradesSubject.next([...currentPending, pendingTrade]);
      this.hasPendingTrades$.next(true);

      // Deduct from wallet immediately (optimistic update)
      this.updateWallet({
        ...currentWallet,
        balance: currentWallet.balance - totalValue
      });

      // Simulate processing time (4-8 seconds)
      const processingTime = Math.random() * 4000 + 4000; // 4-8 seconds
      
      pendingTrade.timeoutId = setTimeout(async () => {
        await this.completeTrade(pendingTrade);
      }, processingTime);

      await this.showToast(`Order for ${actualQuantity} share${actualQuantity === 1 ? '' : 's'} of ${symbol} submitted`, 'success');
      return true;
    } catch (error) {
      console.error('Error executing trade:', error);
      await this.showToast('Failed to execute trade. Please try again.', 'danger');
      return false;
    }
  }

  private async completeTrade(pendingTrade: IPendingTrade): Promise<void> {
    try {
      // Remove from pending trades
      const currentPending = await firstValueFrom(this.pendingTrades$);
      const updatedPending = currentPending.filter(trade => trade.id !== pendingTrade.id);
      this.pendingTradesSubject.next(updatedPending);
      
      // Update pending indicator
      this.hasPendingTrades$.next(updatedPending.length > 0);

      // Add to trade history
      const tradeOrder: ITradeOrder = {
        id: pendingTrade.id,
        symbol: pendingTrade.symbol,
        productName: pendingTrade.productName,
        type: 'buy',
        orderType: 'quantity',
        quantity: pendingTrade.quantity,
        price: pendingTrade.price,
        totalValue: pendingTrade.totalValue,
        status: 'completed',
        timestamp: pendingTrade.timestamp
      };

      const currentHistory = await firstValueFrom(this.tradeHistory$);
      this.tradeHistorySubject.next([tradeOrder, ...currentHistory]);

      await this.showToast(`Purchase of ${pendingTrade.quantity} share${pendingTrade.quantity === 1 ? '' : 's'} of ${pendingTrade.symbol} completed!`, 'success');
    } catch (error) {
      console.error('Error completing trade:', error);
      await this.showToast('Error completing trade. Please contact support.', 'danger');
    }
  }

  async cancelPendingTrade(tradeId: string): Promise<void> {
    try {
      const currentPending = await firstValueFrom(this.pendingTrades$);
      const tradeToCancel = currentPending.find(trade => trade.id === tradeId);
      
      if (tradeToCancel) {
        // Clear timeout
        if (tradeToCancel.timeoutId) {
          clearTimeout(tradeToCancel.timeoutId);
        }
        
        // Refund the wallet
        const currentWallet = await firstValueFrom(this.wallet$);
        this.updateWallet({
          ...currentWallet,
          balance: currentWallet.balance + tradeToCancel.totalValue
        });
        
        // Remove from pending
        const updatedPending = currentPending.filter(trade => trade.id !== tradeId);
        this.pendingTradesSubject.next(updatedPending);
        this.hasPendingTrades$.next(updatedPending.length > 0);
        
        await this.showToast(`Order for ${tradeToCancel.symbol} cancelled`, 'warning');
      }
    } catch (error) {
      console.error('Error cancelling trade:', error);
      await this.showToast('Failed to cancel trade. Please try again.', 'danger');
    }
  }

  private generateTradeId(): string {
    return 'trade_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private async showToast(message: string, color: 'success' | 'danger' | 'warning') {
    const toast = await this.toastController.create({
      message,
      duration: 5000, // Increased duration
      color,
      position: 'top',
      cssClass: 'custom-toast',
      buttons: [
        {
          text: '✕',
          role: 'cancel',
          handler: () => {
            toast.dismiss();
          }
        }
      ]
    });
    toast.present();
  }

  // Method to update portfolio service when trades complete
  async getCompletedTrades(): Promise<ITradeOrder[]> {
    try {
      const tradeHistory = await firstValueFrom(this.tradeHistory$);
      return tradeHistory.filter(trade => trade.status === 'completed');
    } catch (error) {
      console.error('Error getting completed trades:', error);
      return [];
    }
  }
}
