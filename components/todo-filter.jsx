"use client";
import React from "react";

import { useTodoStore } from "@/store/todo-store";

function TodoFilter() {
    const { filter, setFilter, completedCount, activeCount } = useTodoStore();

    const filters = [
        { key: "all", label: "All", count: activeCount() + completedCount() },
        { key: "active", label: "Active", count: activeCount() },
        { key: "completed", label: "Completed", count: completedCount() },
    ];

    return (
        <div className="mb-4 flex gap-1.5">
            {filters.map((f) => {
                const isActive = filter === f.key;
                return (
                    <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className="flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200"
                        style={{
                            background: isActive ? "rgba(167,139,250,0.15)" : "transparent",
                            color: isActive ? "#C4B5FD" : "rgba(255,255,255,0.4)",
                            border: `1px solid ${isActive ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.08)"}`,
                        }}
                    >
                        {f.label}
                        <span
                            className="rounded-full px-1.5 text-[10px] tabular-nums"
                            style={{
                                background: isActive ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.06)",
                            }}
                        >
                            {f.count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

export default TodoFilter;