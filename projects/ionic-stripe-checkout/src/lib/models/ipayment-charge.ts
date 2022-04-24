export interface IPaymentCharge {
  amount: string;
  currency: string;
  source: string;
}

export interface ICreatePaymentCharge {
  id: string;
  object: string;
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application?: any;
  application_fee?: any;
  application_fee_amount?: any;
  balance_transaction: string;
  billing_details: Billingdetails;
  calculated_statement_descriptor?: any;
  captured: boolean;
  created: number;
  currency: string;
  customer?: any;
  description: string;
  disputed: boolean;
  failure_code?: any;
  failure_message?: any;
  fraud_details: Frauddetails;
  invoice?: any;
  livemode: boolean;
  metadata: Frauddetails;
  on_behalf_of?: any;
  order?: any;
  outcome: Outcome;
  paid: boolean;
  payment_intent?: any;
  payment_method: string;
  payment_method_details: Paymentmethoddetails;
  receipt_email?: any;
  receipt_number?: any;
  receipt_url: string;
  refunded: boolean;
  refunds: Refunds;
  review?: any;
  shipping?: any;
  source_transfer?: any;
  statement_descriptor?: any;
  statement_descriptor_suffix?: any;
  status: string;
  transfer_data?: any;
  transfer_group?: any;
  source: string;
  card_month?: string;
  card_year?: string;
  card_number?: string;
}

interface Refunds {
  object: string;
  data: any[];
  has_more: boolean;
  url: string;
}

interface Paymentmethoddetails {
  card: Card;
  type: string;
}

interface Card {
  brand: string;
  checks: Checks;
  country: string;
  exp_month: number;
  exp_year: number;
  fingerprint: string;
  funding: string;
  installments?: any;
  last4: string;
  network: string;
  three_d_secure?: any;
  wallet?: any;
}

interface Checks {
  address_line1_check?: any;
  address_postal_code_check?: any;
  cvc_check: string;
}

interface Outcome {
  network_status: string;
  reason?: any;
  risk_level: string;
  seller_message: string;
  type: string;
}

interface Frauddetails {}

interface Billingdetails {
  address: Address;
  email?: any;
  name?: any;
  phone?: any;
}

interface Address {
  city?: any;
  country?: any;
  line1?: any;
  line2?: any;
  postal_code?: any;
  state?: any;
}
