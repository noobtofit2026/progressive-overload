"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function PlateStack() {
  const plates = [
    { color: "#C1443A", w: 120 }, // 25kg red
    { color: "#2E6E9E", w: 100 }, // 20kg blue
    { color: "#D4A017", w: 82 },  // 15kg yellow
    { color: "#3F7D4F", w: 66 },  // 10kg green
  ];
  return (
    <svg viewBox="0 0 640 200" className="w-full max-w-xl" role="img" aria-label="Loaded barbell illustration">
      <line x1="20" y1="100" x2="620" y2="100" stroke="#4a4f54" strokeWidth="6" />
      {plates.map((p, i) => (
        <g key={i}>
          <rect
            x={70 + i * 24}
            y={100 - p.w / 2}
            width="16"
            height={p.w}
            rx="4"
            fill={p.color}
            className="origin-center"
            style={{
              animation: `drop 600ms ease-out ${i * 90}ms both`,
            }}
          />
          <rect
            x={620 - 70 - i * 24 - 16}
            y={100 - p.w / 2}
            width="16"
            height={p.w}
            rx="4"
            fill={p.color}
            style={{
              animation: `drop 600ms ease-out ${i * 90}ms both`,
            }}
          />
        </g>
      ))}
      <circle cx="320" cy="100" r="5" fill="#EDEAE3" opacity="0.5" />
      <style>{`
        @keyframes drop {
          from { transform: translateY(-14px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </svg>
  );
}

export default function LandingPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setErrorMsg(error.message);
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-6">
      <div className="w-full max-w-5xl">
        <header className="flex items-center justify-between pt-10 pb-6">
          <span className="font-display text-xl tracking-widest text-chalk">
            NOOBTOFIT
          </span>
          <span className="text-xs text-mute tracking-wide">
            LOG · TRACK · ADD WEIGHT
          </span>
        </header>

        <section className="flex flex-col items-center text-center pt-10 pb-8">
          <h1 className="font-display text-5xl sm:text-6xl tracking-wide text-chalk leading-[1.05]">
            EVERY SET.
            <br />
            <span className="text-brass">EVERY PLATE.</span>
          </h1>
          <p className="mt-5 max-w-md text-mute text-base">
            Log weight and reps per set, per exercise. NOOBTOFIT shows you
            exactly when it&rsquo;s time to add the next plate.
          </p>

          <div className="mt-10">
            <PlateStack />
          </div>

          <form
            onSubmit={handleSignIn}
            className="mt-10 w-full max-w-sm flex flex-col gap-3"
          >
            <label htmlFor="email" className="text-xs text-mute text-left uppercase tracking-wide">
              Sign in or create an account
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-surface border border-white/10 rounded-card px-4 py-3 text-sm text-chalk placeholder:text-mute/60 outline-none focus:border-brass/60"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-brass text-graphite font-semibold text-sm rounded-card px-5 py-3 hover:brightness-110 transition disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send link"}
              </button>
            </div>
            {status === "sent" && (
              <p className="text-sm text-plateGreen text-left">
                Check your inbox — we sent a sign-in link to {email}.
              </p>
            )}
            {status === "error" && (
              <p className="text-sm text-plateRed text-left">{errorMsg}</p>
            )}
            <p className="text-xs text-mute/70 text-left">
              No password. Your data is saved to your email and only visible
              to you.
            </p>
          </form>
        </section>

        <section className="grid sm:grid-cols-3 gap-4 py-16">
          {[
            {
              title: "Log fast",
              body: "Exercise, weight, reps, sets — one row, done. Built for between-set entry.",
            },
            {
              title: "See the trend",
              body: "Per-exercise charts show whether you're actually progressing, not just moving.",
            },
            {
              title: "Never lose history",
              body: "Every set is tied to your account. Sign in anywhere, your log is there.",
            },
          ].map((f) => (
            <div key={f.title} className="bg-surface rounded-card p-5 border border-white/5">
              <h3 className="font-display text-lg text-chalk tracking-wide">
                {f.title.toUpperCase()}
              </h3>
              <p className="mt-2 text-sm text-mute">{f.body}</p>
            </div>
          ))}
        </section>

        <footer className="pb-10 text-center text-xs text-mute/60">
          NOOBTOFIT — a progressive NOOBTOFIT tracker.
        </footer>
      </div>
    </main>
  );
}