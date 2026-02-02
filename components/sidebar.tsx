"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Target, 
  Briefcase, 
  Wallet, 
  HeartPulse, 
  LogOut, 
  X, 
  Menu,
  User
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Cele", href: "/goals", icon: Target },
  { name: "Kariera", href: "/career", icon: Briefcase },
  { name: "Finanse", href: "/finance", icon: Wallet },
  { name: "Zdrowie", href: "/health", icon: HeartPulse },
  { name: "Profil", href: "/profile", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-[#111114] border-r border-white/5 p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-xl font-bold text-white tracking-tight">HustleOS</h2>
        <button className="lg:hidden text-gray-400" onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-blue-600/10 text-blue-500 font-medium" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "group-hover:text-white"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Wyloguj się
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-[#111114] border border-white/5 rounded-lg text-white shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#111114] shadow-2xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
