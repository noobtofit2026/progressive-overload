export type WorkoutSet = {
  id: string;
  user_id: string;
  exercise: string;
  weight: number;
  unit: "kg" | "lb";
  reps: number;
  performed_at: string; // ISO date, e.g. "2026-07-20"
  created_at: string;
};
