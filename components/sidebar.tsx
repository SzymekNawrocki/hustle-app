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
  Menu
} from "lucide-react";
import { removeToken } from "@/lib/auth";
import { useState } from "react";

import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Finance", href: "/finance", icon: Wallet },
  { name: "Health", href: "/health", icon: HeartPulse },
  { name: "Career", href: "/career", icon: Briefcase },
];

function SidebarNavContent({
  pathname,
  onClose,
  onLogout,
}: {
  pathname: string;
  onClose: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full bg-base-100 border-r border-base-300 p-4">
      <div className="flex items-center justify-between mb-8 px-2">
        <h1 className="text-xl font-display text-primary tracking-tight">Hustle App</h1>
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </Button>
      </div>

      <nav className="flex-1 space-y-2">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`flex cursor-pointer items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 font-display text-sm ${
                isActive
                  ? "bg-primary text-primary-content shadow-[0_0_20px_rgba(123,46,255,0.3)] ring-1 ring-white/20"
                  : "text-base-content/60 hover:bg-white/5 hover:text-base-content"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-4 border-t border-base-300">
        <Button
          onClick={onLogout}
          variant="ghost"
          className="w-full justify-start gap-4 font-display text-xs text-error hover:bg-error/10 rounded-2xl border border-white/5"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0">
        <SidebarNavContent
          pathname={pathname}
          onClose={() => setIsOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 cursor-pointer bg-base-neutral/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-base-100 shadow-2xl border-r border-base-300">
            <SidebarNavContent
              pathname={pathname}
              onClose={() => setIsOpen(false)}
              onLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </>
  );
}
