import { useEffect, useState } from 'react';
import { differenceInMinutes, startOfDay } from 'date-fns';

const CurrentTimeIndicator = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Update every minute
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const dayStart = startOfDay(now);
  // Calculate position from start time (5 AM)
  const topMinutes = differenceInMinutes(now, dayStart) - (5 * 60); // Subtract 5 hours for grid start
  // Each hour slot is 64px (h-16 = 4rem = 64px)
  const top = Math.max(0, (topMinutes * 64) / 60); // Convert minutes to pixels, ensure not negative

  return (
    <div
      className="absolute left-0 right-0 flex items-center"
      style={{ top: `${top}px` }}
    >
      <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
      <div className="flex-1 h-px bg-red-500" />
    </div>
  );
};

export default CurrentTimeIndicator;
