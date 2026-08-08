"use server";

import { revalidatePath } from "next/cache";
import connectDB from "@/lib/db";
import Todo from "@/model/todo";
import { createTodoSchema } from "@/validation/todo";
import { success } from "zod";

export async function createTodo(data) {
  try {
    // Connect to database first
    await connectDB();

    // Validate incoming data
    const validatedData = createTodoSchema.parse(data);

    // Save todo
    const todo = await Todo.create(validatedData);

    // Revalidate the home page
    revalidatePath("/");

    return {
      success: true,
      data: JSON.parse(JSON.stringify(todo)),
    };
  } catch (error) {
    console.error("Error creating todo:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create todo",
    };
  }
}

export async function getTodos() {
  try {
    await connectDB();

    const todos = await Todo.find({}).sort({ createdAt: -1 });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(todos)),
    };
  } catch (error) {
    console.log("Error fetching todos", error);
    return {
      success: false,
      error: "Failed to fetch todos",
    };
  }
}

export async function toggleTodo(id) {
  try {
    await connectDB();
    const todo = await Todo.findById(id);
    if (!todo) {
      return {
        success: false,
        error: "Todo not found",
      };
    }
    todo.completed = !todo.completed;
    await todo.save();

    revalidatePath("/");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(todo)),
    };
  } catch (error) {
    console.error("Error toggling todo:", error);
    return {
      success: false,
      error: "Failed to update todo",
    };
  }
}

export async function deleteTodo(id) {
  try {
    connectDB();
    await Todo.findByIdAndDelete(id);
    revalidatePath("/");
    return { success: true, id };
  } catch (error) {
    console.log("Error deleting todo:", error);
    return {
      success: false,
      error: "Failed to delete todo",
    };
  }
}
