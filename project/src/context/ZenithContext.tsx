import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { scheduleReducer, initialScheduleState } from '../reducers/scheduleReducer';
import { ActivityType, ScheduleState, ScheduleAction, TimeBlock, Activity } from '../types';

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

const ZenithContext = createContext<ZenithContextType | undefined>(undefined);

export const ZenithProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(scheduleReducer, initialScheduleState, () => {
    // Load state from localStorage if available
    const savedState = localStorage.getItem('zenithState');
    return savedState ? JSON.parse(savedState) : initialScheduleState;
  });

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('zenithState', JSON.stringify(state));
  }, [state]);

  // Helper functions for common operations
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

  // Calculate metrics
  const calculateProductivity = (): number => {
    const totalTime = 7 * 24; // Total hours in a week
    const occupiedTime = getTotalOccupiedTime();
    const productiveActivities = state.activities.filter(a => 
      a.type === 'academic' || a.type === 'study' || a.type === 'exercise'
    );
    
    const productiveTime = productiveActivities.reduce((total, activity) => 
      total + activity.duration, 0
    );
    
    // Calculate productivity as percentage of productive time in relation to available time
    const availableTime = totalTime - (8 * 7); // Subtract sleeping time (8 hours per day)
    return Math.min(Math.round((productiveTime / availableTime) * 100), 100);
  };

  const getActivityDuration = (type: ActivityType): number => {
    return state.activities
      .filter(activity => activity.type === type)
      .reduce((total, activity) => total + activity.duration, 0);
  };

  const getTotalFreeTime = (): number => {
    // Calculate total free time by subtracting occupied blocks from total time
    const totalWeeklyHours = 7 * 24;
    return totalWeeklyHours - getTotalOccupiedTime();
  };

  const getTotalOccupiedTime = (): number => {
    // Sum all occupied time blocks
    return state.timeBlocks.reduce((total, block) => {
      if (block.type === 'occupied') {
        // Calculate duration in hours
        const startHour = parseInt(block.startTime.split(':')[0]);
        const startMinute = parseInt(block.startTime.split(':')[1]);
        const endHour = parseInt(block.endTime.split(':')[0]);
        const endMinute = parseInt(block.endTime.split(':')[1]);
        
        let duration = endHour - startHour;
        if (endMinute < startMinute) {
          duration -= 1;
          duration += (endMinute + 60 - startMinute) / 60;
        } else {
          duration += (endMinute - startMinute) / 60;
        }
        
        return total + duration;
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

export const useZenith = (): ZenithContextType => {
  const context = useContext(ZenithContext);
  if (context === undefined) {
    throw new Error('useZenith must be used within a ZenithProvider');
  }
  return context;
};