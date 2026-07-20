"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { WorkoutSet } from "@/lib/types";

export default function ProgressChart({
  sets,
  exercise,
}: {
  sets: WorkoutSet[];
  exercise: string;
}) {
  const filtered = sets.filter((s) => s.exercise === exercise);

  // For each date, take the heaviest set logged that day — the number
  // that actually reflects whether the load went up.
  const byDate = new Map<string, { weight: number; unit: string; reps: number }>();
  for (const s of filtered) {
    const existing = byDate.get(s.performed_at);
    if (!existing || s.weight > existing.weight) {
      byDate.set(s.performed_at, { weight: s.weight, unit: s.unit, reps: s.reps });
    }
  }

  const data = Array.from(byDate.entries())
    .map(([date, v]) => ({ date, ...v }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (data.length < 2) {
    return (
      <p className="text-sm text-mute py-8 text-center">
        Log at least two sessions of {exercise || "this exercise"} to see a trend line.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid stroke="#33373b" strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fill: "#9CA3A8", fontSize: 11 }}
          tickFormatter={(d) =>
            new Date(d + "T00:00:00").toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })
          }
          axisLine={{ stroke: "#33373b" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#9CA3A8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={44}
        />
        <Tooltip
          contentStyle={{
            background: "#1F2225",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            fontSize: 12,
          }}
          labelStyle={{ color: "#9CA3A8" }}
          itemStyle={{ color: "#EDEAE3" }}
          formatter={(value: number, _name, item) => [
            `${value} ${item.payload.unit} × ${item.payload.reps}`,
            "Heaviest set",
          ]}
          labelFormatter={(d) =>
            new Date(d + "T00:00:00").toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          }
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#C9A227"
          strokeWidth={2.5}
          dot={{ fill: "#C9A227", r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
