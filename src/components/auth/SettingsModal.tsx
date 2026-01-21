import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getThemesByConference } from '../../lib/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { user, playerName, updatePlayerName } = useAuth();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(playerName);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);

  const themesByConference = getThemesByConference();

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(playerName);
      setSaved(false);
      setShowThemePicker(false);
    }
  }, [isOpen, playerName]);

  const handleSaveName = async () => {
    if (!name.trim() || name.trim() === playerName) return;

    setIsSubmitting(true);
    try {
      await updatePlayerName(name.trim());
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName(playerName);
    onClose();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-green-700/20 to-yellow-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">Settings</h2>
                      <p className="text-sm text-gray-400">Manage your account</p>
                    </div>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Profile Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Profile</h3>

                  {/* Account Info */}
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl mb-4">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-14 h-14 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl">
                        {(user?.displayName || user?.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user?.displayName || 'Player'}</p>
                      <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Display Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Display Name
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50"
                        maxLength={30}
                      />
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSaveName}
                        disabled={isSubmitting || !name.trim() || name.trim() === playerName}
                        className="px-4 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saved ? (
                          <>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Saved
                          </>
                        ) : (
                          'Save'
                        )}
                      </motion.button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      This name will be shown on your dashboard
                    </p>
                  </div>
                </div>

                {/* Theme Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    Theme
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-yellow-500/20 text-yellow-400 rounded uppercase">Beta</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowThemePicker(true)}
                    className="w-full p-4 bg-white/5 rounded-xl flex items-center justify-between hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                      >
                        <span className="text-lg">🏈</span>
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium">{theme.city} {theme.name}</p>
                        <p className="text-gray-400 text-sm">{theme.conference} {theme.division}</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </div>

                {/* App Info Section */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">About</h3>
                  <div className="p-4 bg-white/5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">App Version</span>
                      <span className="text-white font-medium">1.0.0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-white/10 bg-black/20">
                <button
                  onClick={handleClose}
                  className="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/15 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>

          {/* Theme Picker Modal */}
          <AnimatePresence>
            {showThemePicker && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowThemePicker(false)}
                  className="fixed inset-0 bg-black/50 z-[202]"
                />
                <div className="fixed inset-0 flex items-center justify-center z-[203] p-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-2xl max-h-[80vh] bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                  >
                    {/* Theme Picker Header */}
                    <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-shrink-0">
                      <div>
                        <h3 className="text-lg font-bold text-white">Choose Your Team</h3>
                        <p className="text-sm text-gray-400">Select your favorite NFL team's colors</p>
                      </div>
                      <button
                        onClick={() => setShowThemePicker(false)}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Theme Grid */}
                    <div className="p-4 overflow-y-auto flex-1">
                      {(['AFC', 'NFC'] as const).map(conference => (
                        <div key={conference} className="mb-6">
                          <h4 className="text-sm font-bold text-gray-300 mb-3 px-2">{conference}</h4>
                          {(['East', 'North', 'South', 'West'] as const).map(division => (
                            <div key={division} className="mb-4">
                              <p className="text-xs text-gray-500 mb-2 px-2">{conference} {division}</p>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {themesByConference[conference][division].map(t => (
                                  <motion.button
                                    key={t.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => {
                                      setTheme(t.id);
                                      setShowThemePicker(false);
                                    }}
                                    className={`
                                      relative p-3 rounded-xl border transition-all text-left
                                      ${theme.id === t.id
                                        ? 'border-white/50 bg-white/10'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10'
                                      }
                                    `}
                                  >
                                    {/* Color preview */}
                                    <div
                                      className="w-full h-8 rounded-lg mb-2"
                                      style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})` }}
                                    />
                                    <p className="text-xs font-medium text-white truncate">{t.city}</p>
                                    <p className="text-xs text-gray-400 truncate">{t.name}</p>

                                    {/* Selected indicator */}
                                    {theme.id === t.id && (
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                      >
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </motion.div>
                                    )}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
