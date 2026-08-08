import {
  createTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
} from "@/actions/todo-actions";
import { useTodoStore } from "@/store/todo-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTodoSchema } from "@/validation/todo";

export const todoKeys = {
  all: ["todo"],
  lists: () => [...todoKeys.all, "list"],
};

export function useCreateTodo() {
  const queryClient = useQueryClient();

  const addTodo = useTodoStore((state) => state.addTodo);

  return useMutation({
    mutationFn: createTodo,

    onSuccess: (result) => {
      if (result?.success) {
        // Update Zustand store
        addTodo(result.data);

        // Refresh React Query cache
        queryClient.invalidateQueries({
          queryKey: todoKeys.lists(),
        });
      }
    },

    onError: (error) => {
      console.error("Failed to create todo:", error);
    },
  });
}

export function useTodos() {
  const setTodos = useTodoStore((state) => state.setTodos);

  return useQuery({
    queryKey: todoKeys.lists(),
    queryFn: async () => {
      const result = await getTodos();

      console.log(result);

      if (result.success) {
        // Update zutand store with the fetched data;
        setTodos(result.data);
        return result.data;
      }
      throw new Error(result.Error);
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();
  const setTodos = useTodoStore((state) => state.setTodos);
  const todos = useTodoStore((state) => state.todos);

  return useMutation({
    mutationFn: toggleTodo,
    onSuccess: (result) => {
      if (result.success) {
        setTodos(
          todos.map((todo) =>
            todo._id === result.data._id ? result.data : todo,
          ),
        );
      }
    },

    onError: (error) => console.log("Failed to toogle todo:", error),
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();
  const setTodos = useTodoStore((state) => state.setTodos);
  const todos = useTodoStore((state) => state.todos);

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (result) => {
      if (result?.success) {
        setTodos(todos.filter((todo) => todo._id !== result.id));
        queryClient.invalidateQueries({ queryKey: todoKeys.lists() });
      }
    },
    onError: (error) => console.error("Failed to delete todo:", error),
  });
}
