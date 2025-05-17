import React from 'react';
import { TimeBlock, DayOfWeek, ActivityType } from '../types';
import { Clock } from 'lucide-react';

interface TimeTableProps {
  timeBlocks: TimeBlock[];
  showFreeSlots?: boolean;
  startHour?: number;
  endHour?: number;
  onSlotClick?: (day: DayOfWeek, hour: number) => void;
}

const TimeTable: React.FC<TimeTableProps> = ({
  timeBlocks,
  showFreeSlots = true,
  startHour = 5,
  endHour = 22,
  onSlotClick
}) => {
  const days: DayOfWeek[] = [
    'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'
  ];

  const dayTranslations: Record<DayOfWeek, string> = {
    lunes: 'Lunes',
    martes: 'Martes',
    miércoles: 'Miércoles',
    jueves: 'Jueves',
    viernes: 'Viernes',
    sábado: 'Sábado',
    domingo: 'Domingo'
  };

  const hours = Array.from(
    { length: endHour - startHour },
    (_, i) => startHour + i
  );

  const formatHour = (hour: number): string => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  const getActivityColor = (type: string): string => {
    const colors: Record<string, string> = {
      academic: 'bg-primary-100 border-primary-300 text-primary-800',
      study: 'bg-secondary-100 border-secondary-300 text-secondary-800',
      exercise: 'bg-success-100 border-success-300 text-success-800',
      rest: 'bg-accent-100 border-accent-300 text-accent-800',
      social: 'bg-warning-100 border-warning-300 text-warning-800',
      free: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      occupied: 'bg-neutral-100 border-neutral-300 text-neutral-800'
    };
    return colors[type] || colors.occupied;
  };

  const isSlotOccupied = (day: DayOfWeek, hour: number): TimeBlock | undefined => {
    return timeBlocks.find(block => {
      const start = parseInt(block.startTime.split(':')[0]);
      const end = parseInt(block.endTime.split(':')[0]);
      return block.day === day && hour >= start && hour < end;
    });
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Cabecera con días */}
        <div className="grid grid-cols-8 gap-1 mb-1">
          <div className="h-12 flex items-center justify-center bg-neutral-100 rounded-md">
            <Clock size={20} className="text-neutral-500" />
          </div>
          {days.map(day => (
            <div 
              key={day}
              className="h-12 flex items-center justify-center bg-neutral-100 rounded-md font-medium"
            >
              {dayTranslations[day]}
            </div>
          ))}
        </div>

        {/* Horario */}
        <div className="space-y-1">
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1">
              {/* Hora */}
              <div className="h-16 flex items-center justify-center text-sm text-neutral-600">
                {formatHour(hour)}
              </div>

              {/* Celdas por día */}
              {days.map(day => {
                const block = isSlotOccupied(day, hour);
                const isFree = !block && showFreeSlots;

                return (
                  <div
                    key={`${day}-${hour}`}
                    className={`h-16 border rounded-md transition-all cursor-pointer hover:opacity-80
                      ${block ? getActivityColor(block.type) : 
                        isFree ? 'bg-emerald-50 border-emerald-200' : 'bg-neutral-50 border-neutral-100'}`}
                    onClick={() => onSlotClick?.(day, hour)}
                    title={block ? `${block.title}\n${block.startTime} - ${block.endTime}${block.location ? `\n${block.location}` : ''}` : 
                      isFree ? 'Espacio disponible' : ''}
                  >
                    {block && (
                      <div className="p-2 h-full flex flex-col">
                        <div className="font-medium text-sm truncate">{block.title}</div>
                        <div className="text-xs mt-auto flex items-center gap-1">
                          <Clock size={12} />
                          <span>{block.startTime} - {block.endTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTable;
