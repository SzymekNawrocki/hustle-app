"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface DayData {
  date: string;
  finance: number;
  health: number;
}

export default function ActivityChart({ data }: { data: DayData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorFinance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#7B2EFF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#7B2EFF" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
        <XAxis
          dataKey="date"
          axisLine={false}
          tickLine={false}
          tick={{ fill: "#374151", fontSize: 10, fontFamily: "var(--font-display)" }}
          dy={10}
        />
        <YAxis hide domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0D0D0D",
            border: "1px solid rgba(255,255,255,0.05)",
            borderRadius: "1rem",
            fontSize: "10px",
            fontFamily: "var(--font-display)",
            color: "#fff",
          }}
          itemStyle={{ color: "#fff" }}
        />
        <Area
          type="monotone"
          dataKey="finance"
          stroke="#7B2EFF"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorFinance)"
          name="Finance (PLN)"
        />
        <Area
          type="monotone"
          dataKey="health"
          stroke="#00D4FF"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorHealth)"
          name="Calories (kcal)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
