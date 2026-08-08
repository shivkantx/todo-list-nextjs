"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTodoSchema } from "@/validation/todo";
import { useCreateTodo } from "@/hooks/use-create-todo";
import { toast } from "sonner";

function TodoForm() {
    const [isOpen, setIsOpen] = useState(false);

    const createTodoMutation = useCreateTodo();

    const form = useForm({
        resolver: zodResolver(createTodoSchema),
        defaultValues: {
            title: "",
            description: "",
            priority: "medium",
        },
    });

    const onSubmit = async (data) => {
        try {
            const result = await createTodoMutation.mutateAsync(data);

            if (result.success) {
                toast.success("Todo created successfully");
                form.reset();
                setIsOpen(false);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            toast.error("Failed to create todo");
        }
    };

    // Show only Create button initially
    if (!isOpen) {
        return (
            <button
                type="button"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 py-4 mb-6 text-sm font-medium text-white/50 transition-all duration-200 hover:border-[#8A5EF0]/50 hover:bg-white/[0.02] hover:text-white"
                onClick={() => setIsOpen(true)}
            >
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    className="transition-transform duration-200 group-hover:rotate-90"
                >
                    <path d="M12 5v14M5 12h14" />
                </svg>
                Create New Todo
            </button>
        );
    }

    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] backdrop-blur-sm">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-base font-semibold tracking-tight text-white">
                    Create New Todo
                </h1>
                <button
                    type="button"
                    onClick={() => {
                        form.reset();
                        setIsOpen(false);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-white/30 transition-colors hover:bg-white/5 hover:text-white"
                    aria-label="Close"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Form */}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                    >
                        Title
                    </label>

                    <input
                        id="title"
                        type="text"
                        placeholder="Enter todo title..."
                        {...form.register("title")}
                        className="w-full rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-150 focus:border-[#8A5EF0] focus:ring-2 focus:ring-[#8A5EF0]/20"
                    />

                    {form.formState.errors.title && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#F87171]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 8v4M12 16h.01" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            {form.formState.errors.title.message}
                        </p>
                    )}
                </div>

                {/* Description */}
                <div>
                    <label
                        htmlFor="description"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                    >
                        Description
                    </label>

                    <textarea
                        id="description"
                        rows={3}
                        placeholder="Enter todo description (optional)..."
                        {...form.register("description")}
                        className="w-full resize-none rounded-lg border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition-colors duration-150 focus:border-[#8A5EF0] focus:ring-2 focus:ring-[#8A5EF0]/20"
                    />

                    {form.formState.errors.description && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-[#F87171]">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <path d="M12 8v4M12 16h.01" />
                                <circle cx="12" cy="12" r="10" />
                            </svg>
                            {form.formState.errors.description.message}
                        </p>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <label
                        htmlFor="priority"
                        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/40"
                    >
                        Priority
                    </label>

                    <select
                        id="priority"
                        {...form.register("priority")}
                        className="w-full appearance-none rounded-lg border border-white/10 bg-black/30 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23ffffff80%22 stroke-width=%222.5%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat px-3.5 py-2.5 pr-9 text-sm text-white outline-none transition-colors duration-150 focus:border-[#8A5EF0] focus:ring-2 focus:ring-[#8A5EF0]/20"
                    >
                        <option value="low" className="bg-[#0A0A0F] text-white">Low</option>
                        <option value="medium" className="bg-[#0A0A0F] text-white">Medium</option>
                        <option value="high" className="bg-[#0A0A0F] text-white">High</option>
                    </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-1">
                    <button
                        type="submit"
                        disabled={createTodoMutation.isPending}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_-4px_rgba(109,94,240,0.5)] transition-opacity duration-150 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ background: "linear-gradient(135deg, #6D5EF0, #8A5EF0)" }}
                    >
                        {createTodoMutation.isPending && (
                            <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4Z" />
                            </svg>
                        )}
                        {createTodoMutation.isPending ? "Creating..." : "Create Todo"}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            form.reset();
                            setIsOpen(false);
                        }}
                        className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-white/50 transition-colors duration-150 hover:border-white/20 hover:text-white"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TodoForm;