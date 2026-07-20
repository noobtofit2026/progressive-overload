"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WorkoutSet } from "@/lib/types";

export default function AddSetForm({
  onAdded,
  knownExercises,
}: {
  onAdded: (s: WorkoutSet) => void;
  knownExercises: string[];
}) {
  const [exercise, setExercise] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [reps, setReps] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!exercise.trim() || !weight || !reps) {
      setError("Fill in exercise, weight, and reps.");
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
      .from("sets")
      .insert({
        user_id: user.id,
        exercise: exercise.trim(),
        weight: Number(weight),
        unit,
        reps: Number(reps),
        performed_at: date,
      })
      .select()
      .single();

    setSaving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onAdded(data as WorkoutSet);
    setWeight("");
    setReps("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface rounded-card border border-white/5 p-5 h-fit"
    >
      <h2 className="font-display tracking-wide text-chalk mb-4">LOG A SET</h2>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-mute uppercase tracking-wide">Exercise</label>
          <input
            list="exercise-options"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            placeholder="e.g. Back Squat"
            className="mt-1 w-full bg-surface2 border border-white/10 rounded-card px-3 py-2.5 text-sm text-chalk placeholder:text-mute/50 outline-none focus:border-brass/60"
          />
          <datalist id="exercise-options">
            {knownExercises.map((ex) => (
              <option key={ex} value={ex} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-mute uppercase tracking-wide">Weight</label>
            <div className="mt-1 flex">
              <input
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="100"
                className="w-full bg-surface2 border border-white/10 rounded-l-card px-3 py-2.5 text-sm text-chalk tabular placeholder:text-mute/50 outline-none focus:border-brass/60"
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
            <label className="text-xs text-mute uppercase tracking-wide">Reps</label>
            <input
              type="number"
              inputMode="numeric"
              min="0"
              value={reps}
              onChange={(e) => setReps(e.target.value)}
              placeholder="8"
              className="mt-1 w-full bg-surface2 border border-white/10 rounded-card px-3 py-2.5 text-sm text-chalk tabular placeholder:text-mute/50 outline-none focus:border-brass/60"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-mute uppercase tracking-wide">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full bg-surface2 border border-white/10 rounded-card px-3 py-2.5 text-sm text-chalk tabular outline-none focus:border-brass/60"
          />
        </div>

        {error && <p className="text-sm text-plateRed">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="mt-1 bg-brass text-graphite font-semibold text-sm rounded-card px-4 py-3 hover:brightness-110 transition disabled:opacity-50"
        >
          {saving ? "Saving…" : "Add set"}
        </button>
      </div>
    </form>
  );
}
