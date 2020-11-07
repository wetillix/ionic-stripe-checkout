import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicStripeCheckoutComponent } from './ionic-stripe-checkout.component';
import { IonicModule } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { IonicStripeCheckoutService } from './ionic-stripe-checkout.service';

export interface LibConfig {
  stripe_secret_key: string;
}

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [IonicStripeCheckoutComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicModule,
  ],
  exports: [IonicStripeCheckoutComponent],
})
export class IonicStripeCheckoutModule {
  static forRoot(config: LibConfig): ModuleWithProviders {
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
