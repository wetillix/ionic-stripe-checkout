import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AlertController, Platform } from '@ionic/angular';
import { countryList } from '../constants/country';
import { IonicStripeCheckoutService } from '../services/ionic-stripe-checkout.service';
import { ICard } from '../models/icard';
import { ICreatePaymentCharge } from '../models/ipayment-charge';
import { ICreateTokenCard, IRetrieveToken } from '../models/itoken';

@Component({
  selector: 'ion-stripe-checkout',
  templateUrl: './ionic-stripe-checkout.component.html',
  styleUrls: ['./ionic-stripe-checkout.component.scss'],
})
export class IonicStripeCheckoutComponent implements OnInit {
  cardForm: FormGroup;
  cardNumber: AbstractControl;
  cardExpire: AbstractControl;
  cardCVC: AbstractControl;
  cardHolderName: AbstractControl;
  countryChoosed: string;
  cardLogo: string = '';
  isPaymentLoading: boolean = false;
  stripe: any;
  language: string;
  isAndroid: boolean = false;

  @Input() amount: string;
  @Input() currency: string;
  @Output() checkout = new EventEmitter<
    ICreatePaymentCharge | HttpErrorResponse | { error: string }
  >();

  constructor(
    private formBuilder: FormBuilder,
    private platform: Platform,
    private ionicStripeCheckoutService: IonicStripeCheckoutService,
    private alertController: AlertController
  ) {
    this.cardForm = this.formBuilder.group({
      cardNumber: [
        null,
        [
          Validators.required,
          Validators.maxLength(19),
          Validators.minLength(19),
        ],
      ],
      cardExpire: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
      cardCVC: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)],
      ],
      cardHolderName: [null, [Validators.required]],
    });

    this.cardNumber = this.cardForm.controls.cardNumber;
    this.cardExpire = this.cardForm.controls.cardExpire;
    this.cardCVC = this.cardForm.controls.cardCVC;
    this.cardHolderName = this.cardForm.controls.cardHolderName;
  }

  ngOnInit() {
    this.platform.is("android") ? this.isAndroid = true : this.isAndroid = false;
    this.language = this.ionicStripeCheckoutService.language;
  }

  onCheckOut() {
    this.isPaymentLoading = true;
    const paymentCard: ICard = {
      cardCVC: this.cardCVC.value,
      cardMonth: this.cardExpire.value.split('/')[0],
      cardYear: this.cardExpire.value.split('/')[1],
      cardNumber: this.cardNumber.value.trim(),
      cardHolderName: this.cardHolderName.value,
      cardCountry: this.countryChoosed,
    };

    if (this.ionicStripeCheckoutService.stripePublishableKey) {
      if (!this.ionicStripeCheckoutService.urlCreatePayment) {
        this.checkout.emit({
          error:
            this.language === 'en'
              ? 'Your URL for create payment is not present in forRoot configuration.'
              : "Votre URL pour initialiser le paiemment n'est pas présent dans la configuration forRoot.",
        });
        this.isPaymentLoading = false;
      } else if (!this.ionicStripeCheckoutService.urlCreateToken) {
        this.checkout.emit({
          error:
            this.language === 'en'
              ? 'Your URL for create token is not present in forRoot configuration.'
              : "Votre URL pour initialiser le token n'est pas présent dans la configuration forRoot.",
        });
        this.isPaymentLoading = false;
      } else {
        this.ionicStripeCheckoutService
          .onCreateTokenPaymentFromServer(paymentCard)
          .subscribe(
            (createTokenCardResponse: IRetrieveToken) => {
              this.ionicStripeCheckoutService
                .onConfirmPaymentFromServer({
                  amount: (Number(this.amount) * 100).toString(),
                  currency: this.currency,
                  source: createTokenCardResponse.token.id,
                })
                .subscribe(
                  (confirmPaymentResponse) => {
                    this.isPaymentLoading = false;
                    this.checkout.emit(confirmPaymentResponse);
                  },
                  (error: HttpErrorResponse) => {
                    this.checkout.emit(error);
                    this.isPaymentLoading = false;
                  }
                );
            },
            (error: HttpErrorResponse) => {
              this.checkout.emit(error);
              this.isPaymentLoading = false;
            }
          );
      }
    } else {
      this.ionicStripeCheckoutService.onCreateTokenCard(paymentCard).subscribe(
        (createTokenCardResponse: ICreateTokenCard) => {
          this.ionicStripeCheckoutService
            .onConfirmPayment({
              amount: (Number(this.amount) * 100).toString(),
              currency: this.currency,
              source: createTokenCardResponse['id'],
            })
            .subscribe(
              (confirmPaymentResponse) => {
                this.isPaymentLoading = false;
                this.checkout.emit(confirmPaymentResponse);
              },
              (error: HttpErrorResponse) => {
                this.checkout.emit(error);
                this.isPaymentLoading = false;
              }
            );
        },
        (error: HttpErrorResponse) => {
          this.checkout.emit(error);
          this.isPaymentLoading = false;
        }
      );
    }
  }

  async onChooseCountry() {
    const inputs = [];
    countryList.forEach((country, index) => {
      inputs.push({
        name: `radios${index}`,
        type: 'radio',
        label: `${country}`,
        value: `${country}`,
        checked: false,
      });
    });
    const alert = await this.alertController.create({
      inputs: inputs,
      buttons: [
        {
          text: this.language === "fr" ? 'Annuler' : 'Cancel',
          role: 'cancel',
        },
        {
          text: 'OK',
          handler: (data) => {
            this.countryChoosed = data;
          },
        },
      ],
    });
    await alert.present();
  }

  maskCardNumber(event) {
    let inputTxt = event.detail.value;
    inputTxt = inputTxt ? inputTxt.split(' ').join('') : '';
    inputTxt = inputTxt.length > 16 ? inputTxt.substring(0, 16) : inputTxt;
    this.cardNumber.setValue(this.maskStringCardNumber(inputTxt));

    const cardType = this.getCardType(this.cardNumber.value);
    this.cardLogo =
      'https://res.cloudinary.com/dqwudn0fq/image/upload/v1604747715/' +
      cardType +
      '.png';
  }

  maskStringCardNumber(inputTxt) {
    inputTxt = inputTxt.replace(/\D/g, '');
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, '$1 $2');
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, '$1 $2');
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, '$1 $2');
    inputTxt = inputTxt.replace(/(\d{4})(\d)/, '$1 $2');
    return inputTxt;
  }

  maskCardCVC(event) {
    let inputTxt = event.detail.value;
    inputTxt = inputTxt ? inputTxt.split(' ').join('') : '';
    inputTxt = inputTxt.length > 3 ? inputTxt.substring(0, 3) : inputTxt;
    this.cardCVC.setValue(this.maskStringardCVC(inputTxt));
  }

  maskStringardCVC(inputTxt) {
    inputTxt = inputTxt.replace(/\D/g, '');
    inputTxt = inputTxt.replace(/(\d{3})(\d)/, '$1 $2');
    return inputTxt;
  }

  maskCardExpire(event) {
    let inputTxt: string = event.detail.value;
    inputTxt = inputTxt ? inputTxt.split(' ').join('/') : '';
    inputTxt = inputTxt.length > 5 ? inputTxt.substring(0, 5) : inputTxt;
    this.cardExpire.setValue(this.maskStringExpire(inputTxt).replace(' ', '/'));
  }

  maskStringExpire(inputTxt) {
    inputTxt = inputTxt.replace(/\D/g, '');
    inputTxt = inputTxt.replace(/(\d{2})(\d)/, '$1 $2');
    inputTxt = inputTxt.replace(/(\d{2})(\d)/, '$1 $2');
    return inputTxt;
  }

  getCardType(currentCardValue: string) {
    //JCB
    let jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)

    // American Express
    let amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37

    // Diners Club
    let diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39

    // Visa
    let visa_regex = new RegExp('^4[0-9]{0,}$'); //4

    // MasterCard
    let mastercard_regex = new RegExp(
      '^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'
    ); //2221-2720, 51-55

    let maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway

    //Discover
    let discover_regex = new RegExp(
      '^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$'
    );
    ////6011, 622126-622925, 644-649, 65

    // get rid of anything but numbers
    currentCardValue = currentCardValue.replace(/\D/g, '');

    // checks per each, as their could be multiple hits
    //fix: ordering matter in detection, otherwise can give false results in rare cases
    let brand = '';
    if (currentCardValue.match(jcb_regex)) {
      brand = 'jcb';
    } else if (currentCardValue.match(amex_regex)) {
      brand = 'americanexpress';
    } else if (currentCardValue.match(diners_regex)) {
      brand = 'diners_club';
    } else if (currentCardValue.match(visa_regex)) {
      brand = 'visa';
    } else if (currentCardValue.match(mastercard_regex)) {
      brand = 'mastercard';
    } else if (currentCardValue.match(discover_regex)) {
      brand = 'discover';
    } else if (currentCardValue.match(maestro_regex)) {
      if (currentCardValue[0] == '5') {
        //started 5 must be mastercard
        brand = 'mastercard';
      } else {
        brand = 'maestro'; //maestro is all 60-69 which is not something else, thats why this condition in the end
      }
    }
    return brand;
  }
}
