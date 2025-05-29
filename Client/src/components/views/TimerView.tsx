import React, { useEffect, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Timer, Plus } from 'lucide-react';

export function TimerView() {
  const { state, dispatch } = useApp();
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state.activeTimer) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - state.activeTimer!.startTime.getTime()) / 1000);
        setCurrentTime(elapsed);
        dispatch({ type: 'UPDATE_TIMER_DURATION', payload: elapsed });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [state.activeTimer, dispatch]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeTask = state.activeTimer 
    ? state.tasks.find(task => task.id === state.activeTimer!.taskId)
    : null;

  const availableTasks = state.tasks.filter(task => !task.completed);

  const handleStopTimer = () => {
    dispatch({ type: 'STOP_TIMER' });
    setCurrentTime(0);
  };

  const handleStartTimer = (taskId: string) => {
    dispatch({ type: 'START_TIMER', payload: taskId });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Time Tracker
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Track time spent on your tasks
        </p>
      </div>

      {/* Active Timer */}
      {state.activeTimer && activeTask ? (
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Timer className="w-6 h-6 text-success-600" />
              <span>Active Timer</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                {activeTask.title}
              </h3>
              {activeTask.description && (
                <p className="text-slate-600 dark:text-slate-300">
                  {activeTask.description}
                </p>
              )}
            </div>

            <div className="bg-gradient-to-r from-success-50 to-blue-50 dark:from-success-900/20 dark:to-blue-900/20 rounded-lg p-8">
              <div className="text-6xl md:text-7xl font-mono font-bold text-slate-900 dark:text-white mb-4 animate-pulse-timer">
                {formatTime(currentTime)}
              </div>
              <Badge className="bg-success-500 text-white">
                Running
              </Badge>
            </div>

            <div className="flex justify-center space-x-4">
              <Button
                onClick={handleStopTimer}
                size="lg"
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700"
              >
                <Square className="w-5 h-5" />
                <span>Stop Timer</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* No Active Timer */
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle>No Active Timer</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-8">
              <Timer className="w-16 h-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-300">
                Select a task below to start tracking time
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Available Tasks */}
      {availableTasks.length > 0 && !state.activeTimer && (
        <Card>
          <CardHeader>
            <CardTitle>Available Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {task.description}
                      </p>
                    )}
                    {task.totalTime > 0 && (
                      <Badge variant="secondary" className="mt-2">
                        Total: {formatTime(task.totalTime)}
                      </Badge>
                    )}
                  </div>
                  <Button
                    onClick={() => handleStartTimer(task.id)}
                    className="flex items-center space-x-2 bg-success-600 hover:bg-success-700"
                  >
                    <Play className="w-4 h-4" />
                    <span>Start</span>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {availableTasks.length === 0 && (
        <Card className="mx-auto max-w-2xl">
          <CardContent className="text-center py-12">
            <Timer className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No available tasks
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Create some tasks first to start tracking time.
            </p>
            <Button
              onClick={() => dispatch({ type: 'SET_VIEW', payload: 'tasks' })}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Go to Tasks</span>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
