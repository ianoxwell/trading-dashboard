import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { PortfolioService } from './portfolio.service';
import { TradingService } from '@app/core/trading.service';
import { of } from 'rxjs';
import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;
  let portfolioService: jasmine.SpyObj<PortfolioService>;
  let tradingService: jasmine.SpyObj<TradingService>;

  beforeEach(waitForAsync(() => {
    const portfolioSpy = jasmine.createSpyObj('PortfolioService', [
      'getPortfolio', 
      'getTotalPortfolioValue',
      'getCombinedValue',
      'clearAllNewItemStatuses'
    ], {
      newItems$: of([])
    });
    const tradingSpy = jasmine.createSpyObj('TradingService', ['getWallet'], {
      wallet$: of({ balance: 1000, currency: 'USD' })
    });

    TestBed.configureTestingModule({
      declarations: [PortfolioComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        { provide: PortfolioService, useValue: portfolioSpy },
        { provide: TradingService, useValue: tradingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    portfolioService = TestBed.inject(PortfolioService) as jasmine.SpyObj<PortfolioService>;
    tradingService = TestBed.inject(TradingService) as jasmine.SpyObj<TradingService>;

    // Setup mock returns
    portfolioService.getPortfolio.and.returnValue(of([]));
    portfolioService.getTotalPortfolioValue.and.returnValue(of(0));
    portfolioService.getCombinedValue.and.returnValue(of({ portfolioValue: 0, walletBalance: 1000, totalValue: 1000 }));
    portfolioService.clearAllNewItemStatuses.and.returnValue();
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
