import connectDB from "@/lib/db";
import Todo from "@/model/todo";
import React from "react";
import TodoForm from "@/components/todo-form";
import TodoList from "@/components/todo-list";
import TodoFilter from "@/components/todo-filter";

export default async function Home() {
  await connectDB();

  const todos = JSON.parse(
    JSON.stringify(await Todo.find().sort({ createdAt: -1 }).lean()),
  );
  const activeCount = todos.filter((t) => !t.completed).length;
  const doneCount = todos.filter((t) => t.completed).length;
  const total = todos.length;
  const pct = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  // circle math for the progress ring
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (pct / 100) * circumference;

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative min-h-screen overflow-hidden text-[#F1F0F7]"
      style={{
        background:
          "linear-gradient(160deg, #0B0714 0%, #150B29 35%, #1C0F38 65%, #120A24 100%)",
      }}
    >
      {/* Ambient drifting glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[500px] w-[500px] -translate-x-1/2 animate-[drift_14s_ease-in-out_infinite] rounded-full bg-[#8A5EF0]/15 blur-[130px]" />
        <div className="absolute right-[10%] top-[30%] h-[300px] w-[300px] animate-[drift_18s_ease-in-out_infinite_reverse] rounded-full bg-[#A78BFA]/10 blur-[110px]" />
        <div className="absolute left-[5%] bottom-[5%] h-[350px] w-[350px] animate-[drift_20s_ease-in-out_infinite] rounded-full bg-[#6D5EF0]/12 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-3xl px-6">
        {/* Sticky header */}
        <header className="sticky px-2 top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0B0714]/70 py-5 backdrop-blur-xl">
          <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-white/40">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#A78BFA]" />
            Todo List
          </span>

          <a
            href="#new-todo"
            className="group inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-white shadow-[0_4px_20px_-4px_rgba(109,94,240,0.55)] transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_6px_28px_-4px_rgba(138,94,240,0.7)] active:scale-[0.97]"
            style={{ background: "linear-gradient(135deg, #6D5EF0, #8A5EF0)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:rotate-90"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Todo
          </a>
        </header>

        {/* Headline — staggered rise-in */}
        <div className="pt-16 pb-12 opacity-0 animate-[rise_0.7s_ease-out_0.05s_forwards]">
          <p
            className="mb-3 text-sm text-white/40"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {today}
          </p>
          <h1
            className="leading-[0.92] tracking-tight text-white"
            style={{
              fontFamily: "'Fraunces', Georgia, serif",
              fontWeight: 600,
              fontSize: "clamp(2.75rem, 8vw, 5rem)",
            }}
          >
            Get it
            <br />
            <span
              className="bg-clip-text italic text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #A78BFA, #8A5EF0)",
              }}
            >
              done today.
            </span>
          </h1>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-white/45">
            Write it down, cross it off. Nothing forgotten.
          </p>
        </div>

        {/* Signature element: completion ring + stats */}
        <div className="mb-12 flex items-center gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 opacity-0 animate-[rise_0.7s_ease-out_0.2s_forwards] sm:p-8">
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg
              width="128"
              height="128"
              viewBox="0 0 128 128"
              className="-rotate-90"
            >
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="10"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                fill="none"
                stroke="url(#ringGradient)"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{
                  transition:
                    "stroke-dashoffset 1.1s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
              <defs>
                <linearGradient
                  id="ringGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#6D5EF0" />
                  <stop offset="100%" stopColor="#A78BFA" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span
                className="text-2xl font-black tabular-nums text-white"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                {pct}%
              </span>
              <span className="text-[10px] uppercase tracking-[0.15em] text-white/35">
                done
              </span>
            </div>
          </div>

          <div className="grid flex-1 grid-cols-3 divide-x divide-white/10">
            {[
              { label: "Total", value: total },
              { label: "Active", value: activeCount },
              { label: "Done", value: doneCount },
            ].map((stat, i) => (
              <div
                key={stat.label}
                className="px-3 text-center first:pl-0 last:pr-0 sm:px-4"
              >
                <p
                  className="font-black leading-none tabular-nums text-white"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
                  }}
                >
                  {stat.value}
                </p>
                <p className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-white/35">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div
          id="new-todo"
          className="mb-10 scroll-mt-24 opacity-0 animate-[rise_0.7s_ease-out_0.35s_forwards]"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-[#A78BFA]">
            New entry
          </p>
          <TodoForm />
        </div>

        {/* Todos filter  */}
        <TodoFilter />

        <div className=" text-[#A78BFA]">
          <TodoList />
        </div>

        <footer className="flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-white/10 py-6 opacity-0 animate-[rise_0.7s_ease-out_0.45s_forwards]">
          <span className="mr-2 text-xs text-white/25">Built with</span>
          {["Next.js", "Zustand", "TanStack Query", "Zod", "Mongoose"].map(
            (tech) => (
              <span
                key={tech}
                className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-white/40 transition-colors hover:border-[#A78BFA]/40 hover:text-white/70"
              >
                {tech}
              </span>
            ),
          )}
        </footer>
      </div>
    </div>
  );
}
