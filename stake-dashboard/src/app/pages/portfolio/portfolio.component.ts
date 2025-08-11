import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { PortfolioService } from './portfolio.service';
import { IPortfolio } from '../../models/portfolio.model';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
})
export class PortfolioComponent implements OnInit {
  portfolio$!: Observable<IPortfolio[]>;

  constructor(private portfolioService: PortfolioService) { }

  ngOnInit() {
    this.portfolio$ = this.portfolioService.getPortfolio();
  }
}
