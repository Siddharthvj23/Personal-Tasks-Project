
import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { Layout } from '@/components/Layout';
import { TaskListView } from '@/components/views/TaskListView';
import { TimerView } from '@/components/views/TimerView';
import { StatisticsView } from '@/components/views/StatisticsView';

function AppContent() {
  const { state } = useApp();

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'tasks':
        return <TaskListView />;
      case 'timer':
        return <TimerView />;
      case 'statistics':
        return <StatisticsView />;
      default:
        return <TaskListView />;
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        {renderCurrentView()}
      </div>
    </Layout>
  );
}

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
