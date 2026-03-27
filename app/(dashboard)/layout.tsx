import { Sidebar } from "@/components/sidebar";
import { DemoBanner } from "@/components/demo-banner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-base-100">
      <DemoBanner />
      <Sidebar />
      <main className="flex-1 p-4 lg:p-8 pt-20 lg:pt-8 overflow-y-auto font-sans">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
