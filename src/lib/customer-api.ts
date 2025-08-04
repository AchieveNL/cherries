import { getValidAccessToken } from './auth-utils';

import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerMetafield,
  CustomerOrder,
  CustomerProfile,
  CustomerStoreCreditAccount,
  CustomerUpdateInput,
  EmailMarketingState,
  OrderFilters,
} from '@/types/auth';

const CUSTOMER_PROFILE_QUERY = `#graphql
  query CustomerProfile {
    customer {
      id
      firstName
      lastName
      displayName
      imageUrl
      creationDate
      emailAddress {
        emailAddress
        marketingState
      }
      phoneNumber {
        phoneNumber
      }
      tags
      defaultAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        zip
        country
        phoneNumber
        formatted
      }
    }
  }
`;

const CUSTOMER_ADDRESSES_QUERY = `#graphql
  query CustomerAddresses($first: Int = 10) {
    customer {
      addresses(first: $first) {
        nodes {
          id
          firstName
          lastName
          company
          address1
          address2
          city
          province
          zip
          country
          phoneNumber
          formatted
        }
      }
    }
  }
`;

const CUSTOMER_ORDERS_QUERY = `#graphql
  query CustomerOrders($first: Int = 20, $sortKey: OrderSortKeys = PROCESSED_AT, $reverse: Boolean = true) {
    customer {
      orders(first: $first, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            id
            name
            processedAt
            financialStatus
            fulfillmentStatus
            statusPageUrl
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 10) {
              edges {
                node {
                  id
                  title
                  quantity
                  variantTitle
                  image {
                    url
                    altText
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

const CUSTOMER_STORE_CREDIT_QUERY = `#graphql
  query CustomerStoreCredit {
    customer {
      storeCreditAccounts(first: 5) {
        nodes {
          id
          balance {
            amount
            currencyCode
          }
          transactions(first: 10) {
            edges {
              node {
                id
                amount {
                  amount
                  currencyCode
                }
                createdAt
                description
              }
            }
          }
        }
      }
    }
  }
`;

const CUSTOMER_METAFIELDS_QUERY = `#graphql
  query CustomerMetafields($namespace: String) {
    customer {
      metafields(first: 20, namespace: $namespace) {
        nodes {
          id
          namespace
          key
          value
          type
          description
        }
      }
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `#graphql
  mutation CustomerUpdate($input: CustomerUpdateInput!) {
    customerUpdate(input: $input) {
      customer {
        id
        firstName
        lastName
        displayName
        emailAddress {
          emailAddress
          marketingState
        }
        phoneNumber {
          phoneNumber
        }
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const CREATE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressCreate($address: CustomerAddressInput!) {
    customerAddressCreate(address: $address) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        zip
        country
        phoneNumber
        formatted
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const UPDATE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressUpdate($addressId: ID!, $address: CustomerAddressInput!, $defaultAddress: Boolean) {
    customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) {
      customerAddress {
        id
        firstName
        lastName
        company
        address1
        address2
        city
        province
        zip
        country
        phoneNumber
        formatted
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressDelete($addressId: ID!) {
    customerAddressDelete(addressId: $addressId) {
      deletedAddressId
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const EMAIL_MARKETING_SUBSCRIBE_MUTATION = `#graphql
  mutation CustomerEmailMarketingSubscribe {
    customerEmailMarketingSubscribe {
      emailAddress {
        emailAddress
        marketingState
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const EMAIL_MARKETING_UNSUBSCRIBE_MUTATION = `#graphql
  mutation CustomerEmailMarketingUnsubscribe {
    customerEmailMarketingUnsubscribe {
      emailAddress {
        emailAddress
        marketingState
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Enhanced Customer Account API client
 */
class CustomerAPI {
  private shopId: string;

  constructor() {
    this.shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID || '';

    if (!this.shopId) {
      throw new Error('NEXT_PUBLIC_SHOPIFY_SHOP_ID environment variable is required');
    }

    console.log('CustomerAPI initialized with shop ID:', this.shopId);
  }

  private get apiUrl(): string {
    const url = `https://shopify.com/${this.shopId}/account/customer/api/2025-04/graphql`;
    return url;
  }

  private async request<T>(query: string, variables: Record<string, any> = {}): Promise<T> {
    const accessToken = await getValidAccessToken();

    if (!accessToken) {
      throw new Error('No valid access token available. Please log in again.');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${accessToken}`,
        Origin: process.env.NEXT_PUBLIC_APP_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
        'User-Agent': 'NextJS-CustomerAccount/1.0',
        Accept: 'application/json',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        const { clearTokens } = await import('./auth-utils');
        clearTokens();
        throw new Error('Authentication failed. Please log in again.');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      const authError = json.errors.find(
        (error: any) =>
          error.extensions?.code === 'UNAUTHENTICATED' ||
          error.message?.includes('access denied') ||
          error.message?.includes('Authentication required')
      );

      if (authError) {
        const { clearTokens } = await import('./auth-utils');
        clearTokens();
        throw new Error('Authentication failed. Please log in again.');
      }

      throw new Error(json.errors[0]?.message || 'GraphQL error occurred');
    }

    return json.data;
  }

  // Basic connectivity test
  testConnection = async (): Promise<any> => {
    try {
      const data = await this.request<any>(`query { customer { id displayName } }`);
      return data;
    } catch (error) {
      console.error('❌ Basic connection test failed:', error);
      throw error;
    }
  };

  // Profile management
  getProfile = async (): Promise<CustomerProfile | null> => {
    try {
      const data = await this.request<{ customer: CustomerProfile }>(CUSTOMER_PROFILE_QUERY);
      return data.customer;
    } catch (error) {
      console.error('❌ Failed to get customer profile:', error);
      return null;
    }
  };

  // Fixed updateProfile method - only uses supported fields
  updateProfile = async (input: CustomerUpdateInput): Promise<CustomerProfile | null> => {
    try {
      // Create the input object with only the fields that CustomerUpdateInput supports
      const shopifyInput: any = {};

      // Only firstName and lastName are supported by CustomerUpdateInput
      if (input.firstName !== undefined) {
        shopifyInput.firstName = input.firstName;
      }
      if (input.lastName !== undefined) {
        shopifyInput.lastName = input.lastName;
      }

      // If no valid fields to update, just return current profile
      if (Object.keys(shopifyInput).length === 0) {
        console.log('No valid fields to update, returning current profile');
        return await this.getProfile();
      }

      console.log('Updating profile with input:', shopifyInput);

      const data = await this.request<{
        customerUpdate: {
          customer: CustomerProfile;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(UPDATE_CUSTOMER_MUTATION, { input: shopifyInput });

      if (data.customerUpdate.userErrors.length > 0) {
        console.error('Profile update errors:', data.customerUpdate.userErrors);
        throw new Error(data.customerUpdate.userErrors.map((e) => e.message).join(', '));
      }

      console.log('Profile updated successfully:', data.customerUpdate.customer);
      return data.customerUpdate.customer;
    } catch (error) {
      console.error('❌ Failed to update customer profile:', error);
      throw error;
    }
  };

  // Address management
  getAddresses = async (): Promise<CustomerAddress[]> => {
    try {
      const data = await this.request<{ customer: { addresses: { nodes: CustomerAddress[] } } }>(
        CUSTOMER_ADDRESSES_QUERY
      );
      return data.customer.addresses.nodes;
    } catch (error) {
      console.error('❌ Failed to get customer addresses:', error);
      return [];
    }
  };

  createAddress = async (address: CustomerAddressInput): Promise<CustomerAddress | null> => {
    try {
      console.log('Creating address with input:', address);

      const data = await this.request<{
        customerAddressCreate: {
          customerAddress: CustomerAddress;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(CREATE_ADDRESS_MUTATION, { address });

      console.log('Create address response:', data);

      if (data.customerAddressCreate.userErrors.length > 0) {
        const errorMessages = data.customerAddressCreate.userErrors.map((e) => e.message).join(', ');
        console.error('Address creation errors:', data.customerAddressCreate.userErrors);
        throw new Error(errorMessages);
      }

      return data.customerAddressCreate.customerAddress;
    } catch (error) {
      console.error('❌ Failed to create customer address:', error);
      throw error;
    }
  };

  updateAddress = async (
    addressId: string,
    address: CustomerAddressInput,
    defaultAddress?: boolean
  ): Promise<CustomerAddress | null> => {
    try {
      console.log('Updating address with input:', { addressId, address, defaultAddress });

      const data = await this.request<{
        customerAddressUpdate: {
          customerAddress: CustomerAddress;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(UPDATE_ADDRESS_MUTATION, {
        addressId,
        address,
        defaultAddress: defaultAddress || null,
      });

      console.log('Update address response:', data);

      if (data.customerAddressUpdate.userErrors.length > 0) {
        const errorMessages = data.customerAddressUpdate.userErrors.map((e) => e.message).join(', ');
        console.error('Address update errors:', data.customerAddressUpdate.userErrors);
        throw new Error(errorMessages);
      }

      return data.customerAddressUpdate.customerAddress;
    } catch (error) {
      console.error('❌ Failed to update customer address:', error);
      throw error;
    }
  };

  deleteAddress = async (addressId: string): Promise<boolean> => {
    try {
      const data = await this.request<{
        customerAddressDelete: {
          deletedAddressId: string;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(DELETE_ADDRESS_MUTATION, { addressId });

      if (data.customerAddressDelete.userErrors.length > 0) {
        const errorMessages = data.customerAddressDelete.userErrors.map((e) => e.message).join(', ');
        console.error('Address deletion errors:', data.customerAddressDelete.userErrors);
        throw new Error(errorMessages);
      }

      return !!data.customerAddressDelete.deletedAddressId;
    } catch (error) {
      console.error('❌ Failed to delete customer address:', error);
      throw error;
    }
  };

  // Fixed email marketing management
  subscribeToEmailMarketing = async (): Promise<{ success: boolean; marketingState?: string }> => {
    try {
      console.log('Attempting to subscribe to email marketing...');

      const data = await this.request<{
        customerEmailMarketingSubscribe: {
          emailAddress: {
            emailAddress: string;
            marketingState: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(EMAIL_MARKETING_SUBSCRIBE_MUTATION);

      console.log('Email marketing subscribe response:', data);

      if (data.customerEmailMarketingSubscribe.userErrors.length > 0) {
        const errorMessage = data.customerEmailMarketingSubscribe.userErrors.map((e) => e.message).join(', ');
        console.error('Email marketing subscribe errors:', data.customerEmailMarketingSubscribe.userErrors);
        throw new Error(errorMessage);
      }

      const marketingState = data.customerEmailMarketingSubscribe.emailAddress?.marketingState;
      console.log('Email marketing subscription result:', marketingState);

      return {
        success: marketingState === 'SUBSCRIBED',
        marketingState,
      };
    } catch (error) {
      console.error('❌ Failed to subscribe to email marketing:', error);
      throw error;
    }
  };

  unsubscribeFromEmailMarketing = async (): Promise<{ success: boolean; marketingState?: string }> => {
    try {
      console.log('Attempting to unsubscribe from email marketing...');

      const data = await this.request<{
        customerEmailMarketingUnsubscribe: {
          emailAddress: {
            emailAddress: string;
            marketingState: string;
          } | null;
          userErrors: Array<{ field: string[]; message: string; code: string }>;
        };
      }>(EMAIL_MARKETING_UNSUBSCRIBE_MUTATION);

      console.log('Email marketing unsubscribe response:', data);

      if (data.customerEmailMarketingUnsubscribe.userErrors.length > 0) {
        const errorMessage = data.customerEmailMarketingUnsubscribe.userErrors.map((e) => e.message).join(', ');
        console.error('Email marketing unsubscribe errors:', data.customerEmailMarketingUnsubscribe.userErrors);
        throw new Error(errorMessage);
      }

      const marketingState = data.customerEmailMarketingUnsubscribe.emailAddress?.marketingState;
      console.log('Email marketing unsubscription result:', marketingState);

      return {
        success: marketingState === 'UNSUBSCRIBED',
        marketingState,
      };
    } catch (error) {
      console.error('❌ Failed to unsubscribe from email marketing:', error);
      throw error;
    }
  };

  // Helper method to toggle email marketing based on current state
  toggleEmailMarketing = async (subscribe: boolean): Promise<{ success: boolean; marketingState?: string }> => {
    try {
      if (subscribe) {
        return await this.subscribeToEmailMarketing();
      } else {
        return await this.unsubscribeFromEmailMarketing();
      }
    } catch (error) {
      console.error('❌ Failed to toggle email marketing:', error);
      throw error;
    }
  };

  // Get current email marketing state
  getEmailMarketingState = async (): Promise<EmailMarketingState | null> => {
    try {
      const profile = await this.getProfile();
      return profile?.emailAddress?.marketingState || null;
    } catch (error) {
      console.error('❌ Failed to get email marketing state:', error);
      return null;
    }
  };

  // Order management
  getOrders = async (filters?: OrderFilters): Promise<CustomerOrder[]> => {
    try {
      const variables = {
        first: 20,
        sortKey: filters?.sortBy || 'PROCESSED_AT',
        reverse: filters?.reverse ?? true,
      };

      const data = await this.request<{ customer: { orders: { edges: Array<{ node: CustomerOrder }> } } }>(
        CUSTOMER_ORDERS_QUERY,
        variables
      );
      return data.customer.orders.edges.map((edge) => edge.node);
    } catch (error) {
      console.error('❌ Failed to get customer orders:', error);
      return [];
    }
  };

  // Store credit management
  getStoreCreditAccounts = async (): Promise<CustomerStoreCreditAccount[]> => {
    try {
      const data = await this.request<{ customer: { storeCreditAccounts: { nodes: CustomerStoreCreditAccount[] } } }>(
        CUSTOMER_STORE_CREDIT_QUERY
      );
      return data.customer.storeCreditAccounts.nodes;
    } catch (error) {
      console.error('❌ Failed to get store credit accounts:', error);
      return [];
    }
  };

  // Metafields for custom data
  getMetafields = async (namespace?: string): Promise<CustomerMetafield[]> => {
    try {
      const data = await this.request<{ customer: { metafields: { nodes: CustomerMetafield[] } } }>(
        CUSTOMER_METAFIELDS_QUERY,
        { namespace }
      );
      return data.customer.metafields.nodes;
    } catch (error) {
      console.error('❌ Failed to get customer metafields:', error);
      return [];
    }
  };

  // Wishlist functionality using metafields
  getWishlist = async (): Promise<string[]> => {
    try {
      const metafields = await this.getMetafields('wishlist');
      const wishlistMetafield = metafields.find((m) => m.key === 'product_ids');
      return wishlistMetafield ? JSON.parse(wishlistMetafield.value) : [];
    } catch (error) {
      console.error('❌ Failed to get wishlist:', error);
      return [];
    }
  };

  // Comprehensive customer data fetch
  getCustomerData = async () => {
    try {
      const [profile, addresses, orders, storeCreditAccounts] = await Promise.all([
        this.getProfile(),
        this.getAddresses(),
        this.getOrders(),
        this.getStoreCreditAccounts(),
      ]);

      return {
        profile,
        addresses,
        orders,
        storeCreditAccounts,
      };
    } catch (error) {
      console.error('❌ Failed to get comprehensive customer data:', error);
      throw error;
    }
  };
}

// Export singleton instance
export const customerAPI = new CustomerAPI();

// Export individual methods for convenience
export const getCustomerProfile = customerAPI.getProfile;
export const updateCustomerProfile = customerAPI.updateProfile;
export const getCustomerAddresses = customerAPI.getAddresses;
export const createCustomerAddress = customerAPI.createAddress;
export const updateCustomerAddress = customerAPI.updateAddress;
export const deleteCustomerAddress = customerAPI.deleteAddress;
export const subscribeToEmailMarketing = customerAPI.subscribeToEmailMarketing;
export const unsubscribeFromEmailMarketing = customerAPI.unsubscribeFromEmailMarketing;
export const toggleEmailMarketing = customerAPI.toggleEmailMarketing;
export const getEmailMarketingState = customerAPI.getEmailMarketingState;
export const getCustomerOrders = customerAPI.getOrders;
export const getCustomerStoreCreditAccounts = customerAPI.getStoreCreditAccounts;
export const getCustomerMetafields = customerAPI.getMetafields;
export const getCustomerWishlist = customerAPI.getWishlist;
export const getCustomerData = customerAPI.getCustomerData;
export const testCustomerAPIConnection = customerAPI.testConnection;
