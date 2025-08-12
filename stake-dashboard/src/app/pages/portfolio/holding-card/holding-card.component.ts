import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IPortfolio } from '@models/portfolio.model';

@Component({
  selector: 'app-holding-card',
  templateUrl: './holding-card.component.html',
  styleUrls: ['./holding-card.component.scss']
})
export class HoldingCardComponent {
  @Input() holding!: IPortfolio;
  @Input() totalPortfolioValue: number = 0;

  constructor(private router: Router) {}

  get holdingValue(): number {
    return this.holding.currentValue || this.holding.quantity * this.holding.avgBuyPrice;
  }

  get percentageOfPortfolio(): number {
    if (this.totalPortfolioValue === 0) return 0;
    return (this.holdingValue / this.totalPortfolioValue) * 100;
  }

  get percentageBarWidth(): string {
    // Cap the visual representation at 100% for the bar
    const width = Math.min(this.percentageOfPortfolio, 100);
    return `${width}%`;
  }

  get percentageColorClass(): string {
    const percentage = this.percentageOfPortfolio;
    if (percentage >= 20) return 'high-percentage';
    if (percentage >= 10) return 'medium-percentage';
    return 'low-percentage';
  }

  viewDetails(): void {
    this.router.navigate([`/market/${this.holding.symbol}`]);
  }
}
