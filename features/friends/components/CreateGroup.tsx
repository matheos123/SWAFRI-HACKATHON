import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, Globe, Camera, ArrowRight, Upload } from 'lucide-react';

interface CreateGroupViewProps {
  onInitialize: (groupName: string, privacy: 'Public' | 'Encrypted') => void;
  onCancel: () => void;
}

const INSIGNIA_OPTIONS = [
  { emoji: '🛡️', label: 'Shield' },
  { emoji: '🦅', label: 'Eagle' },
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🐺', label: 'Wolf' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💀', label: 'Reaper' }
];

export default function CreateGroupView({
  onInitialize,
  onCancel
}: CreateGroupViewProps) {
  const [callmask, setCallmask] = useState('');
  const [privacy, setPrivacy] = useState<'Public' | 'Encrypted'>('Public');
  const [selectedInsignia, setSelectedInsignia] = useState('🛡️');
  const [insigniaMenuOpen, setInsigniaMenuOpen] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!callmask.trim()) {
      setError('SQUAD CALLMASK DESIGNATION IS REQUIRED');
      return;
    }
    setError('');
    onInitialize(callmask.trim().toUpperCase(), privacy);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 px-4">
      <motion.div
        initial={{ scale: 0.97, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-[#090E1B] border border-[#141C2F] rounded-2xl p-6 sm:p-10 shadow-[0_0_50px_rgba(30,58,138,0.25)] relative overflow-hidden"
      >
        {/* Subtle decorative futuristic border bars */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-linear-to-r from-cyan-500/20 via-blue-500/50 to-purple-500/20" />

        <form onSubmit={handleSubmit} className="space-y-8 font-sans">
          
          {/* Top Shield Logo */}
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500/10 to-cyan-500/5 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
            >
              <Shield className="w-7 h-7" />
            </motion.div>
            <h2 className="mt-4 font-sans font-black text-2xl text-white tracking-[0.25em] uppercase">
              INITIALIZE COMBAT GROUP
            </h2>
            <p className="mt-1.5 text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
              TACTICAL UNIT REGISTRATION PROTOCOL
            </p>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            
            {/* Input: Group Callmask */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                <Globe className="w-3.5 h-3.5 text-cyan-500/60" />
                GROUP CALLMASK
              </label>
              <input
                type="text"
                maxLength={20}
                placeholder="ENTER UNIT DESIGNATION..."
                value={callmask}
                onChange={(e) => {
                  setCallmask(e.target.value);
                  if (error) setError('');
                }}
                className="w-full bg-[#050812] border border-[#141C2F] rounded-xl px-4 py-3.5 text-sm font-mono text-cyan-100 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all uppercase tracking-wider"
              />
              {error && (
                <p className="text-[10px] font-mono text-red-400 uppercase tracking-wide">
                  ⚠️ {error}
                </p>
              )}
            </div>

            {/* Protocol Row: Privacy & Insignia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Privacy Toggles */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  <Lock className="w-3.5 h-3.5 text-cyan-500/60" />
                  PRIVACY PROTOCOL
                </label>
                <div className="flex bg-[#050812] border border-[#141C2F] rounded-xl p-1.5 gap-1.5 h-[52px]">
                  <button
                    type="button"
                    onClick={() => setPrivacy('Public')}
                    className={`flex-1 rounded-lg text-xs font-bold font-mono tracking-wider transition-all ${
                      privacy === 'Public'
                        ? 'bg-[#10172A] text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    PUBLIC
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrivacy('Encrypted')}
                    className={`flex-1 rounded-lg text-xs font-bold font-mono tracking-wider transition-all ${
                      privacy === 'Encrypted'
                        ? 'bg-[#10172A] text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    ENCRYPTED
                  </button>
                </div>
                <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mt-1">
                  {privacy === 'Encrypted' 
                    ? 'Encrypted groups require an invitation link.' 
                    : 'Public groups can be searched and joined by any operative.'}
                </p>
              </div>

              {/* Group Insignia Icon */}
              <div className="space-y-2.5">
                <label className="flex items-center gap-2 text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  <Camera className="w-3.5 h-3.5 text-cyan-500/60" />
                  GROUP INSIGNIA
                </label>
                
                <div className="flex items-center gap-3">
                  {/* Big Icon Preview */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setInsigniaMenuOpen(!insigniaMenuOpen)}
                      className="w-[52px] h-[52px] bg-[#050812] border border-dashed border-[#141C2F] hover:border-cyan-500/40 rounded-xl flex items-center justify-center text-2xl transition-colors relative"
                    >
                      <span>{selectedInsignia}</span>
                    </button>

                    {/* Insignia Selection Dropdown */}
                    {insigniaMenuOpen && (
                      <div className="absolute top-14 left-0 z-20 bg-[#0A0F1D] border border-[#141C2F] rounded-xl p-2 grid grid-cols-3 gap-2 shadow-2xl w-40">
                        {INSIGNIA_OPTIONS.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => {
                              setSelectedInsignia(opt.emoji);
                              setInsigniaMenuOpen(false);
                            }}
                            title={opt.label}
                            className="w-10 h-10 rounded-lg hover:bg-cyan-500/10 flex items-center justify-center text-lg transition-colors border border-transparent hover:border-cyan-500/25"
                          >
                            {opt.emoji}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Upload Info/Button */}
                  <button
                    type="button"
                    onClick={() => {
                      // pick random insignia option
                      const randomOpt = INSIGNIA_OPTIONS[Math.floor(Math.random() * INSIGNIA_OPTIONS.length)];
                      setSelectedInsignia(randomOpt.emoji);
                      alert(`Mock combat metadata data parsed: Logo updated to ${randomOpt.label}!`);
                    }}
                    className="flex-1 bg-[#050812] hover:bg-gray-900/30 border border-[#141C2F] active:border-cyan-500/30 px-4 h-[52px] rounded-xl flex items-center justify-center gap-2 text-xs font-mono text-gray-400 uppercase tracking-wider transition-colors"
                  >
                    <Upload className="w-4 h-4 text-cyan-500/70" />
                    <span>UPLOAD DATA</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="space-y-3.5 pt-4">
            <button
              type="submit"
              className="w-full bg-linear-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 text-[#070A13] hover:text-white h-12 rounded-xl text-xs font-black font-mono tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:shadow-[0_0_35px_rgba(6,182,212,0.45)] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>INITIALIZE DEPLOYMENT</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full text-center text-[10px] font-mono text-gray-500 hover:text-gray-300 uppercase tracking-[0.2em] py-2.5 transition-colors border-t border-gray-900 mt-2"
            >
              CANCEL PROTOCOL
            </button>
          </div>

          {/* Card footer details matching screenshot 2 */}
          <div className="flex justify-between items-center text-[8px] font-mono text-gray-600 uppercase tracking-widest pt-2">
            <span>SYS_LOAD: 0.002ms</span>
            <span>RNG_SEED: AF923</span>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
