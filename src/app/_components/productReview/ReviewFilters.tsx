import { Filter } from 'lucide-react';

interface ReviewFiltersProps {
  filters: any;
  onFiltersChange: (filters: any) => void;
  stats?: any;
}
export function ReviewFilters({ filters, onFiltersChange, stats }: ReviewFiltersProps) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      page_size: 20,
      sort_by: 'created-descending',
      // Don't include is_store_review: 0 in the initial state
    });
  };

  return (
    <div className="bg-white  border p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rating Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
          <select
            value={filters.rating || ''}
            onChange={(e) => updateFilter('rating', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full text-sm border border-gray-200  px-2 py-1.5"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating !== 1 ? 's' : ''}
                {stats && ` (${stats.ratingDistribution[rating] || 0})`}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={filters.sortBy || 'created-descending'}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="w-full text-sm border border-gray-200  px-2 py-1.5"
          >
            <option value="created-descending">Newest first</option>
            <option value="created-ascending">Oldest first</option>
            <option value="rating-descending">Highest rated</option>
            <option value="rating-ascending">Lowest rated</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Per page</label>
          <select
            value={filters.page_size || '20'}
            onChange={(e) => updateFilter('page_size', parseInt(e.target.value))}
            className="w-full text-sm border border-gray-200  px-2 py-1.5"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Search reviews</label>
        <input
          type="text"
          placeholder="Search by content, title, or author..."
          value={filters.keyword || ''}
          onChange={(e) => updateFilter('keyword', e.target.value || undefined)}
          className="w-full text-sm border border-gray-200  px-3 py-1.5"
        />
      </div>

      {/* Store Review Toggle */}
      <div className="flex items-center space-x-3">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.is_store_review === 1}
            onChange={(e) => {
              // Only set is_store_review when checked, remove it when unchecked
              if (e.target.checked) {
                updateFilter('is_store_review', 1);
              } else {
                // Remove the filter entirely instead of setting to 0
                const newFilters = { ...filters };
                delete newFilters.is_store_review;
                onFiltersChange(newFilters);
              }
            }}
            className=" border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-gray-700">Store reviews only</span>
        </label>
      </div>

      {/* Active Filters */}
      {Object.keys(filters).some((key) => filters[key] !== undefined && filters[key] !== '') && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-600">Active filters:</span>
          {filters.rating && (
            <span className="inline-flex items-center px-2 py-1 bg-primary/20 text-primary text-xs ">
              {filters.rating} star
              <button onClick={() => updateFilter('rating', undefined)} className="ml-1 hover:text-primary">
                ×
              </button>
            </span>
          )}
          {filters.keyword && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs ">
              &ldquo;{filters.keyword}&ldquo;
              <button onClick={() => updateFilter('keyword', undefined)} className="ml-1 hover:text-blue-600">
                ×
              </button>
            </span>
          )}
          {filters.is_store_review === 1 && (
            <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs ">
              Store reviews
              <button onClick={() => updateFilter('is_store_review', undefined)} className="ml-1 hover:text-blue-600">
                ×
              </button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
