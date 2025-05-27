interface TableSkeletonProps {
  columns: number;
  rows: number;
}

export function TableSkeleton({ columns = 3, rows = 5 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          {/* Table header skeleton */}
          <div className="flex items-center pb-4 border-b">
            {[...Array(columns)].map((_, i) => (
              <div
                key={`header-${i}`}
                className="h-4 bg-gray-200 rounded w-1/4 first:ml-0 ml-4"
              ></div>
            ))}
          </div>
          
          {/* Table rows skeleton */}
          {[...Array(rows)].map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex items-center py-4 border-b">
              {[...Array(columns)].map((_, colIndex) => (
                <div
                  key={`cell-${rowIndex}-${colIndex}`}
                  className="h-4 bg-gray-200 rounded w-1/4 first:ml-0 ml-4"
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
