
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, CheckSquare, Timer, BarChart3 } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { state, dispatch } = useApp();

  const navItems = [
    { id: 'tasks' as const, label: 'Tasks', icon: CheckSquare },
    { id: 'timer' as const, label: 'Timer', icon: Timer },
    { id: 'statistics' as const, label: 'Statistics', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                TaskFlow
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={state.currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              ))}
            </nav>

            {/* Dark mode toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
              className="w-9 h-9 p-0"
            >
              {state.darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700">
            <nav className="flex items-center justify-around py-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant={state.currentView === item.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: item.id })}
                  className="flex flex-col items-center space-y-1 h-auto py-2"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
}
