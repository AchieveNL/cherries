export interface CustomerAccountApiToken {
  accessToken: string;
  expiresAt: string;
  refreshToken: string;
}

export interface CustomerProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: {
    emailAddress: string;
  } | null;
  phoneNumber: {
    phoneNumber: string;
  } | null;
  dateOfBirth: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  phoneNumber: string | null;
  formatted: string[];
}

export interface CustomerOrder {
  id: string;
  name: string;
  orderNumber: number;
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  statusPageUrl: string;
  totalPriceSet: {
    presentmentMoney: {
      amount: string;
      currencyCode: string;
    };
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        variant: {
          id: string;
          title: string;
          image: {
            url: string;
            altText: string;
          } | null;
          priceV2: {
            amount: string;
            currencyCode: string;
          };
        } | null;
      };
    }>;
  };
}

export interface MagicLinkResponse {
  success: boolean;
  message?: string;
  redirectUrl?: string;
}

export interface CustomerAccountError {
  message: string;
  code?: string;
  field?: string[];
}

export type CustomerAuthMode = 'signin' | 'signup' | 'profile';
export type CustomerMessageType = 'success' | 'error' | 'info';
