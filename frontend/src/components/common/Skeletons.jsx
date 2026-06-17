// Skeleton for product card loading
export const SkeletonCard = () => (
  <div className="bg-white rounded-2xl p-3 shadow-sm">
    <div className="shimmer rounded-xl h-40 w-full mb-3" />
    <div className="shimmer h-4 rounded w-3/4 mb-2" />
    <div className="shimmer h-3 rounded w-1/2 mb-3" />
    <div className="flex items-center justify-between">
      <div className="shimmer h-5 rounded w-16" />
      <div className="shimmer h-8 rounded-xl w-20" />
    </div>
  </div>
);

// Skeleton for category card
export const SkeletonCategory = () => (
  <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
    <div className="shimmer w-14 h-14 rounded-full mx-auto mb-2" />
    <div className="shimmer h-3 rounded w-3/4 mx-auto" />
  </div>
);

// Skeleton for order card
export const SkeletonOrder = () => (
  <div className="bg-white rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between mb-3">
      <div className="shimmer h-4 w-32 rounded" />
      <div className="shimmer h-5 w-20 rounded-full" />
    </div>
    <div className="shimmer h-3 w-40 rounded mb-4" />
    <div className="flex gap-3 mb-4">
      <div className="shimmer w-12 h-12 rounded-xl" />
      <div className="shimmer w-12 h-12 rounded-xl" />
      <div className="shimmer w-12 h-12 rounded-xl" />
    </div>
    <div className="flex justify-between items-center">
      <div className="shimmer h-4 w-24 rounded" />
      <div className="shimmer h-8 w-24 rounded-xl" />
    </div>
  </div>
);
