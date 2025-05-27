
import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalTime: number; // in seconds
}

export interface TimeEntry {
  id: string;
  taskId: string;
  startTime: Date;
  endTime: Date | null;
  duration: number; // in seconds
}

export interface AppState {
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: TimeEntry | null;
  currentView: 'tasks' | 'timer' | 'statistics';
  darkMode: boolean;
}

type AppAction =
  | { type: 'ADD_TASK'; payload: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'totalTime'> }
  | { type: 'UPDATE_TASK'; payload: { id: string; updates: Partial<Task> } }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'TOGGLE_TASK'; payload: string }
  | { type: 'START_TIMER'; payload: string }
  | { type: 'STOP_TIMER' }
  | { type: 'UPDATE_TIMER_DURATION'; payload: number }
  | { type: 'SET_VIEW'; payload: 'tasks' | 'timer' | 'statistics' }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'LOAD_STATE'; payload: AppState };

const initialState: AppState = {
  tasks: [],
  timeEntries: [],
  activeTimer: null,
  currentView: 'tasks',
  darkMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_TASK': {
      const newTask: Task = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date(),
        totalTime: 0,
      };
      return {
        ...state,
        tasks: [...state.tasks, newTask],
      };
    }
    
    case 'UPDATE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates, updatedAt: new Date() }
            : task
        ),
      };
    }
    
    case 'DELETE_TASK': {
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        timeEntries: state.timeEntries.filter(entry => entry.taskId !== action.payload),
        activeTimer: state.activeTimer?.taskId === action.payload ? null : state.activeTimer,
      };
    }
    
    case 'TOGGLE_TASK': {
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload
            ? { ...task, completed: !task.completed, updatedAt: new Date() }
            : task
        ),
      };
    }
    
    case 'START_TIMER': {
      if (state.activeTimer) {
        return state;
      }
      
      const newTimer: TimeEntry = {
        id: crypto.randomUUID(),
        taskId: action.payload,
        startTime: new Date(),
        endTime: null,
        duration: 0,
      };
      
      return {
        ...state,
        activeTimer: newTimer,
      };
    }
    
    case 'STOP_TIMER': {
      if (!state.activeTimer) {
        return state;
      }
      
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - state.activeTimer.startTime.getTime()) / 1000);
      
      const completedEntry: TimeEntry = {
        ...state.activeTimer,
        endTime,
        duration,
      };
      
      return {
        ...state,
        activeTimer: null,
        timeEntries: [...state.timeEntries, completedEntry],
        tasks: state.tasks.map(task =>
          task.id === state.activeTimer!.taskId
            ? { ...task, totalTime: task.totalTime + duration }
            : task
        ),
      };
    }
    
    case 'UPDATE_TIMER_DURATION': {
      if (!state.activeTimer) {
        return state;
      }
      
      return {
        ...state,
        activeTimer: {
          ...state.activeTimer,
          duration: action.payload,
        },
      };
    }
    
    case 'SET_VIEW': {
      return {
        ...state,
        currentView: action.payload,
      };
    }
    
    case 'TOGGLE_DARK_MODE': {
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    }
    
    case 'LOAD_STATE': {
      return action.payload;
    }
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('taskManagerState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.tasks = parsedState.tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
        parsedState.timeEntries = parsedState.timeEntries.map((entry: any) => ({
          ...entry,
          startTime: new Date(entry.startTime),
          endTime: entry.endTime ? new Date(entry.endTime) : null,
        }));
        if (parsedState.activeTimer) {
          parsedState.activeTimer.startTime = new Date(parsedState.activeTimer.startTime);
        }
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load state from localStorage:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('taskManagerState', JSON.stringify(state));
    
    // Apply dark mode class to document
    if (state.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
