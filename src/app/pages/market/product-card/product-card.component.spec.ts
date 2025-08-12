import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { RouterTestingModule } from '@angular/router/testing';
import { EInstrumentCategory } from '@app/models/category.model';
import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  const mockProduct = {
    id: 'test-id-123',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.',
    category: EInstrumentCategory.EQUITY,
    price: 155.50,
    dailyChange: 2.50,
    dailyChangePercent: 1.63,
    isUp: true
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [
        IonicModule.forRoot(),
        CoreModule,
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
