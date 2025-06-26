/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Customer, MoneyV2 } from '@shopify/hydrogen-react/storefront-api-types';
import {
  Calendar,
  ChevronRight,
  CreditCard,
  Edit,
  Eye,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  User,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import { client } from '@/lib/shopify'; // Your existing client

interface CustomerFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  acceptsMarketing?: boolean;
}

// GraphQL queries for customer data
const CUSTOMER_QUERY = `#graphql
  query Customer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      createdAt
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
        phone
      }
      addresses(first: 10) {
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
          phone
        }
      }
      orders(first: 10, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          orderNumber
          processedAt
          financialStatus
          fulfillmentStatus
          totalPrice {
            amount
            currencyCode
          }
          currentTotalPrice {
            amount
            currencyCode
          }
          statusUrl
          lineItems(first: 10) {
            nodes {
              title
              quantity
              variant {
                id
                title
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
    }
  }
`;

const UPDATE_CUSTOMER_MUTATION = `#graphql
  mutation CustomerUpdate($customer: CustomerUpdateInput!, $customerAccessToken: String!) {
    customerUpdate(customer: $customer, customerAccessToken: $customerAccessToken) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const CREATE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressCreate($address: MailingAddressInput!, $customerAccessToken: String!) {
    customerAddressCreate(address: $address, customerAccessToken: $customerAccessToken) {
      customerAddress {
        id
      }
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const DELETE_ADDRESS_MUTATION = `#graphql
  mutation CustomerAddressDelete($id: ID!, $customerAccessToken: String!) {
    customerAddressDelete(id: $id, customerAccessToken: $customerAccessToken) {
      deletedCustomerAddressId
      customerUserErrors {
        field
        message
        code
      }
    }
  }
`;

const DELETE_ACCESS_TOKEN_MUTATION = `#graphql
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

// Helper function for making requests using your existing client
async function shopifyRequest(query: any, variables = {}) {
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
      return null;
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API error:', error);
    return null;
  }
}

export default function AccountPage({ customerAccessToken }: { customerAccessToken: string }) {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [formData, setFormData] = useState<CustomerFormData>({});

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  // Fetch customer data on mount
  useEffect(() => {
    if (!customerAccessToken) {
      // Redirect to login if no token
      window.location.href = '/login';
      return;
    }

    fetchCustomer();
  }, [customerAccessToken]);

  const fetchCustomer = async () => {
    try {
      setLoading(true);
      const data = await shopifyRequest(CUSTOMER_QUERY, {
        customerAccessToken,
      });

      if (data?.customer) {
        setCustomer(data.customer);
        setFormData({
          firstName: data.customer.firstName || '',
          lastName: data.customer.lastName || '',
          email: data.customer.email || '',
          phone: data.customer.phone || '',
        });
      } else {
        setError('Failed to load customer data');
      }
    } catch (err) {
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await shopifyRequest(UPDATE_CUSTOMER_MUTATION, {
        customer: formData,
        customerAccessToken,
      });

      if (data?.customerUpdate?.customerUserErrors?.length > 0) {
        setError(data.customerUpdate.customerUserErrors[0].message);
      } else {
        setCustomer(data?.customerUpdate?.customer);
        setIsEditingProfile(false);
        setError(null);
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await shopifyRequest(DELETE_ACCESS_TOKEN_MUTATION, {
        customerAccessToken,
      });

      // Clear local storage or cookies
      localStorage.removeItem('customerAccessToken');

      // Redirect to home
      window.location.href = '/';
    } catch (error) {
      setError('Failed to sign out');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string): Promise<void> => {
    try {
      setLoading(true);
      const data = await shopifyRequest(DELETE_ADDRESS_MUTATION, {
        id: addressId,
        customerAccessToken,
      });

      if (data?.customerAddressDelete?.customerUserErrors?.length > 0) {
        setError(data.customerAddressDelete.customerUserErrors[0].message);
      } else {
        await fetchCustomer();
        setError(null);
      }
    } catch (error) {
      setError('Failed to delete address');
    } finally {
      setLoading(false);
    }
  };

  const getOrderStatusColor = (status: string): string => {
    const statusColors: Record<string, string> = {
      PAID: 'text-green-600 bg-green-50',
      PENDING: 'text-yellow-600 bg-yellow-50',
      REFUNDED: 'text-red-600 bg-red-50',
      FULFILLED: 'text-blue-600 bg-blue-50',
      IN_PROGRESS: 'text-orange-600 bg-orange-50',
      UNFULFILLED: 'text-gray-600 bg-gray-50',
    };
    return statusColors[status] || 'text-gray-600 bg-gray-50';
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (price: MoneyV2): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: price.currencyCode,
    }).format(parseFloat(price.amount));
  };

  if (loading && !customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Account not found</h3>
          <p className="text-gray-600 mb-6">Please sign in to access your account</p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <span>Sign In</span>
          </button>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-red-600 to-purple-600 rounded-xl p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, {customer.firstName || 'Valued Customer'}!</h2>
        <p className="opacity-90">Manage your account and track your orders</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{customer.orders?.nodes?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Saved Addresses</p>
              <p className="text-2xl font-bold text-gray-900">{customer.addresses?.nodes?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Member Since</p>
              <p className="text-lg font-bold text-gray-900">{formatDate(customer.createdAt).split(',')[1]}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      {customer.orders?.nodes && customer.orders.nodes.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            {customer.orders.nodes.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Package className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{order.name}</p>
                    <p className="text-sm text-gray-600">{formatDate(order.processedAt)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(order.totalPrice)}</p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.fulfillmentStatus)}`}
                  >
                    {order.fulfillmentStatus?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Order History</h2>
      </div>

      {!customer.orders?.nodes || customer.orders.nodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">You haven&lsquo;t placed any orders with us yet</p>
          <button
            onClick={() => (window.location.href = '/')}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Start Shopping</span>
          </button>
        </div>
      ) : (
        customer.orders.nodes.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold text-gray-900">Order {order.name}</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order.fulfillmentStatus)}`}
                  >
                    {order.fulfillmentStatus?.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">{formatPrice(order.totalPrice)}</p>
                  <p className="text-sm text-gray-600">Placed on {formatDate(order.processedAt)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Payment: {order.financialStatus}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4" />
                    <span>
                      {order.lineItems?.nodes?.length || 0} item{(order.lineItems?.nodes?.length || 0) > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {order.statusUrl && (
                  <a
                    href={order.statusUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Order</span>
                  </a>
                )}
              </div>
            </div>

            {/* Order Items */}
            {order.lineItems?.nodes && (
              <div className="p-6">
                <div className="space-y-4">
                  {order.lineItems.nodes.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        {item.variant?.image?.url ? (
                          <img
                            src={item.variant.image.url}
                            alt={item.variant.image.altText || item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        {item.variant?.title && item.variant.title !== 'Default Title' && (
                          <p className="text-sm text-gray-600">{item.variant.title}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {item.variant?.price ? formatPrice(item.variant.price) : 'N/A'}
                        </p>
                        {item.quantity > 1 && <p className="text-sm text-gray-600">each</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  const renderAddresses = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => {
            // Add new address functionality
            window.location.href = '/account/addresses/add';
          }}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {!customer.addresses?.nodes || customer.addresses.nodes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
          <p className="text-gray-600 mb-6">Add an address to make checkout faster</p>
          <button
            onClick={() => {
              window.location.href = '/account/addresses/add';
            }}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            <span>Add Address</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {customer.addresses.nodes.map((address) => (
            <div key={address.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  {customer.defaultAddress?.id === address.id && (
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      window.location.href = `/account/addresses/${address.id}/edit`;
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {customer.defaultAddress?.id !== address.id && (
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={loading}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {address.firstName} {address.lastName}
                </p>
                {address.company && <p>{address.company}</p>}
                <p>{address.address1}</p>
                {address.address2 && <p>{address.address2}</p>}
                <p>
                  {address.city}, {address.province} {address.zip}
                </p>
                <p>{address.country}</p>
                {address.phone && <p>{address.phone}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        <button
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
        >
          <Edit className="w-4 h-4" />
          <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
        </button>
      </div>

      <form onSubmit={handleUpdateProfile} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            {isEditingProfile ? (
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{customer.firstName || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            {isEditingProfile ? (
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{customer.lastName || 'Not provided'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            {isEditingProfile ? (
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-500" />
                <span>{customer.email || 'Not provided'}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            {isEditingProfile ? (
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-500" />
                <span>{customer.phone || 'Not provided'}</span>
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Marketing Communications</h3>
              <p className="text-sm text-gray-600">Receive emails about new products and offers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptsMarketing || false}
                onChange={(e) => setFormData((prev) => ({ ...prev, acceptsMarketing: e.target.checked }))}
                className="sr-only peer"
                disabled={!isEditingProfile}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600 peer-disabled:opacity-50"></div>
            </label>
          </div>
        </div>

        {isEditingProfile && (
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditingProfile(false);
                // Reset form data
                setFormData({
                  firstName: customer.firstName || '',
                  lastName: customer.lastName || '',
                  email: customer.email || '',
                  phone: customer.phone || '',
                });
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-medium text-gray-900 mb-4">Account Information</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Member since</span>
            <span className="text-gray-900">{formatDate(customer.createdAt)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Customer ID</span>
            <span className="text-gray-900 font-mono text-xs">{customer.id.split('/').pop()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Orders</span>
            <span className="text-gray-900">{customer.orders?.nodes?.length || 0}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-200 shadow-sm p-6">
        <h3 className="font-medium text-red-900 mb-4">Account Actions</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Reset Password</p>
              <p className="text-sm text-gray-600">Send a password reset email to your account</p>
            </div>
            <button
              onClick={() => {
                // Implement password reset functionality
                window.location.href = '/account/recover';
              }}
              className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors font-medium"
            >
              Reset Password
            </button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div>
              <p className="font-medium text-gray-900">Sign Out</p>
              <p className="text-sm text-gray-600">Sign out of your account on this device</p>
            </div>
            <button
              onClick={handleSignOut}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
            <button onClick={() => setError(null)} className="text-red-600 underline text-sm mt-1">
              Dismiss
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {customer.firstName?.[0] || customer.email?.[0] || 'U'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{customer.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        activeTab === tab.id
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Quick Actions in Sidebar */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => (window.location.href = '/')}
                    className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Continue Shopping</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = '/account/addresses/add')}
                    className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Address</span>
                  </button>
                  <button
                    onClick={() => (window.location.href = '/contact')}
                    className="w-full flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Contact Support</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'orders' && renderOrders()}
            {activeTab === 'addresses' && renderAddresses()}
            {activeTab === 'profile' && renderProfile()}
          </div>
        </div>
      </div>
    </div>
  );
}
