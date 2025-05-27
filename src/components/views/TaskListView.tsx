
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { Plus, Search, CheckSquare, Clock } from 'lucide-react';

export function TaskListView() {
  const { state } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredTasks = state.tasks
    .filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
                          (filter === 'active' && !task.completed) ||
                          (filter === 'completed' && task.completed);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by completion status first, then by creation date
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const completedCount = state.tasks.filter(task => task.completed).length;
  const totalTime = state.tasks.reduce((sum, task) => sum + task.totalTime, 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  const handleEditTask = (task: any) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{state.tasks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatTime(totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <CardTitle>Tasks</CardTitle>
            <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex space-x-2">
              {(['all', 'active', 'completed'] as const).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className="capitalize"
                >
                  {filterType}
                </Button>
              ))}
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {state.tasks.length === 0 ? 'No tasks yet' : 'No tasks found'}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-4">
                  {state.tasks.length === 0
                    ? 'Create your first task to get started with time tracking.'
                    : 'Try adjusting your search or filter criteria.'}
                </p>
                {state.tasks.length === 0 && (
                  <Button onClick={() => setShowForm(true)} className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create First Task</span>
                  </Button>
                )}
              </div>
            ) : (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          editingTask={editingTask}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}
