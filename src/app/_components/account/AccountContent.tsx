/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import countryList from 'country-list'; // Import the default export for all countries

import {
  AlertCircle,
  Calendar,
  Check,
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
  Star,
  Truck,
  User,
  Wallet,
  X,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerData,
  toggleEmailMarketing,
  updateCustomerAddress,
  updateCustomerProfile,
} from '@/lib/customer-api';
import { EmailMarketingState } from '@/types/auth';
import { Button } from '../ui';

import type {
  CustomerAddress,
  CustomerAddressInput,
  CustomerOrder,
  CustomerProfile,
  CustomerStoreCreditAccount,
  CustomerUpdateInput,
} from '@/types/auth';

const TAB_VALUES = ['profile', 'addresses', 'orders', 'store-credit', 'preferences'] as const;
type TabType = (typeof TAB_VALUES)[number];

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

// Separate component that uses useSearchParams
function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const getInitialTab = (): TabType => {
    const tab = searchParams.get('tab');
    return (TAB_VALUES as readonly string[]).includes(tab || '') ? (tab as TabType) : 'profile';
  };

  const { isAuthenticated, isLoading, customer, logout } = useAuth();

  const [customerData, setCustomerData] = useState<CustomerData>({
    profile: null,
    addresses: [],
    orders: [],
    storeCreditAccounts: [],
  });

  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>(getInitialTab()!);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState<{ firstName?: string; lastName?: string }>({});
  const [profileUpdating, setProfileUpdating] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<AddressFormState>({});
  const [addressLoading, setAddressLoading] = useState(false);
  const [marketingLoading, setMarketingLoading] = useState(false);
  const [viewingAddressId, setViewingAddressId] = useState<string | null>(null);

  const handleTabChange = (tabId: TabType) => {
    setActiveTab(tabId);
    // Clear any form states when switching tabs
    setShowAddressForm(false);
    setEditingAddressId(null);
    setViewingAddressId(null);
    setAddressForm({});
    setError(null);
    setSuccess(null);

    // Update URL without causing a page reload
    const newSearchParams = new URLSearchParams(searchParams);
    if (tabId === 'profile') {
      newSearchParams.delete('tab'); // Remove tab parameter for default tab
    } else {
      newSearchParams.set('tab', tabId);
    }

    const newUrl = newSearchParams.toString()
      ? `${window.location.pathname}?${newSearchParams.toString()}`
      : window.location.pathname;

    router.replace(newUrl, { scroll: false });
  };

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
    return countryList.getData().sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  const loadCustomerData = async () => {
    try {
      setDataLoading(true);
      setError(null);

      console.log('Loading customer data...');
      const data = await getCustomerData();
      console.log('Customer data loaded:', data);

      setCustomerData(data);

      // Initialize profile form with current data
      if (data.profile) {
        setProfileForm({
          firstName: data.profile.firstName || '',
          lastName: data.profile.lastName || '',
        });
      }
    } catch (error) {
      console.error('Failed to load customer data:', error);
      setError('Failed to load account data. Please try refreshing the page.');
    } finally {
      setDataLoading(false);
    }
  };

  const showMessage = (message: string, isError: boolean = false) => {
    if (isError) {
      setError(message);
      setSuccess(null);
    } else {
      setSuccess(message);
      setError(null);
    }
    // Auto-clear after 5 seconds
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 5000);
  };

  const handleUpdateProfile = async () => {
    try {
      setProfileUpdating(true);
      setError(null);
      setSuccess(null);

      const { profile } = customerData;
      if (!profile) {
        throw new Error('No profile data available');
      }

      // Only include fields that have changed
      const updateInput: CustomerUpdateInput = {};

      if (profileForm.firstName !== undefined && profileForm.firstName !== profile.firstName) {
        updateInput.firstName = profileForm.firstName;
      }

      if (profileForm.lastName !== undefined && profileForm.lastName !== profile.lastName) {
        updateInput.lastName = profileForm.lastName;
      }

      // Check if there are any changes to make
      if (Object.keys(updateInput).length === 0) {
        showMessage('No changes to save');
        setEditingProfile(false);
        return;
      }

      console.log('Updating profile with:', updateInput);

      const updatedProfile = await updateCustomerProfile(updateInput);
      if (updatedProfile) {
        setCustomerData((prev) => ({ ...prev, profile: updatedProfile }));
        setEditingProfile(false);
        showMessage('Profile updated successfully!');

        // Update form state with new data
        setProfileForm({
          firstName: updatedProfile.firstName || '',
          lastName: updatedProfile.lastName || '',
        });
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      showMessage(`Failed to update profile: ${error.message}`, true);
    } finally {
      setProfileUpdating(false);
    }
  };

  // Address validation
  const validateAddressForm = (): string[] => {
    const errors: string[] = [];

    if (!addressForm.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!addressForm.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!addressForm.address1?.trim()) {
      errors.push('Address line 1 is required');
    }
    if (!addressForm.city?.trim()) {
      errors.push('City is required');
    }
    if (!addressForm.territoryCode?.trim()) {
      errors.push('Country is required');
    }
    if (!addressForm.zip?.trim()) {
      errors.push('ZIP/Postal code is required');
    }

    return errors;
  };

  const handleCreateAddress = async () => {
    try {
      setAddressLoading(true);
      setError(null);
      setSuccess(null);

      // Validate form
      const validationErrors = validateAddressForm();
      if (validationErrors.length > 0) {
        showMessage(validationErrors.join(', '), true);
        return;
      }

      // Create the input using only valid CustomerAddressInput fields
      const shopifyAddressInput: CustomerAddressInput = {};

      if (addressForm.firstName?.trim()) shopifyAddressInput.firstName = addressForm.firstName.trim();
      if (addressForm.lastName?.trim()) shopifyAddressInput.lastName = addressForm.lastName.trim();
      if (addressForm.company?.trim()) shopifyAddressInput.company = addressForm.company.trim();
      if (addressForm.address1?.trim()) shopifyAddressInput.address1 = addressForm.address1.trim();
      if (addressForm.address2?.trim()) shopifyAddressInput.address2 = addressForm.address2.trim();
      if (addressForm.city?.trim()) shopifyAddressInput.city = addressForm.city.trim();
      if (addressForm.zip?.trim()) shopifyAddressInput.zip = addressForm.zip.trim();
      if (addressForm.phoneNumber?.trim()) shopifyAddressInput.phoneNumber = addressForm.phoneNumber.trim();
      if (addressForm.territoryCode?.trim()) shopifyAddressInput.territoryCode = addressForm.territoryCode.trim();
      if (addressForm.zoneCode?.trim()) shopifyAddressInput.zoneCode = addressForm.zoneCode.trim();

      console.log('Creating address with:', shopifyAddressInput);

      const newAddress = await createCustomerAddress(shopifyAddressInput);

      if (newAddress) {
        setCustomerData((prev) => ({
          ...prev,
          addresses: [...prev.addresses, newAddress],
        }));
        setShowAddressForm(false);
        setAddressForm({});
        showMessage('Address created successfully!');
      }
    } catch (error: any) {
      console.error('Failed to create address:', error);
      showMessage(`Failed to create address: ${error.message}`, true);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    if (!editingAddressId) return;

    try {
      setAddressLoading(true);
      setError(null);
      setSuccess(null);

      // Validate form
      const validationErrors = validateAddressForm();
      if (validationErrors.length > 0) {
        showMessage(validationErrors.join(', '), true);
        return;
      }

      // Create the input using only valid CustomerAddressInput fields
      const shopifyAddressInput: CustomerAddressInput = {};

      if (addressForm.firstName?.trim()) shopifyAddressInput.firstName = addressForm.firstName.trim();
      if (addressForm.lastName?.trim()) shopifyAddressInput.lastName = addressForm.lastName.trim();
      if (addressForm.company?.trim()) shopifyAddressInput.company = addressForm.company.trim();
      if (addressForm.address1?.trim()) shopifyAddressInput.address1 = addressForm.address1.trim();
      if (addressForm.address2?.trim()) shopifyAddressInput.address2 = addressForm.address2.trim();
      if (addressForm.city?.trim()) shopifyAddressInput.city = addressForm.city.trim();
      if (addressForm.zip?.trim()) shopifyAddressInput.zip = addressForm.zip.trim();
      if (addressForm.phoneNumber?.trim()) shopifyAddressInput.phoneNumber = addressForm.phoneNumber.trim();
      if (addressForm.territoryCode?.trim()) shopifyAddressInput.territoryCode = addressForm.territoryCode.trim();
      if (addressForm.zoneCode?.trim()) shopifyAddressInput.zoneCode = addressForm.zoneCode.trim();

      console.log('Updating address with:', shopifyAddressInput);

      const updatedAddress = await updateCustomerAddress(editingAddressId, shopifyAddressInput);

      if (updatedAddress) {
        setCustomerData((prev) => ({
          ...prev,
          addresses: prev.addresses.map((addr) => (addr.id === editingAddressId ? updatedAddress : addr)),
        }));
        setEditingAddressId(null);
        setShowAddressForm(false);
        setAddressForm({});
        showMessage('Address updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update address:', error);
      showMessage(`Failed to update address: ${error.message}`, true);
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address: CustomerAddress) => {
    setEditingAddressId(address.id);
    setViewingAddressId(null);
    setAddressForm({
      firstName: address.firstName || '',
      lastName: address.lastName || '',
      company: address.company || '',
      address1: address.address1 || '',
      address2: address.address2 || '',
      city: address.city || '',
      zip: address.zip || '',
      phoneNumber: address.phoneNumber || '',
      territoryCode: address.country || '',
      zoneCode: address.province || '',
      provinceName: address.province || '',
      countryName: address.country || '',
    });
    setShowAddressForm(true);
  };

  const handleViewAddress = (address: CustomerAddress) => {
    setViewingAddressId(address.id);
    setEditingAddressId(null);
    setShowAddressForm(false);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);
      const success = await deleteCustomerAddress(addressId);
      if (success) {
        setCustomerData((prev) => ({
          ...prev,
          addresses: prev.addresses.filter((addr) => addr.id !== addressId),
        }));
        showMessage('Address deleted successfully!');
      }
    } catch (error: any) {
      console.error('Failed to delete address:', error);
      showMessage(`Failed to delete address: ${error.message}`, true);
    }
  };

  const handleEmailMarketingToggle = async (subscribe: boolean) => {
    try {
      setMarketingLoading(true);
      setError(null);
      setSuccess(null);

      console.log('Toggling email marketing to:', subscribe);

      const result = await toggleEmailMarketing(subscribe);

      if (result.success) {
        console.log('Email marketing toggled successfully:', result);

        // Update the local state immediately
        setCustomerData((prev) => ({
          ...prev,
          profile: prev.profile
            ? {
                ...prev.profile,
                emailAddress: {
                  ...prev.profile.emailAddress,
                  emailAddress: prev.profile.emailAddress?.emailAddress || '',
                  marketingState:
                    (result.marketingState as unknown as EmailMarketingState) ||
                    (subscribe ? EmailMarketingState.SUBSCRIBED : EmailMarketingState.UNSUBSCRIBED),
                },
              }
            : null,
        }));

        showMessage(`Email marketing ${subscribe ? 'enabled' : 'disabled'} successfully!`);
      } else {
        throw new Error('Failed to update email marketing preference');
      }
    } catch (error: any) {
      console.error('Failed to update email marketing preference:', error);
      showMessage(`Failed to update email marketing preference: ${error.message}`, true);
    } finally {
      setMarketingLoading(false);
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

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = e.target.value;
    const selectedCountry = countries.find((country) => country.code === selectedCode);

    setAddressForm((prev) => ({
      ...prev,
      territoryCode: selectedCode,
      countryName: selectedCountry?.name || '',
      // Clear province when country changes
      zoneCode: '',
      provinceName: '',
    }));
  };

  const resetAddressForm = () => {
    setShowAddressForm(false);
    setEditingAddressId(null);
    setViewingAddressId(null);
    setAddressForm({});
    setError(null);
    setSuccess(null);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              {profile.imageUrl && profile.imageUrl.length > 0 && (
                <div className="relative h-12 w-12  overflow-hidden">
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
                <div className="bg-green-50 border border-green-200  px-3 py-2">
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
                className="inline-flex items-center px-4 py-2 border border-gray-300  shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {(error || success) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className={`border  p-4 ${success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex">
              <AlertCircle className={`h-5 w-5 ${success ? 'text-green-400' : 'text-red-400'}`} />
              <div className="ml-3">
                <p className={`text-sm ${success ? 'text-green-700' : 'text-red-700'}`}>{success || error}</p>
              </div>
              <button
                onClick={() => {
                  setError(null);
                  setSuccess(null);
                }}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </button>
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
                  onClick={() => handleTabChange(item.id as TabType)}
                  className={`w-full text-left group  px-3 py-2 flex items-center text-sm font-medium ${
                    activeTab === item.id
                      ? 'bg-white text-primary border border-primary'
                      : 'text-text hover:text-white hover:bg-primary'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.count !== null && item.count > 0 && (
                    <span className="ml-auto bg-white text-primary  text-xs px-2 py-1">{item.count}</span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content area */}
          <div className="space-y-6 sm:px-6 lg:px-0 lg:col-span-9">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white shadow ">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                    <button
                      onClick={() => setEditingProfile(!editingProfile)}
                      disabled={profileUpdating}
                      className="inline-flex items-center px-3 py-2 border border-primary shadow-sm text-sm leading-4 font-medium  text-white bg-primary hover:bg-primary/90 disabled:opacity-50"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {editingProfile ? (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200  p-3 mb-4">
                        <p className="text-sm text-blue-700">
                          <strong>Note:</strong> Only name fields can be updated. Email and phone updates require
                          separate verification processes.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">First Name</label>
                          <input
                            type="text"
                            value={profileForm.firstName || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={profileUpdating}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Last Name</label>
                          <input
                            type="text"
                            value={profileForm.lastName || ''}
                            onChange={(e) => setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={profileUpdating}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditingProfile(false)}
                          disabled={profileUpdating}
                          className="px-4 py-2 border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleUpdateProfile}
                          disabled={profileUpdating}
                          className="px-4 py-2 bg-primary border border-transparent  text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 flex items-center"
                        >
                          {profileUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          {profileUpdating ? 'Saving...' : 'Save Changes'}
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
                        <dt className="text-sm font-medium text-gray-500 flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile.emailAddress?.emailAddress || 'Not provided'}
                        </dd>
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

                      {profile.tags && profile.tags.length > 0 && (
                        <div className="sm:col-span-2">
                          <dt className="text-sm font-medium text-gray-500">Tags</dt>
                          <dd className="mt-1">
                            <div className="flex flex-wrap gap-1">
                              {profile.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5  text-xs font-medium bg-red-100 text-primary-800"
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
              <div className="bg-white shadow ">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Shipping Addresses</h3>
                    <Button
                      onClick={() => {
                        setShowAddressForm(true);
                        setEditingAddressId(null);
                        setViewingAddressId(null);
                        setAddressForm({});
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  text-white bg-primary hover:bg-primary/90"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Address
                    </Button>
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="mb-6 p-4 border border-gray-200  bg-gray-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">
                          {editingAddressId ? 'Edit Address' : 'Add New Address'}
                        </h4>
                        <button onClick={resetAddressForm} className="text-gray-400 hover:text-gray-600">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            First Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addressForm.firstName || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, firstName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addressForm.lastName || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, lastName: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Company (Optional)</label>
                          <input
                            type="text"
                            value={addressForm.company || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, company: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Address Line 1 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addressForm.address1 || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, address1: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-sm font-medium text-gray-700">Address Line 2 (Optional)</label>
                          <input
                            type="text"
                            value={addressForm.address2 || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, address2: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            City <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addressForm.city || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
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
                                zoneCode: e.target.value,
                              }))
                            }
                            placeholder="e.g., California, Ontario"
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            ZIP/Postal Code <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={addressForm.zip || ''}
                            onChange={(e) => setAddressForm((prev) => ({ ...prev, zip: e.target.value }))}
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Country <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={addressForm.territoryCode || ''}
                            onChange={handleCountryChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm "
                            disabled={addressLoading}
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
                            className="mt-1 block w-full border-gray-300  shadow-sm focus:ring-primary focus:border-primary"
                            disabled={addressLoading}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={resetAddressForm}
                          disabled={addressLoading}
                          className="px-4 py-2 border border-gray-300  text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={editingAddressId ? handleUpdateAddress : handleCreateAddress}
                          disabled={addressLoading}
                          className="px-4 py-2 bg-primary border border-transparent  text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 flex items-center"
                        >
                          {addressLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                          {addressLoading ? 'Saving...' : editingAddressId ? 'Update Address' : 'Save Address'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Address Details View */}
                  {viewingAddressId && (
                    <div className="mb-6 p-4 border border-red-200  bg-red-50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-medium text-gray-900">Address Details</h4>
                        <button onClick={() => setViewingAddressId(null)} className="text-gray-400 hover:text-gray-600">
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                      {(() => {
                        const address = addresses.find((addr) => addr.id === viewingAddressId);
                        if (!address) return null;
                        return (
                          <div className="space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <dt className="text-sm font-medium text-gray-500">Name</dt>
                                <dd className="text-sm text-gray-900">
                                  {address.firstName} {address.lastName}
                                </dd>
                              </div>
                              {address.company && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Company</dt>
                                  <dd className="text-sm text-gray-900">{address.company}</dd>
                                </div>
                              )}
                              <div className="sm:col-span-2">
                                <dt className="text-sm font-medium text-gray-500">Address</dt>
                                <dd className="text-sm text-gray-900">
                                  <div>{address.address1}</div>
                                  {address.address2 && <div>{address.address2}</div>}
                                  <div>
                                    {address.city}, {address.province} {address.zip}
                                  </div>
                                  <div>{address.country}</div>
                                </dd>
                              </div>
                              {address.phoneNumber && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                                  <dd className="text-sm text-gray-900">{address.phoneNumber}</dd>
                                </div>
                              )}
                            </div>
                            <div className="flex justify-end space-x-3 pt-3 border-t border-red-200">
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="px-3 py-2 text-sm font-medium text-primary hover:text-red-500"
                              >
                                Edit Address
                              </button>
                            </div>
                          </div>
                        );
                      })()}
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
                        <div key={address.id} className="border border-gray-200  p-4 relative">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">
                              {address.firstName} {address.lastName}
                            </h4>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewAddress(address)}
                                className="text-green-600 hover:text-green-800 text-sm"
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEditAddress(address)}
                                className="text-green-600 hover:text-green-800 text-sm"
                                title="Edit"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAddress(address.id)}
                                className="text-red-600 hover:text-red-800 text-sm"
                                title="Delete"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
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
                            <div className="absolute bottom-2 left-2">
                              <span className="inline-flex items-center px-2 py-1  text-xs font-medium bg-red-100 text-primary">
                                <Star className="h-3 w-3 mr-1" />
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
              <div className="bg-white shadow ">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Order History</h3>

                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                      <p className="mt-1 text-sm text-gray-500">You haven&#39;t placed any orders yet.</p>
                      <Button
                        onClick={() => router.push('/products')}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium  text-white bg-primary hover:bg-primary/90"
                      >
                        Start Shopping
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200  p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium text-gray-900">Order #{order.name}</h4>
                              <p className="text-sm text-gray-500">Placed on {formatDate(order.processedAt)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(order.totalPrice.amount, order.totalPrice.currencyCode)}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5  text-xs font-medium ${
                                    order.financialStatus === 'PAID'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  <CreditCard className="h-3 w-3 mr-1" />
                                  {order.financialStatus}
                                </span>
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5  text-xs font-medium ${
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
                                      <div className="relative h-8 w-8  overflow-hidden">
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
                              className="inline-flex items-center text-sm font-medium text-primary hover:text-red-500"
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
              <div className="bg-white shadow ">
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
                        <div key={account.id} className="border border-gray-200  p-4">
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
              <div className="bg-white shadow ">
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
                          <div className="flex items-center space-x-2">
                            {marketingLoading && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                            <button
                              onClick={() =>
                                handleEmailMarketingToggle(
                                  profile.emailAddress?.marketingState !== EmailMarketingState.SUBSCRIBED
                                )
                              }
                              disabled={marketingLoading}
                              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer  border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                profile.emailAddress?.marketingState === EmailMarketingState.SUBSCRIBED
                                  ? 'bg-primary'
                                  : 'bg-gray-200'
                              } ${marketingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              <span className="sr-only">Toggle marketing emails</span>
                              <span
                                className={`pointer-events-none relative inline-block h-5 w-5 transform  bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                  profile.emailAddress?.marketingState === EmailMarketingState.SUBSCRIBED
                                    ? 'translate-x-5'
                                    : 'translate-x-0'
                                }`}
                              >
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                    profile.emailAddress?.marketingState === EmailMarketingState.SUBSCRIBED
                                      ? 'opacity-0 ease-out duration-100'
                                      : 'opacity-100 ease-in duration-200'
                                  }`}
                                >
                                  <X className="h-3 w-3 text-gray-400" />
                                </span>
                                <span
                                  className={`absolute inset-0 flex h-full w-full items-center justify-center transition-opacity ${
                                    profile.emailAddress?.marketingState === EmailMarketingState.SUBSCRIBED
                                      ? 'opacity-100 ease-in duration-200'
                                      : 'opacity-0 ease-out duration-100'
                                  }`}
                                >
                                  <Check className="h-3 w-3 text-blue-600" />
                                </span>
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">
                          Current status: {profile.emailAddress?.marketingState || 'Unknown'}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Account Actions</h4>
                      <div className="space-y-3">
                        <Button
                          onClick={() => loadCustomerData()}
                          disabled={dataLoading}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                        >
                          {dataLoading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Settings className="h-4 w-4 mr-2" />
                          )}
                          {dataLoading ? 'Refreshing...' : 'Refresh Account Data'}
                        </Button>
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

export default AccountContent;
