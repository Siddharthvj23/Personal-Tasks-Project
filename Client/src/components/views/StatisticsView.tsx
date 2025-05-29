
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Clock, CheckSquare, TrendingUp, Calendar } from 'lucide-react';

export function StatisticsView() {
  const { state } = useApp();

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

  const formatHours = (seconds: number) => {
    return (seconds / 3600).toFixed(1);
  };

  // Calculate statistics
  const totalTasks = state.tasks.length;
  const completedTasks = state.tasks.filter(task => task.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalTime = state.tasks.reduce((sum, task) => sum + task.totalTime, 0);
  const averageTimePerTask = totalTasks > 0 ? Math.round(totalTime / totalTasks) : 0;

  // Prepare chart data
  const taskTimeData = state.tasks
    .filter(task => task.totalTime > 0)
    .sort((a, b) => b.totalTime - a.totalTime)
    .slice(0, 10)
    .map(task => ({
      name: task.title.length > 20 ? task.title.substring(0, 20) + '...' : task.title,
      time: parseFloat(formatHours(task.totalTime)),
      completed: task.completed
    }));

  const completionData = [
    { name: 'Completed', value: completedTasks, color: '#10B981' },
    { name: 'In Progress', value: totalTasks - completedTasks, color: '#3B82F6' }
  ];

  // Recent activity
  const recentEntries = state.timeEntries
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 5)
    .map(entry => {
      const task = state.tasks.find(t => t.id === entry.taskId);
      return {
        ...entry,
        taskTitle: task?.title || 'Unknown Task'
      };
    });

  if (totalTasks === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Statistics
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Your productivity insights
          </p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardContent className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No data available
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4">
              Create and work on some tasks to see your productivity statistics.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Statistics
        </h2>
        <p className="text-slate-600 dark:text-slate-300">
          Your productivity insights
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-success-100 dark:bg-success-900 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Completion Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Total Time</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatTime(totalTime)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Avg Time/Task</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{formatTime(averageTimePerTask)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time by Task Chart */}
        {taskTimeData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Time Spent by Task</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taskTimeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value}h`, 'Time']}
                    labelFormatter={(label) => `Task: ${label}`}
                  />
                  <Bar 
                    dataKey="time" 
                    fill="#3B82F6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Completion Rate Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value, percent }) => `${name}: ${value} (${percent.toFixed(0)}%)`}
                >
                  {completionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      {recentEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Time Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      {entry.taskTitle}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {new Date(entry.startTime).toLocaleDateString()} at{' '}
                      {new Date(entry.startTime).toLocaleTimeString()}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formatTime(entry.duration)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
