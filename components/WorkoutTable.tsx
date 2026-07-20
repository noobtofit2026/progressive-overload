"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WorkoutSet } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function WorkoutTable({
  sets,
  onDeleted,
}: {
  sets: WorkoutSet[];
  onDeleted: (id: string) => void;
}) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("sets").delete().eq("id", id);
    setDeletingId(null);
    if (!error) onDeleted(id);
  }

  if (sets.length === 0) {
    return (
      <div className="bg-surface rounded-card border border-white/5 p-8 text-center">
        <h3 className="font-display text-chalk tracking-wide">
          NO SETS LOGGED YET
        </h3>
        <p className="text-sm text-mute mt-2">
          Add your first set on the left — this is where your log builds up.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card border border-white/5 overflow-hidden">
      <div className="px-5 pt-5">
        <h2 className="font-display tracking-wide text-chalk">LOG</h2>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-mute uppercase tracking-wide border-b border-white/5">
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Exercise</th>
              <th className="px-5 py-3 font-medium tabular">Weight</th>
              <th className="px-5 py-3 font-medium tabular">Reps</th>
              <th className="px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {sets.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                <td className="px-5 py-3 text-mute tabular whitespace-nowrap">
                  {formatDate(s.performed_at)}
                </td>
                <td className="px-5 py-3 text-chalk">{s.exercise}</td>
                <td className="px-5 py-3 tabular text-chalk whitespace-nowrap">
                  {s.weight} {s.unit}
                </td>
                <td className="px-5 py-3 tabular text-chalk">{s.reps}</td>
                <td className="px-5 py-3 text-right">
                  <button
                    onClick={() => handleDelete(s.id)}
                    disabled={deletingId === s.id}
                    className="text-xs text-mute hover:text-plateRed transition disabled:opacity-40"
                  >
                    {deletingId === s.id ? "…" : "Remove"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
