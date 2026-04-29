"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const CATEGORY_COLORS: Record<string, string> = {
  OPLATY: "#ff4d4d",
  HUSTLE: "#7B2EFF",
  LIFESTYLE: "#00D4FF",
  INCOME: "#22c55e",
};

interface ChartItem {
  name: string;
  value: number;
}

export default function FinanceChart({ data }: { data: ChartItem[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={8}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CATEGORY_COLORS[entry.name]}
              className="cursor-pointer outline-none"
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "16px",
            fontSize: "10px",
            fontFamily: "inherit",
          }}
          itemStyle={{ color: "#fff", textTransform: "uppercase" }}
          cursor={{ fill: "transparent" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
