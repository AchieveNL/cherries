export default function CollectionNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Collection Not Found</h1>
          <p className="text-gray-600 mb-8">
            The collection you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <div className="space-x-4">
            <a
              href="/collections"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Collections
            </a>
            <a
              href="/"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
