import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { HoldingCardComponent } from './holding-card.component';
import { EInstrumentCategory } from '@app/models/category.model';

describe('HoldingCardComponent', () => {
  let component: HoldingCardComponent;
  let fixture: ComponentFixture<HoldingCardComponent>;

  const mockHolding = {
    id: 'test-id-123',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: EInstrumentCategory.INCOME_FUND,
    quantity: 10,
    avgBuyPrice: 150,
    currentPrice: 155,
    currentValue: 1550,
    totalGainLoss: 50,
    totalGainLossPercent: 3.33,
    dailyGainLoss: 5,
    dailyGainLossPercent: 0.33,
    isUp: true,
    isNew: false
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HoldingCardComponent],
      imports: [
        IonicModule.forRoot(),
        CoreModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HoldingCardComponent);
    component = fixture.componentInstance;
    component.holding = mockHolding;
    component.totalPortfolioValue = 10000;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
