import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { MarketService } from '@app/pages/market/market.service';
import { TradingService } from '@app/core/trading.service';
import { of } from 'rxjs';
import { DetailComponent } from './detail.component';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let marketService: jasmine.SpyObj<MarketService>;
  let tradingService: jasmine.SpyObj<TradingService>;

  beforeEach(waitForAsync(() => {
    const marketSpy = jasmine.createSpyObj('MarketService', ['getMarketProducts']);
    const tradingSpy = jasmine.createSpyObj('TradingService', ['getWallet'], {
      wallet$: of({ balance: 1000, currency: 'USD' })
    });

    TestBed.configureTestingModule({
      declarations: [DetailComponent],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule,
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        { provide: MarketService, useValue: marketSpy },
        { provide: TradingService, useValue: tradingSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    marketService = TestBed.inject(MarketService) as jasmine.SpyObj<MarketService>;
    tradingService = TestBed.inject(TradingService) as jasmine.SpyObj<TradingService>;

    // Setup mock returns
    marketService.getMarketProducts.and.returnValue(of([]));
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
