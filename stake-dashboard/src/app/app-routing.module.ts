import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DetailComponent } from './pages/detail/detail.component';
import { MarketComponent } from './pages/market/market.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';
import { StakeTabsComponent } from './pages/stake-tabs/stake-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: StakeTabsComponent,
    children: [
      { path: 'portfolio', component: PortfolioComponent },
      { path: 'market', component: MarketComponent },
      { path: 'market/:symbol', component: DetailComponent },
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
