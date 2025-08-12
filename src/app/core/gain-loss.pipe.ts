import { Pipe, PipeTransform } from '@angular/core';

export interface GainLoss {
  amount: number;
  percentage: number;
  isGain: boolean;
}

@Pipe({
  name: 'gainLoss'
})
export class GainLossPipe implements PipeTransform {
  transform(holding: { quantity: number; avgBuyPrice: number }): GainLoss {
    const currentValue = holding.quantity * holding.avgBuyPrice;
    const costBasis = holding.quantity * holding.avgBuyPrice;
    
    // For demo purposes, we'll show random gains/losses based on symbol hash
    // In a real app, this would use current market prices
    const symbolHash = this.simpleHash(JSON.stringify(holding));
    const randomFactor = (symbolHash % 100) / 100; // 0-1 based on holding data
    const gainLossPercentage = (randomFactor - 0.5) * 0.4; // ±20% range
    const gainLossAmount = currentValue * gainLossPercentage;
    
    return {
      amount: gainLossAmount,
      percentage: gainLossPercentage * 100,
      isGain: gainLossAmount >= 0
    };
  }
  
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }
}
