"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { WorkoutSet } from "@/lib/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

function todayShortDay() {
  const idx = new Date().getDay(); // 0 = Sun
  const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return map[idx] as (typeof DAYS)[number];
}

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
  const [day, setDay] = useState<(typeof DAYS)[number]>(todayShortDay());
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

    // Max 10 rows per day for this user
    const { count, error: countError } = await supabase
      .from("sets")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("day_of_week", day);

    if (countError) {
      setError(countError.message);
      setSaving(false);
      return;
    }

    if ((count ?? 0) >= 10) {
      setError(`${day} already has 10 entries — remove one first.`);
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
        day_of_week: day,
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

        <div>
          <label className="text-xs text-mute uppercase tracking-wide">Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value as (typeof DAYS)[number])}
            className="mt-1 w-full bg-surface2 border border-white/10 rounded-card px-3 py-2.5 text-sm text-chalk outline-none focus:border-brass/60"
          >
            {DAYS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
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