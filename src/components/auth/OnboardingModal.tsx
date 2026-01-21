import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { useAuth } from '../../contexts/AuthContext';

interface OnboardingModalProps {
  isOpen: boolean;
}

export function OnboardingModal({ isOpen }: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updatePlayerName } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      await updatePlayerName(name.trim());
    } finally {
      setIsSubmitting(false);
    }
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
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header with football theme */}
              <div className="px-6 py-8 text-center bg-gradient-to-r from-green-700/30 to-yellow-500/20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🏈
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome to the Team!
                </h2>
                <p className="text-gray-400">
                  What should we call you, quarterback?
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    autoFocus
                    className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/50 text-lg"
                    required
                    minLength={2}
                    maxLength={30}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    This will be displayed on your dashboard
                  </p>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting || !name.trim()}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Getting Ready...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Let's Go!
                      <span className="text-xl">🎯</span>
                    </span>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
