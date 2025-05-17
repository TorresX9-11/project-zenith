import React from 'react';
import { TimeBlock, DayOfWeek, ActivityType } from '../types';
import { Clock } from 'lucide-react';

interface TimeTableProps {
  timeBlocks: TimeBlock[];
  startHour?: number;
  endHour?: number;
  onSlotClick?: (day: DayOfWeek, hour: number) => void;
}

const TimeTable: React.FC<TimeTableProps> = ({
  timeBlocks,  startHour = 5,
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

  const getActivityColor = (type: string, activityType?: ActivityType): string => {
    if (activityType) {
      const colors: Record<ActivityType, string> = {
        academic: 'bg-primary-100 border-primary-300 text-primary-800',
        study: 'bg-secondary-100 border-secondary-300 text-secondary-800',
        exercise: 'bg-success-100 border-success-300 text-success-800',
        rest: 'bg-accent-100 border-accent-300 text-accent-800',
        social: 'bg-warning-100 border-warning-300 text-warning-800',
        personal: 'bg-neutral-100 border-neutral-300 text-neutral-800',
        other: 'bg-error-100 border-error-300 text-error-800'
      };
      return colors[activityType];
    }

    // Fallback para bloques sin tipo de actividad
    const blockColors: Record<string, string> = {
      free: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      occupied: 'bg-neutral-100 border-neutral-300 text-neutral-800'
    };
    return blockColors[type] || blockColors.occupied;
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
          {/* Bloques de hora */}
          {hours.map(hour => (
            <div key={hour} className="grid grid-cols-8 gap-1 h-16"> {/* Aumenté la altura para más contenido */}
              {/* Columna de hora */}
              <div className="flex items-center justify-center text-sm text-neutral-600">
                {formatHour(hour)}
              </div>
              
              {/* Celdas para cada día */}
              {days.map(day => {
                const slot = isSlotOccupied(day, hour);
                
                return (
                  <button
                    key={day}
                    onClick={() => onSlotClick?.(day, hour)}
                    className={`rounded-md border transition-colors relative overflow-hidden ${
                      slot
                        ? `${getActivityColor(slot.type, slot.activityType)} hover:opacity-90`
                        : 'bg-white border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {slot && (
                      <div className="absolute inset-0 p-2 flex flex-col justify-between h-full">
                        <div>
                          <div className="text-sm font-medium truncate">{slot.title}</div>
                          {slot.location && (
                            <div className="text-xs opacity-75 truncate flex items-center gap-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-current" />
                              {slot.location}
                            </div>
                          )}
                        </div>
                        <div className="text-xs opacity-75">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    )}
                  </button>
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
