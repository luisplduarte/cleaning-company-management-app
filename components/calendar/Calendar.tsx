'use client';

import { useState, useEffect } from 'react';
import { Job, Worker } from '@prisma/client';
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns';
import { isSameDay, differenceInMinutes, startOfDay } from 'date-fns';
import CalendarEvent from './CalendarEvent';
import CalendarSkeleton from './CalendarSkeleton';
import CalendarError from './CalendarError';
import CurrentTimeIndicator from './CurrentTimeIndicator';

type ExtendedJob = Job & {
  assignments: {
    worker: Worker;
  }[];
};

type CalendarHeaderProps = {
  currentDate: Date;
  onTodayClick: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
};

const CalendarHeader = ({
  currentDate,
  onTodayClick,
  onPrevWeek,
  onNextWeek,
}: CalendarHeaderProps) => {
  const start = startOfWeek(currentDate, { weekStartsOn: 1 });
  const end = endOfWeek(currentDate, { weekStartsOn: 1 });

  return (
    <div className="flex items-center p-4 border-b">
      <button
        onClick={onTodayClick}
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
      >
        Today
      </button>
      <div className="flex items-center justify-center flex-1 space-x-4">
        <button
          onClick={onPrevWeek}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <h2 className="text-lg font-semibold">
          {format(start, 'MMM d')} – {format(end, 'MMM d, yyyy')}
        </h2>
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const TimeColumn = () => {
  const hours = Array.from({ length: 19 }, (_, i) => i + 5); // 5 AM to 11 PM

  return (
    <>
      <div className="h-12 font-medium text-gray-400 flex items-center px-2">
        {new Date().getTimezoneOffset() === 0 ? 'UTC+0' : 'UTC+1'}
      </div>
      <div style={{ height: 'calc(19 * 4rem)' }}>
        {hours.map((hour) => (
          <div key={hour} className="h-16 relative">
            <span className="text-sm text-gray-500 absolute -top-2.5 px-2">
              {format(new Date().setHours(hour, 0), 'HH:00')}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<ExtendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });

      const response = await fetch(
        `/api/jobs/calendar?start=${weekStart.toISOString()}&end=${weekEnd.toISOString()}`
      );
      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setJobs(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load calendar events');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentDate]);

  const getEventStyle = (job: ExtendedJob) => {
    // Parse dates and adjust for timezone
    // Create dates in local timezone
    const start = new Date(job.start_date);
    const end = new Date(job.end_date);
    const dayStart = startOfDay(start);
    
    // Calculate position and size
    const topMinutes = differenceInMinutes(start, dayStart) - (5 * 60); // Subtract 5 hours (start at 5 AM)
    const duration = differenceInMinutes(end, start);
    
    // Each hour slot is 64px (h-16 = 4rem = 64px)
    const top = Math.max(0, (topMinutes * 64) / 60); // Convert minutes to pixels, ensure not negative
    const height = (duration * 64) / 60; // Convert duration to pixels
    
    return {
      top: `${top}px`,
      height: `${height}px`,
      left: '4px',
      width: 'calc(100% - 8px)',
    };
  };

  const handleTodayClick = () => setCurrentDate(new Date());
  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1));
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1));

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addWeeks(startOfWeek(currentDate, { weekStartsOn: 1 }), 0).setDate(
      startOfWeek(currentDate, { weekStartsOn: 1 }).getDate() + i
    )
  );

  if (error) {
    return <CalendarError message={error} onRetry={() => fetchJobs()} />;
  }

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="flex flex-col h-full bg-white border rounded-lg shadow-sm">
      <CalendarHeader
        currentDate={currentDate}
        onTodayClick={handleTodayClick}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
      <div className="flex flex-1 overflow-y-auto">
        <div className="w-20 border-r flex-none">
          <TimeColumn />
        </div>
        <div className="flex flex-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="flex-1 border-r last:border-r-0"
            >
              <div className="sticky top-0 z-10 h-12 px-2 text-sm font-medium text-gray-500 bg-white border-b">
                <div className="text-sm">{format(day, 'EEE')}</div>
                <div className="text-xl font-semibold text-gray-900">
                  {format(day, 'd')}
                </div>
              </div>
              <div className="relative" style={{ height: 'calc(19 * 4rem)' }}>  {/* 19 slots * 4rem (h-16) */}
                <div className="absolute inset-0">
                  {Array.from({ length: 19 }, (_, i) => (
                    <div
                      key={i}
                      className="h-16 border-b border-gray-100"
                    />
                  ))}
                </div>
                {isSameDay(day, new Date()) && <CurrentTimeIndicator />}
                {jobs
                  .filter((job) => isSameDay(new Date(job.start_date), day))
                  .map((job) => (
                    <CalendarEvent
                      key={job.id}
                      job={job}
                      style={getEventStyle(job)}
                    />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
