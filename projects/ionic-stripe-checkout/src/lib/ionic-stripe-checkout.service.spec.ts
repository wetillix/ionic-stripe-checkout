import { TestBed } from '@angular/core/testing';

import { IonicStripeCheckoutService } from './ionic-stripe-checkout.service';

describe('IonicStripeCheckoutService', () => {
  let service: IonicStripeCheckoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IonicStripeCheckoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
