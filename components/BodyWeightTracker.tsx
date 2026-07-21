"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BodyWeightEntry } from "@/lib/types";

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BodyWeightTracker({
  initialEntries,
}: {
  initialEntries: BodyWeightEntry[];
}) {
  const [entries, setEntries] = useState<BodyWeightEntry[]>(initialEntries);
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!weight) {
      setError("Enter your body weight.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Session expired — please sign in again.");
      setSaving(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from("body_weight")
      .insert({
        user_id: user.id,
        weight: Number(weight),
        unit,
        logged_at: date,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setEntries((prev) =>
      [data as BodyWeightEntry, ...prev].sort(
        (a, b) => new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
      )
    );
    setWeight("");
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("body_weight").delete().eq("id", id);
    setDeletingId(null);
    if (!error) setEntries((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div className="bg-surface rounded-card border border-white/5 p-5">
      <h2 className="font-display tracking-wide text-chalk mb-4">
        WEEKLY BODY WEIGHT
      </h2>

      <form onSubmit={handleAdd} className="flex flex-wrap items-end gap-3 mb-5">
        <div>
          <label className="text-xs text-mute uppercase tracking-wide">Weight</label>
          <div className="mt-1 flex">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-28 bg-surface2 border border-white/10 rounded-l-card px-3 py-2.5 text-sm text-chalk tabular placeholder:text-mute/50 outline-none focus:border-brass/60"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as "kg" | "lb")}
              className="bg-surface2 border border-l-0 border-white/10 rounded-r-card px-2 text-sm text-mute outline-none focus:border-brass/60"
            >
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-mute uppercase tracking-wide">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 bg-surface2 border border-white/10 rounded-card px-3 py-2.5 text-sm text-chalk tabular outline-none focus:border-brass/60"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-brass text-graphite font-semibold text-sm rounded-card px-4 py-2.5 hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add weight"}
        </button>
      </form>

      {error && <p className="text-sm text-plateRed mb-3">{error}</p>}

      {entries.length === 0 ? (
        <p className="text-sm text-mute">No body weight logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-mute uppercase tracking-wide border-b border-white/5">
                <th className="py-2 font-medium">Date</th>
                <th className="py-2 font-medium tabular">Weight</th>
                <th className="py-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id} className="border-b border-white/5 last:border-0">
                  <td className="py-2 text-mute tabular whitespace-nowrap">
                    {formatDate(e.logged_at)}
                  </td>
                  <td className="py-2 tabular text-chalk">
                    {e.weight} {e.unit}
                  </td>
                  <td className="py-2 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      disabled={deletingId === e.id}
                      className="text-xs text-mute hover:text-plateRed transition disabled:opacity-40"
                    >
                      {deletingId === e.id ? "…" : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}