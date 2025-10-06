import {
  HasMetafields,
  MailingAddress,
  MailingAddressConnection,
  Metafield,
  OrderConnection,
} from '@shopify/hydrogen-react/storefront-api-types';

// Main Customer Type
export type Customer = HasMetafields & {
  __typename?: 'Customer';
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing: boolean;
  /** A list of addresses for the customer. */
  addresses: MailingAddressConnection;
  /** The date and time when the customer was created. */
  createdAt: string;
  /** The customer's default address. */
  defaultAddress?: Maybe<MailingAddress>;
  /** The customer's name, email or phone number. */
  displayName: string;
  /** The customer's email address. */
  email?: Maybe<string>;
  /** The customer's first name. */
  firstName?: Maybe<string>;
  /** A unique ID for the customer. */
  id: string;
  /** The customer's last name. */
  lastName?: Maybe<string>;
  /** A [custom field](https://shopify.dev/docs/apps/build/custom-data), including its `namespace` and `key`, that's associated with a Shopify resource for the purposes of adding and storing additional information. */
  metafield?: Maybe<Metafield>;
  /** A list of [custom fields](/docs/apps/build/custom-data) that a merchant associates with a Shopify resource. */
  metafields: Array<Maybe<Metafield>>;
  /** The number of orders that the customer has made at the store in their lifetime. */
  numberOfOrders: string;
  /** The orders associated with the customer. */
  orders: OrderConnection;
  /** The customer's phone number. */
  phone?: Maybe<string>;
  /**
   * A comma separated list of tags that have been added to the customer.
   * Additional access scope required: unauthenticated_read_customer_tags.
   */
  tags: Array<string>;
  /** The date and time when the customer information was updated. */
  updatedAt: string;
};

// Customer Access Token
export type CustomerAccessToken = {
  __typename?: 'CustomerAccessToken';
  /** The customer's access token. */
  accessToken: string;
  /** The date and time when the customer access token expires. */
  expiresAt: string;
};

// Customer Input Types
export type CustomerAccessTokenCreateInput = {
  /** The email associated to the customer. */
  email: string;
  /** The login password to be used by the customer. */
  password: string;
};

export type CustomerCreateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing?: boolean;
  /** The customer's email. */
  email: string;
  /** The customer's first name. */
  firstName?: string;
  /** The customer's last name. */
  lastName?: string;
  /** The login password used by the customer. */
  password: string;
  /** A unique phone number for the customer. Formatted using E.164 standard. For example, _+16135551111_. */
  phone?: string;
};

export type CustomerUpdateInput = {
  /** Indicates whether the customer has consented to be sent marketing material via email. */
  acceptsMarketing?: boolean;
  /** The customer's email. */
  email?: string;
  /** The customer's first name. */
  firstName?: string;
  /** The customer's last name. */
  lastName?: string;
  /** The login password used by the customer. */
  password?: string;
  /** A unique phone number for the customer. Formatted using E.164 standard. For example, _+16135551111_. To remove the phone number, specify `null`. */
  phone?: string;
};

export type CustomerActivateInput = {
  /** The activation token required to activate the customer. */
  activationToken: string;
  /** New password that will be set during activation. */
  password: string;
};

export type CustomerResetInput = {
  /** New password that will be set as part of the reset password process. */
  password: string;
  /** The reset token required to reset the customer's password. */
  resetToken: string;
};

// Payload Types (Mutation Results)
export type CustomerAccessTokenCreatePayload = {
  __typename?: 'CustomerAccessTokenCreatePayload';
  /** The newly created customer access token object. */
  customerAccessToken?: Maybe<CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerCreatePayload = {
  __typename?: 'CustomerCreatePayload';
  /** The created customer object. */
  customer?: Maybe<Customer>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerUpdatePayload = {
  __typename?: 'CustomerUpdatePayload';
  /** The updated customer object. */
  customer?: Maybe<Customer>;
  /**
   * The newly created customer access token. If the customer's password is updated, all previous access tokens
   * (including the one used to perform this mutation) become invalid, and a new token is generated.
   */
  customerAccessToken?: Maybe<CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerActivatePayload = {
  __typename?: 'CustomerActivatePayload';
  /** The customer object. */
  customer?: Maybe<Customer>;
  /** A newly created customer access token object for the customer. */
  customerAccessToken?: Maybe<CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerResetPayload = {
  __typename?: 'CustomerResetPayload';
  /** The customer object which was reset. */
  customer?: Maybe<Customer>;
  /** A newly created customer access token object for the customer. */
  customerAccessToken?: Maybe<CustomerAccessToken>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerRecoverPayload = {
  __typename?: 'CustomerRecoverPayload';
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

// Address Related Types
export type CustomerAddressCreatePayload = {
  __typename?: 'CustomerAddressCreatePayload';
  /** The new customer address object. */
  customerAddress?: Maybe<MailingAddress>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerAddressUpdatePayload = {
  __typename?: 'CustomerAddressUpdatePayload';
  /** The customer's updated mailing address. */
  customerAddress?: Maybe<MailingAddress>;
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  userErrors: Array<UserError>;
};

export type CustomerAddressDeletePayload = {
  __typename?: 'CustomerAddressDeletePayload';
  /** The list of errors that occurred from executing the mutation. */
  customerUserErrors: Array<CustomerUserError>;
  /** ID of the deleted customer address. */
  deletedCustomerAddressId?: Maybe<string>;
  userErrors: Array<UserError>;
};

// Error Types
export type CustomerUserError = DisplayableError & {
  __typename?: 'CustomerUserError';
  /** The error code. */
  code?: Maybe<CustomerErrorCode>;
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<string>>;
  /** The error message. */
  message: string;
};

export type CustomerErrorCode =
  /** Customer already enabled. */
  | 'ALREADY_ENABLED'
  /** Input email contains an invalid domain name. */
  | 'BAD_DOMAIN'
  /** The input value is blank. */
  | 'BLANK'
  /** Input contains HTML tags. */
  | 'CONTAINS_HTML_TAGS'
  /** Input contains URL. */
  | 'CONTAINS_URL'
  /** Customer is disabled. */
  | 'CUSTOMER_DISABLED'
  /** The input value is invalid. */
  | 'INVALID'
  /** Multipass token is not valid. */
  | 'INVALID_MULTIPASS_REQUEST'
  /** Address does not exist. */
  | 'NOT_FOUND'
  /** Input password starts or ends with whitespace. */
  | 'PASSWORD_STARTS_OR_ENDS_WITH_WHITESPACE'
  /** The input value is already taken. */
  | 'TAKEN'
  /** Invalid activation token. */
  | 'TOKEN_INVALID'
  /** The input value is too long. */
  | 'TOO_LONG'
  /** The input value is too short. */
  | 'TOO_SHORT'
  /** Unidentified customer. */
  | 'UNIDENTIFIED_CUSTOMER';

// Utility Types
export type Maybe<T> = T | null;

export type DisplayableError = {
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<string>>;
  /** The error message. */
  message: string;
};

export type UserError = DisplayableError & {
  __typename?: 'UserError';
  /** The path to the input field that caused the error. */
  field?: Maybe<Array<string>>;
  /** The error message. */
  message: string;
};

// For your specific use case, here are the key response interfaces:
export interface CustomerQueryResponse {
  customer: Customer | null;
}

export interface CustomerUpdateResponse {
  customerUpdate: {
    customer?: Customer;
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}

export interface CustomerCreateResponse {
  customerCreate: {
    customer?: Customer;
    customerUserErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}
export interface CustomerAccessTokenCreateResponse {
  customerAccessTokenCreate: {
    customerAccessToken?: CustomerAccessToken;
    customerUserErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}
export interface CustomerAddressDeleteResponse {
  customerAddressDelete: {
    deletedCustomerAddressId?: string;
    customerUserErrors: Array<{
      field: string[];
      message: string;
      code: string;
    }>;
  };
}
