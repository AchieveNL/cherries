export interface CustomerToken {
  accessToken: string;
  refreshToken: string;
  idToken?: string;
  expiresAt: string;
  expiresIn: number;
}

export enum EmailMarketingState {
  INVALID = 'INVALID',
  NOT_SUBSCRIBED = 'NOT_SUBSCRIBED',
  PENDING = 'PENDING',
  REDACTED = 'REDACTED',
  SUBSCRIBED = 'SUBSCRIBED',
  UNSUBSCRIBED = 'UNSUBSCRIBED',
}
export interface CustomerAccessToken {
  accessToken: string;
  expiresAt: string;
}

export interface BaseResponse {
  success: boolean;
  errors?: Array<{
    field: string[];
    message: string;
    code?: string;
  }>;
}
export interface LoginResponse extends BaseResponse {
  customerAccessToken?: CustomerAccessToken;
  customer?: CustomerProfile;
}

export interface RegisterResponse extends BaseResponse {
  customerAccessToken?: CustomerAccessToken;
  customer?: CustomerProfile;
}

export interface RecoverResponse {
  success: boolean;
  errors?: Array<{
    field: string[];
    message: string;
    code?: string;
  }>;
}

export interface CustomerProfile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string; // Full name or fallback to email/phone
  emailAddress: {
    emailAddress: string;
    marketingState: EmailMarketingState;
  } | null;
  phoneNumber: {
    phoneNumber: string;
  } | null;
  creationDate: string; // When the customer was created
  imageUrl: string; // Avatar image URL
  tags?: string[]; // Customer tags
  // Add default address
  defaultAddress?: CustomerAddress;
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
  processedAt: string;
  financialStatus: string;
  fulfillmentStatus: string | null;
  statusPageUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        variantTitle?: string; // Fixed: Use variantTitle instead of variant object
        image?: {
          url: string;
          altText: string;
        };
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface CustomerDraftOrder {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        quantity: number;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface CustomerSubscription {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  nextOrderDate: string;
  billingPolicy: {
    interval: string;
    intervalCount: number;
  };
  deliveryPolicy: {
    interval: string;
    intervalCount: number;
  };
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        productTitle: string;
        variantTitle: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export interface CustomerStoreCreditAccount {
  id: string;
  balance: {
    amount: string;
    currencyCode: string;
  };
  transactions: {
    edges: Array<{
      node: {
        amount: {
          amount: string;
          currencyCode: string;
        };
        createdAt: string;
      };
    }>;
  };
}

export interface CustomerMetafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
  type: string;
  description?: string;
}

export interface CustomerCompanyContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  company: {
    id: string;
    name: string;
  };
}

export interface PKCEParams {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  customer: CustomerProfile | null;
  token: CustomerToken | null;
  // Add optional additional data
  addresses?: CustomerAddress[];
  orders?: CustomerOrder[];
  subscriptions?: CustomerSubscription[];
  storeCreditAccounts?: CustomerStoreCreditAccount[];
}

export interface TokenExchangeRequest {
  code: string;
  codeVerifier: string;
  state: string;
  nonce?: string; // Add optional nonce support
}

export interface TokenExchangeResponse {
  success: boolean;
  token?: CustomerToken;
  message?: string;
  debug?: any; // For development debugging
}

export interface AuthHookReturn {
  isAuthenticated: boolean;
  isLoading: boolean;
  customer: CustomerProfile | null;
  login: (email?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

export interface CustomerUpdateInput {
  firstName?: string;
  lastName?: string;
  email?: string; // This will be transformed to emailAddress internally
  phone?: string; // This will be transformed to phoneNumber internally
  acceptsMarketing?: boolean;
}

export interface CustomerAddressInput {
  firstName?: string;
  lastName?: string;
  company?: string;
  address1?: string;
  address2?: string;
  city?: string;
  territoryCode?: string; // Country code (e.g., 'US', 'CA')
  zoneCode?: string; // State/Province code (e.g., 'NY', 'CA', 'ON')
  zip?: string;
  phoneNumber?: string;
}

export interface CustomerPreferences {
  currency: string;
  locale: string;
  timezone: string;
  marketingConsent: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface OrderFilters {
  financialStatus?: string[];
  fulfillmentStatus?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  sortBy?: 'PROCESSED_AT' | 'TOTAL_PRICE' | 'CREATED_AT';
  reverse?: boolean;
}

export interface PaginationInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

// New: Add API response wrappers
export interface CustomerApiResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    code?: string;
    field?: string[];
  }>;
  extensions?: {
    cost?: {
      requestedQueryCost: number;
      actualQueryCost: number;
    };
  };
}

// New: Add webhook types for real-time updates
export interface CustomerWebhookPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
  tags: string;
  ordersCount: number;
  totalSpent: string;
  defaultAddress?: CustomerAddress;
}
