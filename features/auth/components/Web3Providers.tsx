"use client";

export default function Web3Providers() {
  const wallets = [
    {
      name: "MetaMask",
      icon: (
        <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#e27625]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><path d="M3.3 7l8.7 5 8.7-5" stroke="white" strokeWidth="2" fill="none"></path><path d="M12 22V12" stroke="white" strokeWidth="2" fill="none"></path></svg>
        </div>
      ),
      onClick: () => console.log("Connecting MetaMask..."),
    },
    {
      name: "Connect Wallet",
      icon: (
        <div className="flex h-6 w-6 items-center justify-center rounded-[4px] bg-[#0052ff]">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
        </div>
      ),
      onClick: () => console.log("Connecting Coinbase..."),
    },
  ];

  return (
    <div className="space-y-2.5">
      {wallets.map((wallet) => (
        <button
          key={wallet.name}
          onClick={wallet.onClick}
          type="button"
          className="flex w-full items-center justify-between rounded-md border border-slate-800/60 bg-[#141926] px-4 py-3 text-sm font-medium text-slate-300 transition-all hover:bg-[#1a2030] hover:border-slate-700/80 group active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <span className="text-base filter drop-shadow-sm group-hover:scale-105 transition-transform">
              {wallet.icon}
            </span>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors tracking-wide">
              {wallet.name}
            </span>
          </div>
          <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
          </span>
        </button>
      ))}
    </div>
  );
}
