/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import countryList from 'country-list'; // Import the default export for all countries

import {
  AlertCircle,
  Calendar,
  CreditCard,
  Edit,
  Eye,
  Loader2,
  LogOut,
  Mail,
  MapPin,
  Package,
  Phone,
  Plus,
  Settings,
  Truck,
  User,
  Wallet,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerData,
  updateCustomerProfile,
} from '@/lib/customer-api';
import { EmailMarketingState } from '@/types/auth';

import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrder,
  CustomerProfile,
  CustomerStoreCreditAccount,
  CustomerUpdateInput,
} from '@/types/auth';

type TabType = 'profile' | 'addresses' | 'orders' | 'store-credit' | 'preferences';

interface CustomerData {
  profile: CustomerProfile | null;
  addresses: CustomerAddress[];
  orders: CustomerOrder[];
  storeCreditAccounts: CustomerStoreCreditAccount[];
}

interface AddressFormState extends CustomerAddressInput {
  // Add display-only fields for the form
  provinceName?: string; // For display in the form
  countryName?: string; // For display in the form
}

export default function AccountPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, customer, logout } = useAuth();

  const [customerData, setCustomerData] = useState<CustomerData>({
    profile: null,
    addresses: [],
    orders: [],
    storeCreditAccounts: [],
  });

  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<CustomerUpdateInput>({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormState>({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Load customer data
  useEffect(() => {
    if (isAuthenticated && customer) {
      loadCustomerData();
    }
  }, [isAuthenticated, customer]);

  const countries = useMemo(() => {
    return countryList.getData().sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
  }, []);

  const loadCustomerData = async () => {
    try {
      setDataLoading(true);
      setError(null);

      const data = await getCustomerData();
      setCustomerData(data);

      // Initialize profile form
      if (data.profile) {
        setProfileForm({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
          email: data.profile.emailAddress?.emailAddress || '',
          phone: data.profile.phoneNumber?.phoneNumber || '',
        });
      }
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setError('Failed to load account data. Please try refreshing the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      setError(null);

      // Prepare the update input
      const updateInput: CustomerUpdateInput = {};

      if (profileForm.firstName !== undefined && profileForm.firstName !== profile?.firstName) {
        updateInput.firstName = profileForm.firstName;
      }

      if (profileForm.lastName !== undefined && profileForm.lastName !== profile?.lastName) {
        updateInput.lastName = profileForm.lastName;
      }

      if (profileForm.email !== undefined && profileForm.email !== profile?.emailAddress?.emailAddress) {
        updateInput.email = profileForm.email;
      }

      if (profileForm.phone !== undefined && profileForm.phone !== profile?.phoneNumber?.phoneNumber) {
        updateInput.phone = profileForm.phone;
      }

      if (profileForm.acceptsMarketing !== undefined) {
        updateInput.acceptsMarketing = profileForm.acceptsMarketing;
      }

      console.log('Updating profile with:', updateInput);

      const updatedProfile = await updateCustomerProfile(updateInput);
      if (updatedProfile) {
        setCustomerData((prev) => ({ ...prev, profile: updatedProfile }));
        setEditingProfile(false);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleCreateAddress = async () => {
    try {
      setError(null);

      // Create the input using only valid CustomerAddressInput fields
      const shopifyAddressInput: CustomerAddressInput = {};

      // Only include fields that exist in CustomerAddressInput
      if (addressForm.firstName) shopifyAddressInput.firstName = addressForm.firstName;
      if (addressForm.lastName) shopifyAddressInput.lastName = addressForm.lastName;
      if (addressForm.company) shopifyAddressInput.company = addressForm.company;
      if (addressForm.address1) shopifyAddressInput.address1 = addressForm.address1;
      if (addressForm.address2) shopifyAddressInput.address2 = addressForm.address2;
      if (addressForm.city) shopifyAddressInput.city = addressForm.city;
      if (addressForm.zip) shopifyAddressInput.zip = addressForm.zip;
      if (addressForm.phoneNumber) shopifyAddressInput.phoneNumber = addressForm.phoneNumber;
      if (addressForm.territoryCode) shopifyAddressInput.territoryCode = addressForm.territoryCode;
      if (addressForm.zoneCode) shopifyAddressInput.zoneCode = addressForm.zoneCode;

      console.log('Creating address with:', shopifyAddressInput);

      const newAddress = await createCustomerAddress(shopifyAddressInput);

      if (newAddress) {
        setCustomerData((prev) => ({
          ...prev,
          addresses: [...prev.addresses, newAddress],
        }));
        setShowAddressForm(false);
        setAddressForm({});
      }
    } catch (error: any) {
      console.error('Failed to create address:', error);
      setError(`Failed to create address: ${error.message}`);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setError(null);
      const success = await deleteCustomerAddress(addressId);
      if (success) {
        setCustomerData((prev) => ({
          ...prev,
          addresses: prev.addresses.filter((addr) => addr.id !== addressId),
        }));
      }
    } catch (error) {
      console.error('Failed to delete address:', error);
      setError('Failed to delete address. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout(true);
    } catch (error) {
      console.error('Logout failed:', error);
      router.push('/');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (amount: string, currencyCode: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  };

  const getTotalStoreCredit = () => {
    return customerData.storeCreditAccounts.reduce((total, account) => {
      return total + parseFloat(account.balance.amount);
    }, 0);
  };

  // Show loading state
  if (isLoading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-gray-600">Loading your account...</span>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !customerData.profile) {
    return null;
  }

  const { profile, addresses, orders, storeCreditAccounts } = customerData;

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedCountry = countries.find((country) => country.code === selectedCode);

    setAddressForm((prev) => ({
      ...prev,
      territoryCode: selectedCode,
      countryName: selectedCountry?.name || '',
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {profile.imageUrl && profile.imageUrl.length > 0 && (
                <div className="relative h-12 w-12 rounded-full overflow-hidden">
                  <Image src={profile.imageUrl} alt="Profile" fill className="object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bungee font-bold text-gray-900">My Account</h1>
                <p className="text-gray-600">Welcome back, {profile.displayName}!</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {getTotalStoreCredit() > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-2">
                    <Wallet className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800">
                      ${getTotalStoreCredit().toFixed(2)} Credit
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/products')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back to Store
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-5">
          {/* Sidebar */}
          <aside className="py-6 px-2 sm:px-6 lg:py-0 lg:px-0 lg:col-span-3">
            <nav className="space-y-1">
              {[
                { id: 'profile', icon: User, label: 'Profile', count: null },
                { id: 'addresses', icon: MapPin, label: 'Addresses', count: addresses.length },
                { id: 'orders', icon: Package, label: 'Orders', count: orders.length },
                { id: 'store-credit', icon: Wallet, label: 'Store Credit', count: storeCreditAccounts.length },
                { id: 'preferences', icon: Settings, label: 'Preferences', count: null },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as TabType)}
                  className={`w-full text-left group rounded-md px-3 py-2 flex items-center text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-secondary text-primary border-secondary'
                      : 'text-text hover:text-primary/90 hover:bg-secondary/50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.count !== null && item.count > 0 && (
                    <span className="ml-auto bg-secondary text-primary rounded-full text-xs px-2 py-1">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content area */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      className="inline-flex items-center px-3 py-2 border border-secondary shadow-sm text-sm leading-4 font-medium rounded-md text-text bg-secondary hover:bg-gray-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {editingProfile ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            value={profileForm.firstName || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            value={profileForm.lastName || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700/50">Email</label>
                          <input
                            type="email"
                            disabled
                            value={profileForm.email || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                            className="mt-1 block w-full border-gray-300/50 cursor-not-allowed rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700/50">Phone</label>
                          <input
                            type="tel"
                            disabled
                            value={profileForm.phone || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                            className="mt-1 block w-full border-gray-300/50 cursor-not-allowed rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={profileForm.acceptsMarketing || false}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, acceptsMarketing: e.target.checked }))}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">I want to receive marketing emails</label>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditingProfile(false)}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          className="px-4 py-2 bg-secondary border border-transparent rounded-md text-sm font-medium text-text hover:bg-secondary/90"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{profile.displayName || 'Not provided'}</dd>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </div>
                        <div className="mt-1 text-sm text-gray-900">
                          {profile.emailAddress?.emailAddress || 'Not provided'}
                        </div>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          Phone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile.phoneNumber?.phoneNumber || 'Not provided'}
                        </dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Member Since
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(profile.creationDate)}</dd>
                      </div>

                      <div>
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Marketing Emails
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {profile.emailAddress?.marketingState}
                          </span>
                        </dd>
                      </div>

                      {profile.tags && profile.tags.length > 0 && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Tags</dt>
                          <dd className="mt-1">
                            <div className="flex flex-wrap gap-1">
                              {profile.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </dd>
                        </div>
                      )}
                    </dl>
                  )}
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Addresses</h3>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-text bg-secondary hover:bg-secondary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </button>
                  </div>

                  {showAddressForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Add New Address</h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            value={addressForm.firstName || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            value={addressForm.lastName || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
                          <input
                            type="text"
                            value={addressForm.company || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, company: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                          <input
                            type="text"
                            value={addressForm.address1 || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, address1: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={addressForm.address2 || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, address2: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">City</label>
                          <input
                            type="text"
                            value={addressForm.city || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">State/Province</label>
                          <input
                            type="text"
                            value={addressForm.provinceName || ''}
                            onChange={(e) =>
                              setAddressForm((prev) => ({
                                ...prev,
                                provinceName: e.target.value,
                                // You can map this to zoneCode if you have a mapping function
                                zoneCode: e.target.value,
                              }))
                            }
                            placeholder="e.g., California, Ontario"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">ZIP/Postal Code</label>
                          <input
                            type="text"
                            value={addressForm.zip || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, zip: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Country</label>
                          <select
                            id="country-select"
                            value={addressForm.territoryCode || ''}
                            onChange={handleCountryChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                          >
                            <option value="" disabled>
                              Select a country
                            </option>
                            {countries.map((country) => (
                              <option key={country.code} value={country.code}>
                                {country.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                          <input
                            type="tel"
                            value={addressForm.phoneNumber || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => {
                            setShowAddressForm(false);
                            setAddressForm({});
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCreateAddress}
                          className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700"
                        >
                          Save Address
                        </button>
                      </div>
                    </div>
                  )}

                  {addresses.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven&#39;t added any shipping addresses yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-gray-200 rounded-lg p-4 relative">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {address.firstName} {address.lastName}
                            </h4>
                            <button
                              onClick={() => handleDeleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {address.company && <p>{address.company}</p>}
                            <p>{address.address1}</p>
                            {address.address2 && <p>{address.address2}</p>}
                            <p>
                              {address.city}, {address.province} {address.zip}
                            </p>
                            <p>{address.country}</p>
                            {address.phoneNumber && <p>{address.phoneNumber}</p>}
                          </div>
                          {profile.defaultAddress?.id === address.id && (
                            <div className="absolute top-2 right-2">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Default
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order History</h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven&#39;t placed any orders yet.</p>
                      <button
                        onClick={() => router.push('/products')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-text bg-secondary hover:bg-secondary/90"
                      >
                        Start Shopping
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">Order {order.name}</h4>
                              <p className="text-sm text-gray-500">Placed on {formatDate(order.processedAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.financialStatus === 'PAID'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {order.financialStatus}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    order.fulfillmentStatus === 'FULFILLED'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <Truck className="h-3 w-3 mr-1" />
                                  {order.fulfillmentStatus || 'PENDING'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="border-t border-gray-200 pt-3">
                            <p className="text-sm font-medium text-gray-900 mb-2">Items:</p>
                            <div className="space-y-2">
                              {order.lineItems.edges.map(({ node: item }) => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                  <div className="flex items-center space-x-3">
                                    {item.image && (
                                      <div className="relative h-8 w-8 rounded overflow-hidden">
                                        <Image
                                          src={item.image.url}
                                          alt={item.image.altText || item.title}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <span className="text-gray-900">
                                      {item.quantity}x {item.title}
                                      {item.variantTitle && (
                                        <span className="text-gray-500"> - {item.variantTitle}</span>
                                      )}
                                    </span>
                                  </div>
                                  <span className="text-gray-900 font-medium">
                                    {formatPrice(item.price.amount, item.price.currencyCode)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* View Order Button */}
                          <div className="mt-4 pt-3 border-t border-gray-200">
                            <a
                              href={order.statusPageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Order Details
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Store Credit Tab */}
            {activeTab === 'store-credit' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Store Credit</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${getTotalStoreCredit().toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Total Available</p>
                    </div>
                  </div>

                  {storeCreditAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <Wallet className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No store credit</h3>
                      <p className="mt-1 text-sm text-gray-500">You don&apos;t have any store credit available.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {storeCreditAccounts.map((account) => (
                        <div key={account.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-medium text-gray-900">Store Credit Account</h4>
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(account.balance.amount, account.balance.currencyCode)}
                            </span>
                          </div>

                          {account.transactions && account.transactions.edges.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-gray-900 mb-2">Recent Transactions</h5>
                              <div className="space-y-2">
                                {account.transactions.edges.map(({ node: transaction }, index) => (
                                  <div key={index} className="flex justify-between items-center text-sm">
                                    <div>
                                      <p className="text-gray-900">Store Credit Transaction</p>
                                      <p className="text-gray-500">{formatDate(transaction.createdAt)}</p>
                                    </div>
                                    <span
                                      className={`font-medium ${
                                        parseFloat(transaction.amount.amount) > 0 ? 'text-green-600' : 'text-red-600'
                                      }`}
                                    >
                                      {parseFloat(transaction.amount.amount) > 0 ? '+' : ''}
                                      {formatPrice(transaction.amount.amount, transaction.amount.currencyCode)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Account Preferences</h3>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-3">Communication Preferences</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Marketing Emails</p>
                            <p className="text-sm text-gray-500">Receive emails about new products and promotions</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile.emailAddress?.marketingState === EmailMarketingState.SUBSCRIBED}
                            onChange={async (e) => {
                              try {
                                await updateCustomerProfile({ acceptsMarketing: e.target.checked });
                                // Refresh the data to reflect changes
                                await loadCustomerData();
                              } catch (error) {
                                console.error('Failed to update marketing preference:', error);
                                setError('Failed to update marketing preference. Please try again.');
                              }
                            }}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Account Actions</h4>
                      <div className="space-y-3">
                        <button
                          onClick={() => loadCustomerData()}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Refresh Account Data
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
