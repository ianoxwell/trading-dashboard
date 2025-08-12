import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { MarketService } from './market.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MarketComponent } from './market.component';

describe('MarketComponent', () => {
  let component: MarketComponent;
  let fixture: ComponentFixture<MarketComponent>;
  let marketService: jasmine.SpyObj<MarketService>;

  beforeEach(waitForAsync(() => {
    const marketSpy = jasmine.createSpyObj('MarketService', ['getMarketProducts']);

    TestBed.configureTestingModule({
      declarations: [MarketComponent],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CoreModule
      ],
      providers: [
        { provide: MarketService, useValue: marketSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MarketComponent);
    component = fixture.componentInstance;
    marketService = TestBed.inject(MarketService) as jasmine.SpyObj<MarketService>;

    // Setup mock returns
    marketService.getMarketProducts.and.returnValue(of([]));
    
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
