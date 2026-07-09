export type PaymentProvider = 'stripe' | 'lemonsqueezy'

export enum SubscriptionStatus {
  TRIALING = 'TRIALING',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  INCOMPLETE = 'INCOMPLETE',
  EXPIRED = 'EXPIRED'
}

export enum OneTimePaymentStatus {
  CREATED = 'CREATED',
  SUCCEEDED = 'SUCCEEDED'
}

export interface Plan {
  id: string
  name: string
  description: string | null
  storeId: string | null
  variants: PlanVariant[]
}

export interface PlanVariant {
  id: string
  interval: 'day' | 'week' | 'month' | 'year'
  interval_count: number
  price: number
  currency: string
}

export interface CheckoutOptions {
  variantId: string
  type: string
  email?: string
  name?: string
  userId: string
  redirectUrl?: string
}

export interface CustomerPortalOptions {
  id?: string | number
  customerId: string
  redirectUrl?: string
  flowData?: FlowData
  flow?: 'update-plan' | 'update-payment-info' | 'cancel'
}

export type FlowData =
  | {
    type: 'subscription_update'
    subscription_update: {
      subscription: string
    }
  }
  | {
    type: 'subscription_cancel'
    subscription_cancel: {
      subscription: string
    }
  }
  | {
    type: 'payment_method_update'
  }
  | undefined

export interface Transaction {
  id: string
  amount: string
  currency: string
  status: string
  date: string
  customer: string
  description: string
  invoice: string | null
}
