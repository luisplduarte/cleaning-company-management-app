import { Job, Worker } from '@prisma/client';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

type CalendarEventProps = {
  job: Job & {
    assignments: {
      worker: Worker;
    }[];
  };
  style: {
    top: string;
    height: string;
    left: string;
    width: string;
  };
};

const colors = [
  'bg-blue-100 border-blue-200 text-blue-700',
  'bg-green-100 border-green-200 text-green-700',
  'bg-purple-100 border-purple-200 text-purple-700',
  'bg-yellow-100 border-yellow-200 text-yellow-700',
  'bg-red-100 border-red-200 text-red-700',
];

const CalendarEvent = ({ job, style }: CalendarEventProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/jobs/${job.id}/edit`);
  };

  // Get color based on the first worker's ID (consistent color per worker)
  const colorIndex = 
    job.assignments.length > 0
      ? parseInt(job.assignments[0].worker.id.slice(-1), 16) % colors.length
      : 0;
  const colorClass = colors[colorIndex];

  return (
    <div
      className={`absolute p-2 rounded border ${colorClass} overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
      style={style}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <div className="font-medium truncate text-sm">{job.title}</div>
      <div className="text-xs truncate">
        {format(new Date(job.start_date), 'HH:mm')} - {format(new Date(job.end_date), 'HH:mm')}
      </div>
      {job.assignments.map((assignment) => (
        <div key={assignment.worker.id} className="text-xs truncate">
          {assignment.worker.name}
        </div>
      ))}
    </div>
  );
};

export default CalendarEvent;
