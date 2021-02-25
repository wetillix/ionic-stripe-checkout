import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStripeCheckoutComponent } from './components/ionic-stripe-checkout.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStripeCheckoutService } from './services/ionic-stripe-checkout.service';

export interface LibConfig {
  stripe_secret_key?: string;
  stripe_publishable_key?: string;
  url_token_card?: string;
  url_create_payment?: string;
  language?: 'fr' | 'en';
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, IonicModule],
  declarations: [IonicStripeCheckoutComponent],
  exports: [IonicStripeCheckoutComponent],
})
export class IonicStripeCheckoutModule {
  static forRoot(
    config: LibConfig
  ): ModuleWithProviders<IonicStripeCheckoutModule> {
    return {
      ngModule: IonicStripeCheckoutModule,
      providers: [
        IonicStripeCheckoutService,
        {
          provide: LibConfigService,
          useValue: config,
        },
      ],
    };
  }
}
