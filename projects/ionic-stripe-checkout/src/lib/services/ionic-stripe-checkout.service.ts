import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LibConfigService, LibConfig } from '../../public-api';
import {
  URL_STRIPE_CHARGE_CARD,
  URL_STRIPE_CREATE_TOKEN,
} from '../constants/constants';
import { ICard } from '../models/icard';
import {
  ICreatePaymentCharge,
  IPaymentCharge,
} from '../models/ipayment-charge';
import { ICreateTokenCard } from '../models/itoken';

@Injectable({
  providedIn: 'root',
})
export class IonicStripeCheckoutService {
  stripeSecretKey = this.config.stripe_secret_key;
  stripePublishableKey = this.config.stripe_publishable_key;
  urlCreateToken = this.config.url_token_card;
  urlCreatePayment = this.config.url_create_payment;
  headers: HttpHeaders;

  constructor(
    @Inject(LibConfigService) private config: LibConfig,
    private httpClient: HttpClient
  ) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.append(
      'Authorization',
      `Bearer ${this.stripeSecretKey}`
    );
    this.headers = this.headers.append(
      'Content-Type',
      'application/x-www-form-urlencoded'
    );
  }

  onCreateTokenCard(card: ICard): Observable<ICreateTokenCard> {
    return this.httpClient.post<ICreateTokenCard>(
      `${URL_STRIPE_CREATE_TOKEN}`,
      [],
      {
        headers: this.headers,
        params: {
          'card[number]': card.cardNumber,
          'card[exp_month]': card.cardMonth,
          'card[exp_year]': card.cardYear,
          'card[cvc]': card.cardCVC,
          'card[name]': card.cardHolderName,
          'card[address_country]': card.cardCountry,
        },
      }
    );
  }

  onConfirmPayment(
    paymentCharge: IPaymentCharge
  ): Observable<ICreatePaymentCharge> {
    return this.httpClient.post<ICreatePaymentCharge>(
      `${URL_STRIPE_CHARGE_CARD}`,
      [],
      {
        headers: this.headers,
        params: {
          amount: paymentCharge.amount,
          currency: paymentCharge.currency,
          source: paymentCharge.source,
        },
      }
    );
  }

  onCreateTokenPaymentFromServer(card: ICard): Observable<ICreateTokenCard> {
    return this.httpClient.post<ICreateTokenCard>(this.urlCreateToken, card);
  }

  onConfirmPaymentFromServer(
    paymentCharge: IPaymentCharge
  ): Observable<ICreatePaymentCharge> {
    return this.httpClient.post<ICreatePaymentCharge>(
      this.urlCreatePayment,
      paymentCharge
    );
  }
}
