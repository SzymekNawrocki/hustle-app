export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-white tracking-tight">Witaj w HustleOS</h1>
        <p className="text-gray-400 mt-2 font-display text-[9px] tracking-wide">Oto podsumowanie Twoich postępów.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Aktywne Cele", value: "12", color: "text-blue-500" },
          { label: "Wysłane Aplikacje", value: "24", color: "text-cyan-500" },
          { label: "Wartość Portfela", value: "12,400 zł", color: "text-emerald-500" },
          { label: "Dzisiejsze Kalorie", value: "1,850 kcal", color: "text-orange-500" },
        ].map((stat) => (
          <div key={stat.label} className="bg-[#111114] border border-white/5 p-6 rounded-2xl">
            <p className="text-[10px] font-display text-gray-500 tracking-wider whitespace-nowrap">{stat.label}</p>
            <p className={`text-2xl font-display mt-2 ${stat.color} tracking-tighter`}>{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="h-96 bg-[#111114] border border-white/5 rounded-2xl flex items-center justify-center">
        <p className="text-gray-600 font-display text-xs">Nadchodzący wykres aktywności...</p>
      </div>
    </div>
  );
}
