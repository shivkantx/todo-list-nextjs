"use client";

import React, { useMemo } from "react";
import { useTodos } from "@/hooks/use-create-todo";
import { useTodoStore } from "@/store/todo-store";
import TodoItem from "@/components/todo-item";

function TodoSkeleton() {
    return (
        <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="animate-pulse rounded-xl border border-white/10 bg-white/[0.02] p-4"
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-5 rounded-full bg-white/10" />
                        <div className="h-3.5 w-1/3 rounded bg-white/10" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function TodoList() {
    const { isLoading, error } = useTodos();
    const filter = useTodoStore((state) => state.filter);
    const todos = useTodoStore((state) => state.todos);

    const filteredTodos = useMemo(() => {
        switch (filter) {
            case "active":
                return todos.filter((t) => !t.completed);
            case "completed":
                return todos.filter((t) => t.completed);
            default:
                return todos;
        }
    }, [todos, filter]);

    return (
        <div>
            {isLoading ? (
                <TodoSkeleton />
            ) : error ? (
                <div className="flex items-center gap-3 rounded-xl border border-[#F87171]/20 bg-[#F87171]/[0.04] p-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                        <path d="M12 8v4M12 16h.01" />
                        <circle cx="12" cy="12" r="10" />
                    </svg>
                    <p className="text-sm text-[#F87171]/90">
                        {error.message || "Couldn't load your todos. Try refreshing."}
                    </p>
                </div>
            ) : !filteredTodos || filteredTodos.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] py-14 text-center">
                    <p className="mb-1 text-lg text-white/60" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                        {filter === "all" ? "Nothing here yet." : `No ${filter} todos.`}
                    </p>
                    <p className="text-xs text-white/30">
                        {filter === "all" ? "Add your first todo above to get started." : "Switch tabs to see the rest."}
                    </p>
                </div>
            ) : (
                <div className="space-y-2.5">
                    {filteredTodos.map((todo) => (
                        <TodoItem key={todo._id} todo={todo} />
                    ))}
                </div>
            )}

            <style jsx global>{`
        @keyframes rise {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
}

export default TodoList;