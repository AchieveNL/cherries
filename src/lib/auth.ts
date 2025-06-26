import { client } from './shopify';

import type { CustomerAccessToken, LoginResponse, RecoverResponse, RegisterResponse } from '@/types/auth';

// GraphQL mutations
const CUSTOMER_ACCESS_TOKEN_CREATE = `#graphql
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CUSTOMER_RECOVER = `#graphql
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
        code
      }
  }
`;

const CUSTOMER_CREATE = `#graphql
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        createdAt
        updatedAt
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

// Helper function for making requests
async function shopifyRequest<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
  try {
    const response = await fetch(client.getStorefrontApiUrl(), {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: client.getPrivateTokenHeaders(),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error occurred');
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API error:', error);
    throw error;
  }
}

// Authentication functions
export async function loginCustomer(email: string, password: string): Promise<LoginResponse> {
  return shopifyRequest<LoginResponse>(CUSTOMER_ACCESS_TOKEN_CREATE, {
    input: { email, password },
  });
}

export async function registerCustomer(input: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<RegisterResponse> {
  return shopifyRequest<RegisterResponse>(CUSTOMER_CREATE, { input });
}

export async function recoverPassword(email: string): Promise<RecoverResponse> {
  return shopifyRequest<RecoverResponse>(CUSTOMER_RECOVER, { email });
}

// Token management
export function storeCustomerToken(token: CustomerAccessToken): void {
  localStorage.setItem('customerAccessToken', token.accessToken);
  localStorage.setItem('customerAccessTokenExpiry', token.expiresAt);
}

export function getCustomerToken(): string | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('customerAccessToken');
  const expiry = localStorage.getItem('customerAccessTokenExpiry');

  if (!token || !expiry) return null;

  // Check if token is expired
  if (new Date(expiry) <= new Date()) {
    clearCustomerToken();
    return null;
  }

  return token;
}

export function clearCustomerToken(): void {
  localStorage.removeItem('customerAccessToken');
  localStorage.removeItem('customerAccessTokenExpiry');
}

export function isAuthenticated(): boolean {
  return getCustomerToken() !== null;
}
