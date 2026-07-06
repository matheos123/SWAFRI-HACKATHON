"use client";
import {
  Sword,
  Trophy,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  PersonStanding,
  X,
  Users,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { PlayerProfile, Tab } from "../types";

interface SidebarProps {
  profile: PlayerProfile;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({
  profile,
  isOpenMobile,
  setIsOpenMobile,
  onLogout,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { path: "/lobby", label: "Battle Lobby", icon: Sword },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/friends", label: "Squad Command", icon: Users },
    { path: "/profile", label: "Profile", icon: PersonStanding },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
    setIsOpenMobile(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070A12] border-r border-[#141C2F]/80 p-5 font-sans justify-between">
      <div>
        {/* Commander Profile Summary Box */}
        <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-gray-800/60">
          <div className="relative w-11 h-11 rounded-xl bg-linear-to-tr from-purple-500/20 to-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-5.5 h-5.5 text-indigo-400" />
            <div className="absolute inset-0 rounded-xl border border-indigo-500/10 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white tracking-widest uppercase">
              Commander
            </h4>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
              Rank:{" "}
              <span className="text-indigo-300 font-semibold">Diamond III</span>
            </p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleTabClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border font-medium text-xs uppercase tracking-widest text-left select-none relative group ${
                  isActive
                    ? "bg-linear-to-r from-purple-950/40 to-indigo-950/20 border-purple-500/50 text-purple-300 shadow-[inset_0_0_15px_rgba(168,85,247,0.15)]"
                    : "border-transparent text-gray-400 hover:text-white hover:bg-gray-900/40"
                }`}
              >
                {/* Active Neon Accent Left Bar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-0.75 bg-purple-400 rounded-r-full shadow-[0_0_8px_#c084fc]" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive
                      ? "text-purple-300"
                      : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions: Support & Logout */}
      <div className="space-y-1 pt-6 border-t border-gray-800/40">
        <button
          onClick={() =>
            alert(
              "Support terminal initialized. Raising secure smart-ticket...",
            )
          }
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-900/40 text-xs font-semibold tracking-wider uppercase transition-colors text-left"
        >
          <HelpCircle className="w-4 h-4 text-gray-500" />
          <span>Support</span>
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-lg text-rose-400/80 hover:text-rose-400 hover:bg-rose-950/10 text-xs font-semibold tracking-wider uppercase transition-colors text-left"
        >
          <LogOut className="w-4 h-4 text-rose-500/70" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Left Rail Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-69px)] sticky top-17.25 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Hamburger Toggle Trigger (Shown below navbar only on smaller devices) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="rounded-full bg-linear-to-r from-purple-600 to-indigo-600 p-3.5 text-white shadow-xl shadow-purple-500/25 border border-purple-400/20 active:scale-95 transition-transform"
        >
          {isOpenMobile ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      {isOpenMobile && (
        <div
          id="mobile-sidebar-drawer"
          className="lg:hidden fixed inset-0 z-30 flex"
        >
          {/* Backdrop */}
          <div
            onClick={() => setIsOpenMobile(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          {/* Drawer Body */}
          <div className="relative w-64 max-w-sm h-full flex flex-col z-40 animate-slide-right shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
