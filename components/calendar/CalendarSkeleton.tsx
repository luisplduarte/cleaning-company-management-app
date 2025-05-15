const CalendarSkeleton = () => {
  const hours = Array.from({ length: 19 }, (_, i) => i + 5); // 5 AM to 11 PM
  const days = Array.from({ length: 7 });

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex items-center p-4 border-b">
        <div className="w-20 h-8 bg-gray-200 rounded-md" />
        <div className="flex items-center justify-center flex-1 space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="w-32 h-6 bg-gray-200 rounded" />
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-1 overflow-y-auto">
        {/* Time Column */}
        <div className="w-20 border-r flex-none">
          <div className="h-12 font-medium text-gray-400 flex items-center px-2">
            <div className="w-16 h-4 bg-gray-200 rounded" />
          </div>
          <div style={{ height: 'calc(19 * 4rem)' }}>
            {hours.map((hour) => (
              <div key={hour} className="h-16 relative">
                <div className="w-12 h-4 bg-gray-200 rounded absolute -top-2.5 px-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Days */}
        <div className="flex flex-1">
          {days.map((_, index) => (
            <div key={index} className="flex-1 border-r last:border-r-0">
              <div className="h-12 px-2 py-2 bg-white border-b">
                <div className="w-16 h-4 bg-gray-200 rounded mb-1" />
                <div className="w-8 h-6 bg-gray-200 rounded" />
              </div>
              <div className="relative" style={{ height: 'calc(19 * 4rem)' }}>
                <div className="absolute inset-0">
                  {hours.map((hour) => (
                    <div key={hour} className="h-16 border-b border-gray-100" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalendarSkeleton;
