"use client";

import React from "react";
import { Trash2, Calendar, Loader2 } from "lucide-react";
import { useToggleTodo, useDeleteTodo } from "@/hooks/use-create-todo";

const PRIORITY_COLOR = {
    low: "#7DD3FC",
    medium: "#A78BFA",
    high: "#F87171",
};

function TodoItem({ todo }) {
    const toggleMutation = useToggleTodo();
    const deleteMutation = useDeleteTodo();

    const formattedDate = new Date(todo.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const accentColor = PRIORITY_COLOR[todo.priority] || "#A78BFA";
    const isDeleting = deleteMutation.isPending;

    return (
        <div
            className={`group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.02] pl-4 pr-3 py-4 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.04] ${todo.completed ? "opacity-55" : ""
                } ${isDeleting ? "scale-[0.98] opacity-0" : "scale-100 opacity-100"}`}
        >
            {/* Priority accent edge */}
            <span
                className="absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200"
                style={{ background: accentColor, opacity: todo.completed ? 0.3 : 0.9 }}
            />

            <div className="flex items-start gap-3">
                <button
                    type="button"
                    onClick={() => toggleMutation.mutate(todo._id)}
                    disabled={toggleMutation.isPending}
                    aria-label={todo.completed ? "Mark as active" : "Mark as complete"}
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A78BFA]/50 disabled:cursor-wait disabled:opacity-50 disabled:hover:scale-100"
                    style={{
                        borderColor: todo.completed ? "#8A5EF0" : "rgba(255,255,255,0.25)",
                        background: todo.completed
                            ? "linear-gradient(135deg, #6D5EF0, #8A5EF0)"
                            : "transparent",
                    }}
                >
                    {toggleMutation.isPending ? (
                        <Loader2 size={10} className="animate-spin text-white/70" />
                    ) : (
                        todo.completed && (
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                        )
                    )}
                </button>

                <div className="min-w-0 flex-1">
                    <h3
                        className={`truncate text-sm font-medium transition-all duration-200 ${todo.completed ? "text-white/30 line-through" : "text-white"
                            }`}
                    >
                        {todo.title}
                    </h3>

                    {todo.description && (
                        <p className={`mt-1 text-xs leading-relaxed ${todo.completed ? "text-white/20" : "text-white/45"}`}>
                            {todo.description}
                        </p>
                    )}

                    <div className="mt-2 flex items-center gap-3 text-[10px] text-white/30">
                        <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {formattedDate}
                        </span>
                        <span
                            className="rounded-full border px-2 py-0.5 font-medium uppercase tracking-wider"
                            style={{ borderColor: `${accentColor}40`, color: accentColor }}
                        >
                            {todo.priority}
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => deleteMutation.mutate(todo._id)}
                    disabled={isDeleting}
                    aria-label="Delete todo"
                    className="shrink-0 rounded-md p-1.5 text-white/25 opacity-0 transition-all duration-200 hover:bg-[#F87171]/10 hover:text-[#F87171] focus:outline-none focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-[#F87171]/40 group-hover:opacity-100 disabled:cursor-wait"
                >
                    {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </button>
            </div>
        </div>
    );
}

export default TodoItem;