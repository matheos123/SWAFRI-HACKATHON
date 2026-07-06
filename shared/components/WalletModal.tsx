import { motion, AnimatePresence } from "motion/react";
import { X, Wallet, ShieldAlert, Award, ArrowUpRight } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const WALLET_PROVIDERS = [
  {
    name: "MetaMask",
    icon: "🦊",
    description: "Connect to your MetaMask web browser extension",
    isInstalled: true,
  },
  {
    name: "Phantom",
    icon: "👻",
    description: "The Solana & Ethereum multichain friendly portal",
    isInstalled: true,
  },
  {
    name: "Coinbase Wallet",
    icon: "🔵",
    description: "Access your centralized Coinbase Web3 assets",
    isInstalled: false,
  },
  {
    name: "WalletConnect",
    icon: "🔗",
    description: "Scan QR code with your mobile crypto application",
    isInstalled: true,
  },
];

export default function WalletModal({
  isOpen,
  onClose,
  onConnect,
}: WalletModalProps) {
  const handleSelectProvider = (providerName: string) => {
    // Generate a cool mock ethereum address
    const randomHex =
      Math.random().toString(16).substring(2, 6) +
      "..." +
      Math.random().toString(16).substring(2, 6);
    const mockAddress = `0x${randomHex.toUpperCase()}`;

    // Trigger simulated connection flow
    setTimeout(() => {
      onConnect(mockAddress);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="wallet-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-cyan-500/30 bg-[#0E131F]/95 p-6 shadow-2xl shadow-cyan-500/10"
          >
            {/* Corner Decorative Tech Accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold font-sans tracking-wide text-white uppercase">
                  Connect Web3 Wallet
                </h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Info Message */}
            <div className="mb-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 p-3.5 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <p className="text-xs text-cyan-200/90 leading-relaxed">
                RPS Arena operates on standard smart contracts. By connecting
                your wallet, you will be able to claim achievements, log
                tournament scores, and stake $RPS tokens.
              </p>
            </div>

            {/* Providers List */}
            <div className="space-y-2.5">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  key={provider.name}
                  onClick={() => handleSelectProvider(provider.name)}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl border border-gray-800 hover:border-cyan-500/40 bg-[#141C2F]/50 hover:bg-[#1A253F]/60 transition-all duration-300 group text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
                      {provider.icon}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold text-white tracking-wide group-hover:text-cyan-300 transition-colors">
                        {provider.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-normal mt-0.5">
                        {provider.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!provider.isInstalled && (
                      <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase px-1.5 py-0.5 border border-amber-500/20 rounded bg-amber-500/5">
                        Cloud
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>
                </button>
              ))}
            </div>

            {/* Footer Sign */}
            <div className="mt-5 text-center">
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                Secured by Ethers.js & Cryptographic Signatures
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
