"use client";

import { WorkoutSet } from "@/lib/types";

const PLATE_COLORS = ["#C1443A", "#2E6E9E", "#D4A017", "#3F7D4F", "#8B5CF6", "#C9A227"];

export default function PRBadges({ sets }: { sets: WorkoutSet[] }) {
  const bestByExercise = new Map<string, { weight: number; unit: string; performed_at: string }>();

  for (const s of sets) {
    const existing = bestByExercise.get(s.exercise);
    if (!existing || s.weight > existing.weight) {
      bestByExercise.set(s.exercise, { weight: s.weight, unit: s.unit, performed_at: s.performed_at });
    }
  }

  const entries = Array.from(bestByExercise.entries())
    .sort((a, b) => b[1].performed_at.localeCompare(a[1].performed_at))
    .slice(0, 6);

  if (entries.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-4">
      {entries.map(([exercise, pr], i) => (
        <div key={exercise} className="flex flex-col items-center gap-2 w-20">
          <div
            className="w-16 h-16 rounded-full flex flex-col items-center justify-center border-4"
            style={{
              borderColor: PLATE_COLORS[i % PLATE_COLORS.length],
              background: "#1F2225",
            }}
            title={`Personal record: ${pr.weight}${pr.unit}`}
          >
            <span className="tabular text-chalk font-semibold text-sm leading-none">
              {pr.weight}
            </span>
            <span className="text-[10px] text-mute leading-none mt-0.5">{pr.unit}</span>
          </div>
          <span className="text-[11px] text-mute text-center leading-tight truncate w-full">
            {exercise}
          </span>
        </div>
      ))}
    </div>
  );
}
