"use client";
import {
  Sword,
  Trophy,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  PersonStanding,
  X,
  Users,
  ShieldAlert,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AuthUser } from "@/features/auth/api/auth.api";

interface SidebarProps {
  user: AuthUser;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  onLogout: () => void;
}

export default function Sidebar({
  user,
  isOpenMobile,
  setIsOpenMobile,
  onLogout,
}: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Uncommented and wired up the dynamic role check safely inside the map array
  const menuItems = [
    { path: "/lobby", label: "Battle Lobby", icon: Sword },
    { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { path: "/friends", label: "Squad Command", icon: Users },
    { path: "/profile", label: "Profile", icon: PersonStanding },
    { path: "/settings", label: "Settings", icon: Settings },
    ...(user.role === "ADMIN" ? [{ path: "/admin", label: "Admin Panel", icon: ShieldAlert }] : []),
  ];

  const handleTabClick = (path: string) => {
    router.push(path);
    setIsOpenMobile(false);
  };

  // Shared Sidebar Content Shell used for Desktop Rail and Tablet Slide Drawer
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070A12] border-r border-[#141C2F]/80 p-5 font-sans justify-between">
      <div>
        {/* User Profile Summary */}
        <div className="flex items-center gap-3.5 pb-6 mb-6 border-b border-gray-800/60">
          <div className="relative w-11 h-11 rounded-xl bg-linear-to-tr from-purple-500/20 to-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 text-sm font-mono font-bold text-indigo-300 uppercase">
            {user.username[0]}
            <div className="absolute inset-0 rounded-xl border border-indigo-500/10 animate-pulse" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-black text-white tracking-widest uppercase truncate">
              {user.username}
            </h4>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mt-0.5">
              <span className="text-indigo-300 font-semibold">
                {user.points.toLocaleString()} pts
              </span>
              {" · "}
              <span className={user.isActive ? "text-emerald-400" : "text-gray-500"}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 border border-transparent font-medium text-xs uppercase tracking-widest text-left select-none relative group ${
                  isActive
                    ? "bg-linear-to-r from-purple-950/40 to-indigo-950/20 border-purple-500/50 text-purple-300 shadow-[inset_0_0_15px_rgba(168,85,247,0.15)]"
                    : "text-gray-400 hover:text-white hover:bg-gray-900/40"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-0.75 bg-purple-400 rounded-r-full shadow-[0_0_8px_#c084fc]" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-105 ${
                    isActive ? "text-purple-300" : "text-gray-500 group-hover:text-gray-300"
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-1 pt-6 border-t border-gray-800/40">
        <button
          onClick={() => alert("Support terminal initialized. Raising secure smart-ticket...")}
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
      {/* ======================================================== */}
      {/* 1. DESKTOP VIEW: FIXED LEFT SIDEBAR RAIL (visible on lg+) */}
      {/* ======================================================== */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-69px)] sticky top-17.25 z-30">
        {sidebarContent}
      </aside>

      {/* ======================================================== */}
      {/* 2. TABLET VIEW: DRAWER TRIGGER & SIDE PANEL (md to lg)  */}
      {/* ======================================================== */}
      {/* Hidden completely on mobile (sm), shown only on intermediate md screens */}
      <div className="hidden md:block lg:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="rounded-full bg-linear-to-r from-purple-600 to-indigo-600 p-3.5 text-white shadow-xl shadow-purple-500/25 border border-purple-400/20 active:scale-95 transition-transform cursor-pointer"
        >
          {isOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {isOpenMobile && (
        <div id="mobile-sidebar-drawer" className="hidden md:flex lg:hidden fixed inset-0 z-30">
          <div onClick={() => setIsOpenMobile(false)} className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative w-64 max-w-sm h-full flex flex-col z-40 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. MOBILE VIEW: BOTTOM HUD TABS CONTROL BAR (below md)    */}
      {/* ======================================================== */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[#141C2F]/80 bg-[#070A12]/95 px-1.5 backdrop-blur-lg"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom), 0.35rem)" }}
      >
        <div className="relative grid grid-cols-5 items-end justify-between py-2 text-center">
          
          {/* Tab 1: Leaderboard */}
          <button
            onClick={() => router.push("/leaderboard")}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold font-sans uppercase tracking-[0.12em] ${
              pathname === "/leaderboard" ? "text-purple-400" : "text-gray-500"
            }`}
          >
            <Trophy className="w-5 h-5" />
            <span>Ranks</span>
          </button>

          {/* Tab 2: Squad Command / Friends */}
          <button
            onClick={() => router.push("/friends")}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold font-sans uppercase tracking-[0.12em] ${
              pathname === "/friends" ? "text-purple-400" : "text-gray-500"
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Squad</span>
          </button>

          {/* Central Elevated Tab 3: Core Battle Lobby Arena Link */}
          <div className="relative -top-4 flex justify-center">
            <button
              onClick={() => router.push("/lobby")}
              className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-white shadow-xl transform transition-all active:scale-95 sm:h-14 sm:w-14 ${
                pathname === "/lobby"
                  ? "bg-purple-600 border-purple-400 shadow-purple-500/30 scale-105"
                  : "bg-linear-to-b from-indigo-600 to-slate-900 border-indigo-500 shadow-indigo-500/10"
              }`}
            >
              <Sword className="h-5 w-5 transform -rotate-45 sm:h-6 sm:w-6" />
            </button>
          </div>

          {/* Tab 4: Profile */}
          <button
            onClick={() => router.push("/profile")}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold font-sans uppercase tracking-[0.12em] ${
              pathname === "/profile" ? "text-purple-400" : "text-gray-500"
            }`}
          >
            <PersonStanding className="w-5 h-5" />
            <span>Profile</span>
          </button>

          {/* Tab 5: Settings / Control Panel */}
          <button
            onClick={() => router.push("/settings")}
            className={`flex flex-col items-center gap-1 text-[9px] font-bold font-sans uppercase tracking-[0.12em] ${
              pathname === "/settings" ? "text-purple-400" : "text-gray-500"
            }`}
          >
            <Settings className="w-5 h-5" />
            <span>System</span>
          </button>

        </div>
      </div>
    </>
  );
}
