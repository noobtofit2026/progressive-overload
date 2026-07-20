"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WorkoutSet } from "@/lib/types";
import AddSetForm from "@/components/AddSetForm";
import WorkoutTable from "@/components/WorkoutTable";
import ProgressChart from "@/components/ProgressChart";
import PRBadges from "@/components/PRBadges";

export default function DashboardClient({
  initialSets,
  userEmail,
}: {
  initialSets: WorkoutSet[];
  userEmail: string;
}) {
  const [sets, setSets] = useState<WorkoutSet[]>(initialSets);
  const router = useRouter();

  const exercises = useMemo(() => {
    const names = Array.from(new Set(sets.map((s) => s.exercise)));
    return names.sort((a, b) => a.localeCompare(b));
  }, [sets]);

  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const activeExercise = selectedExercise || exercises[0] || "";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function handleAdded(newSet: WorkoutSet) {
    setSets((prev) => [newSet, ...prev]);
    setSelectedExercise(newSet.exercise);
  }

  function handleDeleted(id: string) {
    setSets((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <main className="min-h-screen px-6 pb-20">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between pt-8 pb-6">
          <span className="font-display text-xl tracking-widest text-chalk">
            NOOBTOFIT
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs text-mute hidden sm:inline">{userEmail}</span>
            <button
              onClick={handleSignOut}
              className="text-xs text-mute hover:text-chalk border border-white/10 rounded-card px-3 py-2 transition"
            >
              Sign out
            </button>
          </div>
        </header>

        <PRBadges sets={sets} />

        <div className="grid lg:grid-cols-[380px_1fr] gap-6 mt-6">
          <AddSetForm onAdded={handleAdded} knownExercises={exercises} />

          <div className="flex flex-col gap-6">
            {exercises.length > 0 && (
              <div className="bg-surface rounded-card border border-white/5 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display tracking-wide text-chalk">
                    PROGRESS
                  </h2>
                  <select
                    value={activeExercise}
                    onChange={(e) => setSelectedExercise(e.target.value)}
                    className="bg-surface2 border border-white/10 rounded-card px-3 py-2 text-sm text-chalk outline-none focus:border-brass/60"
                  >
                    {exercises.map((ex) => (
                      <option key={ex} value={ex}>
                        {ex}
                      </option>
                    ))}
                  </select>
                </div>
                <ProgressChart sets={sets} exercise={activeExercise} />
              </div>
            )}

            <WorkoutTable sets={sets} onDeleted={handleDeleted} />
          </div>
        </div>
      </div>
    </main>
  );
}
