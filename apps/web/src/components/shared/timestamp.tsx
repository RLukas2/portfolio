import { format, formatDistanceToNow, isToday } from 'date-fns';
import { useEffect, useState } from 'react';

interface TimestampProps {
  datetime: string;
}

const INTERVAL_MS = 60_000 as const; // 1 minute

const Timestamp = ({ datetime }: TimestampProps) => {
  const date = new Date(datetime);
  const [formattedTimestamp, setFormattedTimestamp] = useState<string>(formatDistanceToNow(date, { addSuffix: true }));

  useEffect(() => {
    const interval = setInterval(() => {
      setFormattedTimestamp(formatDistanceToNow(new Date(datetime), { addSuffix: true }));
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, [datetime]);

  return (
    <div className="text-muted-foreground text-xs">
      {isToday(date) ? formattedTimestamp : format(date, 'dd MMM yyyy HH:mm')}
    </div>
  );
};

export default Timestamp;
