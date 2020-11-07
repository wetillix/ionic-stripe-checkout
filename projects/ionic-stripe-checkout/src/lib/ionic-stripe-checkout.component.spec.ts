import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IonicStripeCheckoutComponent } from './ionic-stripe-checkout.component';

describe('IonicStripeCheckoutComponent', () => {
  let component: IonicStripeCheckoutComponent;
  let fixture: ComponentFixture<IonicStripeCheckoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IonicStripeCheckoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IonicStripeCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
