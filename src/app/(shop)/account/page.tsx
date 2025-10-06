import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

import AccountContent from '@/app/_components/account/AccountContent';

/* eslint-disable @typescript-eslint/no-use-before-define */
function AccountLoading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-gray-600">Loading your account...</span>
      </div>
    </div>
  );
}
export default function AccountPage() {
  return (
    <Suspense fallback={<AccountLoading />}>
      <AccountContent />
    </Suspense>
  );
}
