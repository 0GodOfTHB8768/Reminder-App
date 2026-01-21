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
  onOpenSettings?: () => void;
  showHeader?: boolean;
}

export function Layout({ children, activeTab, onTabChange, onOpenTour, onOpenAuth, onOpenSettings, showHeader = true }: LayoutProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      <Navigation activeTab={activeTab} onTabChange={onTabChange} onOpenTour={onOpenTour} />

      {/* Main content area */}
      <main className="md:ml-20 pb-32 md:pb-6 flex-1">
        {showHeader && <Header onOpenAuth={onOpenAuth} onOpenSettings={onOpenSettings} />}
        <div className="px-4 md:px-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="md:ml-20 pb-28 md:pb-4 pt-8">
        <div className="px-4 md:px-6">
          <div className="border-t border-white/10 pt-4">
            <p className="text-center text-gray-500 text-sm">
              © {currentYear} Game Day Tracker. All rights reserved. Built by Siddharth Gumballi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
