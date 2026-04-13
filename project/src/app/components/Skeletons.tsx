export function RestaurantCardSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-200" />
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2" />
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-20" />
          <div className="h-4 bg-gray-200 rounded w-16" />
        </div>
        <div className="mt-2 pt-2 border-t border-gray-100">
          <div className="h-3 bg-gray-200 rounded w-24" />
        </div>
      </div>
    </div>
  );
}

export function MenuItemSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
      <div className="flex gap-4 p-4">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="flex items-center justify-between">
            <div className="h-6 bg-gray-200 rounded w-16" />
            <div className="h-10 w-10 bg-gray-200 rounded-lg" />
          </div>
        </div>
        <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
      </div>
    </div>
  );
}
