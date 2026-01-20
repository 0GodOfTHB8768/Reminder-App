import type { ReactNode } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';

type NavItem = 'dashboard' | 'playbook' | 'calendar' | 'scan' | 'touchdowns' | 'add';

interface LayoutProps {
  children: ReactNode;
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
  onOpenTour?: () => void;
  onOpenAuth?: () => void;
  showHeader?: boolean;
}

export function Layout({ children, activeTab, onTabChange, onOpenTour, onOpenAuth, showHeader = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Navigation activeTab={activeTab} onTabChange={onTabChange} onOpenTour={onOpenTour} />

      {/* Main content area */}
      <main className="md:ml-20 pb-24 md:pb-6">
        {showHeader && <Header onOpenAuth={onOpenAuth} />}
        <div className="px-4 md:px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
