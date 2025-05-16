import { v4 as uuidv4 } from 'uuid';
import { ScheduleState, ScheduleAction, TimeBlock, Activity } from '../types';

export const initialScheduleState: ScheduleState = {
  timeBlocks: [],
  activities: [],
  settings: {
    studyTechniques: {
      pomodoro: true,
      feynman: false,
      spaced: false,
      conceptMapping: false
    },
    minimumSleepHours: 7,
    breakDuration: 15, // minutes
    maximumStudySession: 120, // minutes
  }
};

export const scheduleReducer = (state: ScheduleState, action: ScheduleAction): ScheduleState => {
  switch (action.type) {
    case 'ADD_TIME_BLOCK': {
      const newBlock: TimeBlock = {
        ...action.payload,
        id: action.payload.id || uuidv4()
      };
      return {
        ...state,
        timeBlocks: [...state.timeBlocks, newBlock]
      };
    }
    
    case 'REMOVE_TIME_BLOCK': {
      return {
        ...state,
        timeBlocks: state.timeBlocks.filter(block => block.id !== action.payload)
      };
    }
    
    case 'UPDATE_TIME_BLOCK': {
      return {
        ...state,
        timeBlocks: state.timeBlocks.map(block =>
          block.id === action.payload.id ? action.payload : block
        )
      };
    }
    
    case 'ADD_ACTIVITY': {
      const newActivity: Activity = {
        ...action.payload,
        id: action.payload.id || uuidv4()
      };
      return {
        ...state,
        activities: [...state.activities, newActivity]
      };
    }
    
    case 'REMOVE_ACTIVITY': {
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload)
      };
    }
    
    case 'UPDATE_ACTIVITY': {
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id ? action.payload : activity
        )
      };
    }
    
    case 'UPDATE_SETTINGS': {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };
    }
    
    case 'CLEAR_SCHEDULE': {
      return {
        ...initialScheduleState,
        settings: state.settings // Preserve user settings
      };
    }
    
    case 'IMPORT_SCHEDULE': {
      return {
        ...state,
        ...action.payload
      };
    }
    
    default:
      return state;
  }
};