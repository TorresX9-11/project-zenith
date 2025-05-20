import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { scheduleReducer, initialScheduleState } from '../reducers/scheduleReducer';
import { ActivityType, ScheduleState, ScheduleAction, TimeBlock, Activity } from '../types';
import { getTotalActivityDuration } from '../utils/activityUtils';

interface ZenithContextType {
  state: ScheduleState;
  dispatch: React.Dispatch<ScheduleAction>;
  addActivity: (activity: Activity) => void;
  removeActivity: (id: string) => void;
  updateActivity: (activity: Activity) => void;
  addTimeBlock: (timeBlock: TimeBlock) => void;
  removeTimeBlock: (id: string) => void;
  updateTimeBlock: (timeBlock: TimeBlock) => void;
  calculateProductivity: () => number;
  getActivityDuration: (type: ActivityType) => number;
  getTotalFreeTime: () => number;
  getTotalOccupiedTime: () => number;
}

export const ZenithContext = createContext<ZenithContextType | undefined>(undefined);

export const ZenithProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialScheduleState, () => {
    const savedState = localStorage.getItem('zenithState');
    return savedState ? JSON.parse(savedState) : initialScheduleState;
  });

  useEffect(() => {
    localStorage.setItem('zenithState', JSON.stringify(state));
  }, [state]);

  const addActivity = (activity: Activity) => {
    dispatch({ type: 'ADD_ACTIVITY', payload: activity });
  };

  const removeActivity = (id: string) => {
    dispatch({ type: 'REMOVE_ACTIVITY', payload: id });
  };

  const updateActivity = (activity: Activity) => {
    dispatch({ type: 'UPDATE_ACTIVITY', payload: activity });
  };

  const addTimeBlock = (timeBlock: TimeBlock) => {
    dispatch({ type: 'ADD_TIME_BLOCK', payload: timeBlock });
  };

  const removeTimeBlock = (id: string) => {
    dispatch({ type: 'REMOVE_TIME_BLOCK', payload: id });
  };

  const updateTimeBlock = (timeBlock: TimeBlock) => {
    dispatch({ type: 'UPDATE_TIME_BLOCK', payload: timeBlock });
  };

  const calculateProductivity = (): number => {
    const productiveTime = state.timeBlocks.reduce((total, block) => {
      if (block.type === 'occupied' && 
          block.activityType && 
          ['academic', 'work', 'study', 'exercise', 'rest'].includes(block.activityType)) {
        const [startHour, startMinute] = block.startTime.split(':').map(Number);
        const [endHour, endMinute] = block.endTime.split(':').map(Number);
        
        const start = startHour + (startMinute / 60);
        const end = endHour + (endMinute / 60);
        
        if (end < start) return total;
        
        return total + (end - start);
      }
      return total;
    }, 0);

    const dailyAvailableHours = 16;
    const weeklyAvailableHours = dailyAvailableHours * 7;
    
    return Math.min(Math.round((productiveTime / weeklyAvailableHours) * 100), 100);
  };

  const getActivityDuration = (type: ActivityType): number => {
    return getTotalActivityDuration(state.activities, state.timeBlocks, type);
  };

  const getTotalFreeTime = (): number => {
    const totalWeeklyHours = 7 * 24;
    const occupiedTime = getTotalOccupiedTime();
    return Math.max(0, totalWeeklyHours - occupiedTime);
  };

  const getTotalOccupiedTime = (): number => {
    return state.timeBlocks.reduce((total, block) => {
      if (block.type === 'occupied') {
        const [startHour, startMinute] = block.startTime.split(':').map(Number);
        const [endHour, endMinute] = block.endTime.split(':').map(Number);
        
        const start = startHour + (startMinute / 60);
        const end = endHour + (endMinute / 60);
        
        if (end < start) {
          return total;
        }
        
        return total + (end - start);
      }
      return total;
    }, 0);
  };

  return (
    <ZenithContext.Provider value={{
      state,
      dispatch,
      addActivity,
      removeActivity,
      updateActivity,
      addTimeBlock,
      removeTimeBlock,
      updateTimeBlock,
      calculateProductivity,
      getActivityDuration,
      getTotalFreeTime,
      getTotalOccupiedTime
    }}>
      {children}
    </ZenithContext.Provider>
  );
};
