import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StakeTabsComponent } from './pages/stake-tabs/stake-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: StakeTabsComponent,
    children: [
      { 
        path: 'portfolio', 
        loadChildren: () => import('./pages/portfolio/portfolio.module').then(m => m.PortfolioModule) 
      },
      { 
        path: 'market', 
        loadChildren: () => import('./pages/market/market.module').then(m => m.MarketModule) 
      },
      { 
        path: 'market/:symbol', 
        loadChildren: () => import('./pages/detail/detail.module').then(m => m.DetailModule) 
      },
      { path: '', redirectTo: 'portfolio', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
