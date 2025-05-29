import React from 'react';
import { useApp, Task } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Edit, 
  Trash2, 
  Play, 
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const { state, dispatch } = useApp();

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const canStartTimer = !state.activeTimer && !task.completed;
  const isTimerActive = state.activeTimer?.taskId === task.id;

  return (
    <Card className={`transition-all duration-200 hover:shadow-lg ${
      task.completed ? 'opacity-75' : ''
    } ${isTimerActive ? 'ring-2 ring-success-500 shadow-lg' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                className="w-6 h-6 p-0"
              >
                {task.completed ? (
                  <CheckCircle className="w-5 h-5 text-success-500" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-400" />
                )}
              </Button>
              <h3 className={`font-medium text-sm ${
                task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-white'
              }`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 pl-9">
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-3 pl-9">
              {task.totalTime > 0 && (
                <Badge variant="secondary" className="text-xs flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(task.totalTime)}</span>
                </Badge>
              )}
              
              {task.completed && (
                <Badge className="text-xs bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300">
                  Completed
                </Badge>
              )}
              
              {isTimerActive && (
                <Badge className="text-xs bg-success-500 text-white animate-pulse-timer">
                  Timer Active
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            {canStartTimer && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dispatch({ type: 'START_TIMER', payload: task.id })}
                className="w-8 h-8 p-0 text-success-600 hover:text-success-700 hover:bg-success-50"
                title="Start timer"
              >
                <Play className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="w-8 h-8 p-0"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
              className="w-8 h-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
