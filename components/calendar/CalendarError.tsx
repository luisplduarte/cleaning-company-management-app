interface CalendarErrorProps {
  message?: string;
  onRetry: () => void;
}

const CalendarError = ({ 
  message = "Failed to load calendar events", 
  onRetry 
}: CalendarErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white border rounded-lg shadow-sm p-6">
      <div className="text-red-500 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
      <button
        onClick={onRetry}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default CalendarError;
