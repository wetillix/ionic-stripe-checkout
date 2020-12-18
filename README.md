<h1 align="center">Ionic Stripe Checkout</h1>
<p>
  <img src="https://img.shields.io/badge/version-0.1.2-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/vy-group/ionic-stripe-checkout#readme">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://github.com/vy-group/ionic-stripe-checkout/graphs/commit-activity">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" target="_blank" />
  </a>
  <a href="https://github.com/vy-group/ionic-stripe-checkout/blob/main/LICENSE">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
   <a href="https://www.npmjs.com/package/@vyconsulting/ionic-stripe-checkout">
    <img alt="Total downloads" src="https://img.shields.io/npm/dt/@vyconsulting/ionic-stripe-checkout?style=plastic" target="_blank" />
  </a>
</p>

> A simple Ionic 5 Stripe Checkout component using Angular.

<!-- ### 🏠 [Homepage](https://github.com/vy-group/ionic-stripe-checkout) -->

## 📝 Table of Contents

- [Prerequisites](#prerequisites)
- [Install](#install)
- [Setup](#setup)
- [Usage](#usage)
- [Features](#features)
- [Author](#author)
- [Contributors](#contributors)
- [Contributing](#contributing)
- [Show your support](#support)
- [License](#license)

## ✅ Prerequisites <a name = "prerequisites"></a>

The current version of the library is compatible with Ionic 4 and Ionic 5.

## ⬇️ Install <a name = "install"></a>

Using npm

```sh
npm install --save @vyconsulting/ionic-stripe-checkout
```

Using yarn

```sh
yarn add @vyconsulting/ionic-stripe-checkout
```

## 🛠 Setup <a name = "setup"></a>

### 🚀 If you want to use it in `development mode`, you can use this example. It's based on Stripe secret key.

Once installed you need to import our module firstly in `AppModule` :

```js
import { IonicStripeCheckoutModule } from '@vyconsulting/ionic-stripe-checkout';

@NgModule({
  ...
  imports: [IonicStripeCheckoutModule.forRoot({
    stripe_secret_key: "YOUR_STRIPE_SECRET_KEY",
  }), ...],
  ...
})
export class AppModule {
}
```

After do this, in your page where you want to use this component, you will do this:

```js
import { IonicStripeCheckoutModule } from '@vyconsulting/ionic-stripe-checkout';

@NgModule({
  ...
  imports: [IonicStripeCheckoutModule, ...],
  ...
})
export class YourModule {
}
```

### 🚀 If you want to use it in `production mode`, you can use this example. It's based on Stripe publishable key.

Once installed you need to import our module firstly in `AppModule` :

```js
import { IonicStripeCheckoutModule } from '@vyconsulting/ionic-stripe-checkout';

@NgModule({
  ...
  imports: [IonicStripeCheckoutModule.forRoot({
    stripe_publishable_key: "YOUR_STRIPE_PUBLISHABLE_KEY",
    url_create_payment: "http://YOUR_DOMAIN/YOUR_END_POINT_FOR_CREATE_PAYMENT",
    url_token_card: "http://YOUR_DOMAIN/YOUR_END_POINT_FOR_CREATE_TOKEN",
  }), ...],
  ...
})
export class AppModule {
}
```

After do this, in your page where you want to use this component, you will do this:

```js
import { IonicStripeCheckoutModule } from '@vyconsulting/ionic-stripe-checkout';

@NgModule({
  ...
  imports: [IonicStripeCheckoutModule, ...],
  ...
})
export class YourModule {
}
```

Finally, if you use `Express.js` as backend, here is an example of code you can use. You can transpose the code into your backend language :

```js
const stripe = require("stripe")("STRIPE_SECRET_KEY");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("."));

app.post("/create-token", async (req, res) => {
  const token = await stripe.tokens.create({
    card: {
      number: req.body.cardNumber,
      exp_month: req.body.cardMonth,
      exp_year: req.body.cardYear,
      cvc: req.body.cardCVC,
    },
  });
  res.json({ token });
});

app.post("/create-payment", async (request, response) => {
  stripe.charges
    .create({
      amount: request.body.amount,
      currency: request.body.currency,
      source: request.body.source,
    })
    .then((charge) => {
      response.json({ charge });
    })
    .catch((error) => {
      response.json({ error });
    });
});

app.listen(4242, () => console.log("Running on port 4242"));
```

## Usage <a name = "usage"></a>

Include the component on page template, like the example below:

```
  <ion-stripe-checkout
    [amount]="100"
    [currency]="'EUR'"
    (checkout)="onPay($event)"
  >
  </ion-stripe-checkout>
```

In your `tsconfig.json` file, if you use `Angular Language Service` extension, add this line :

```
{
      "compilerOptions": {
       .
       .
       .
        "paths": {
          "@vyconsulting/ionic-stripe-checkout": ["node_modules/@vyconsulting/ionic-stripe-checkout"]
        },
```

### API

### Properties

- amount: `number` it is the price of your product.
- currency: `string` it is the currency of your price. Check [Stripe Currency Normalized](https://stripe.com/docs/currencies)

### Events

- checkout: `EventEmitter<ICreatePaymentCharge | HttpErrorResponse>, the only event dedicated to payment. When the payment is successful, it returns all informations about user checkout. Otherwise it returns HttpErrorResponse from HttpClient.`

## Features which coming soon <a name = "features"></a>

- [ ] Integrate 3D Secure payment

## Author <a name = "author"></a>

👤 **Vyconsulting**

- Github: [@vy-group](https://github.com/vy-group)

## Contributors ✨ <a name = "contributors"></a>

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/amilamen"><img src="https://avatars1.githubusercontent.com/u/46297789?s=400&u=03563203ec0290dd65dded1ad75c4c5e4adb7be4&v=4" width="100px;" alt=""/><br /><sub><b>amilamen</b></sub></a><br /><a href="https://github.com/vy-group/ionic-stripe-checkout/commits?author=amilamen" title="Code">💻</a></td>
  </tr>
</table>

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification.

## 🤝 Contributing <a name = "contributing"></a>

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/vy-group/ionic-stripe-checkout/issues).

## Show your support <a name = "support"></a>

Give a ⭐️ if this project helped you!

## 📝 License <a name = "license"></a>

Copyright © 2020 [Vyconsulting](https://github.com/vy-group).<br />
This project is [MIT](https://github.com/vy-group/ionic-stripe-checkout/blob/master/LICENSE) licensed.
