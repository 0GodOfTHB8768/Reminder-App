import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UserMenuProps {
  onSignInClick: () => void;
  onOpenSettings?: () => void;
}

export function UserMenu({ onSignInClick, onOpenSettings }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });

  // Update menu position when opened
  useEffect(() => {
    if (isMenuOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isMenuOpen]);

  if (!user) {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onSignInClick}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-400 text-gray-900 rounded-xl font-semibold text-sm shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-shadow"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
        <span className="hidden sm:inline">Sign In</span>
      </motion.button>
    );
  }

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center gap-2 p-1 pr-3 bg-white/10 border border-white/10 rounded-full hover:bg-white/15 transition-colors"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName || 'User'}
            className="w-8 h-8 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
            {(user.displayName || user.email || 'U')[0].toUpperCase()}
          </div>
        )}
        <span className="text-white text-sm font-medium hidden sm:inline max-w-[100px] truncate">
          {user.displayName || user.email?.split('@')[0]}
        </span>
        <svg className={`w-4 h-4 text-gray-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      {/* Dropdown Menu - Rendered via Portal */}
      {createPortal(
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-[100]"
                onClick={() => setIsMenuOpen(false)}
              />

              {/* Menu */}
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'fixed',
                  top: menuPosition.top,
                  right: menuPosition.right,
                }}
                className="w-72 bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-xl shadow-2xl z-[101] overflow-hidden"
              >
                {/* User Info */}
                <div className="px-4 py-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-12 h-12 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate text-base">
                        {user.displayName || 'Player'}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sync Status */}
                <div className="px-4 py-2 border-b border-white/10 bg-green-500/5">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-green-400">Synced to cloud</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-2">
                  {/* Settings */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenSettings?.();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-300 hover:text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </motion.button>

                  {/* Design Blog */}
                  <motion.a
                    href="https://siddharthg125.wixsite.com/designblog"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-gray-300 hover:text-white rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Design Blog
                  </motion.a>

                  {/* Divider */}
                  <div className="my-1 border-t border-white/10" />

                  {/* Sign Out */}
                  <motion.button
                    whileHover={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                    onClick={async () => {
                      setIsMenuOpen(false);
                      await logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left text-red-400 hover:text-red-300 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </motion.button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}
