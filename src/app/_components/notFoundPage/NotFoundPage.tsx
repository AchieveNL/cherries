'use client';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content */}
        <div className=" overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center">
              {/* 404 Illustration */}
              <div className="mb-8">
                <div className="relative">
                  <h1 className="text-9xl font-bungee font-bold text-primary select-none">404</h1>
                  <div className="absolute inset-0 flex items-center justify-center"></div>
                </div>
              </div>

              {/* Error Message */}
              <div className="mb-8">
                <h2 className="text-3xl font-bungee font-bold text-gray-900 mb-4">Oops! Page Not Found</h2>
                <p className="text-lg text-gray-600 mb-4">
                  The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
              </div>

              {/* Error Code */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">Error Code: 404 - Page Not Found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
