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
    <div className="flex flex-col h-full bg-base-100 border-r border-base-300 p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <h2 className="text-2xl font-bold text-primary tracking-tight">HustleOS</h2>
        <button className="lg:hidden btn btn-ghost btn-sm btn-square" onClick={() => setIsOpen(false)}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 btn justify-start normal-case ${
                isActive 
                  ? "btn-primary shadow-lg" 
                  : "btn-ghost text-base-content/70 hover:text-base-content"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-base-300">
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-error w-full flex justify-start gap-3 normal-case"
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
          className="btn btn-primary btn-square shadow-lg"
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
          <div className="fixed inset-0 bg-base-neutral/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-2xl border-r border-base-300">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
