import React from 'react';
import { CalendarCheck, Layers, CalendarDays, History, Settings } from 'lucide-react';
import type { AppTab } from '../types';

interface NavigationProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'today' as AppTab, label: 'Today', icon: CalendarCheck },
    { id: 'routines' as AppTab, label: 'Routines', icon: Layers },
    { id: 'schedule' as AppTab, label: 'Schedule', icon: CalendarDays },
    { id: 'history' as AppTab, label: 'History', icon: History },
    { id: 'settings' as AppTab, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bottom-nav" aria-label="Main Navigation">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`nav-btn-${tab.id}`}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            type="button"
          >
            <Icon className="nav-icon" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
