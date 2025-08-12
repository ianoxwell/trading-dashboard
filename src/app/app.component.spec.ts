import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { CoreModule } from '@app/core/core.module';
import { PricingService } from '@app/core/pricing.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    const pricingSpy = jasmine.createSpyObj('PricingService', ['startPricePolling'], {
      prices$: of({})
    });

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IonicModule.forRoot(),
        HttpClientTestingModule,
        CoreModule
      ],
      declarations: [AppComponent],
      providers: [
        { provide: PricingService, useValue: pricingSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
