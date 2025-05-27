
import React, { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface TaskFormProps {
  editingTask?: any;
  onClose: () => void;
}

export function TaskForm({ editingTask, onClose }: TaskFormProps) {
  const { dispatch } = useApp();
  const [title, setTitle] = useState(editingTask?.title || '');
  const [description, setDescription] = useState(editingTask?.description || '');
  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; description?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Task title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Task title must be less than 100 characters';
    }

    if (description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      completed: false,
    };

    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { id: editingTask.id, updates: taskData },
      });
    } else {
      dispatch({
        type: 'ADD_TASK',
        payload: taskData,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
      <Card className="w-full max-w-lg animate-bounce-in">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {editingTask ? 'Edit Task' : 'Create New Task'}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="w-8 h-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Task Title *
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title..."
                className={errors.title ? 'border-red-500' : ''}
                autoFocus
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter task description..."
                rows={3}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
              )}
              <p className="text-sm text-slate-500 mt-1">
                {description.length}/500 characters
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button type="submit" className="flex-1 flex items-center justify-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>{editingTask ? 'Update Task' : 'Create Task'}</span>
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
