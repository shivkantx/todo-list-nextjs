# Todo List

A dark, violet-themed todo app built with Next.js App Router, Zustand, TanStack Query, Zod, and Mongoose — featuring an animated completion ring, priority-coded tasks, filterable views, and full create/toggle/delete functionality backed by MongoDB.

![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black)
![React](https://img.shields.io/badge/React-19.2.4-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38BDF8)

## Features

- **Create todos** — title, optional description, and priority (low / medium / high), validated with Zod and React Hook Form
- **Toggle completion** — mark todos done/active with an animated checkbox
- **Delete todos** — remove todos with a single click
- **Filter views** — All / Active / Completed tabs with live counts
- **Completion ring** — an animated SVG progress ring showing % of todos completed
- **Priority indicators** — color-coded accent (sky blue / violet / red) on every card
- **Toast notifications** — success/error feedback via Sonner
- **Server Actions** — no API routes; all mutations run as Next.js Server Actions directly against MongoDB

## Tech Stack

| Layer                  | Tool                                                                                                        |
| ---------------------- | ----------------------------------------------------------------------------------------------------------- |
| Framework              | [Next.js 16](https://nextjs.org) (App Router, Server Actions, Turbopack)                                    |
| UI                     | React 19, [Tailwind CSS 4](https://tailwindcss.com)                                                         |
| Client state           | [Zustand](https://zustand-demo.pmnd.rs/) — holds the in-memory todo list, active filter, and derived counts |
| Server state / caching | [TanStack Query](https://tanstack.com/query) — fetches todos and syncs mutation results                     |
| Forms & validation     | [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) (via `@hookform/resolvers`)       |
| Database               | [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)                                 |
| Icons                  | [lucide-react](https://lucide.dev/)                                                                         |
| Notifications          | [Sonner](https://sonner.emilkowal.ski/)                                                                     |

## Architecture

This app skips traditional API routes in favor of **Next.js Server Actions**. The flow for any mutation:

```
TodoItem / TodoForm (Client Component)
        │  calls a TanStack Query mutation hook
        ▼
hooks/use-create-todo.js  (useCreateTodo / useToggleTodo / useDeleteTodo)
        │  mutationFn calls a Server Action
        ▼
actions/todo-actions.js  (createTodo / getTodos / toggleTodo / deleteTodo)
        │  talks to MongoDB via Mongoose
        ▼
model/todo.js  (Mongoose schema)
```

On success, each mutation hook does two things:

1. Updates the **Zustand store** directly (`setTodos`) so the UI reflects the change instantly
2. Calls `queryClient.invalidateQueries()` so TanStack Query refetches in the background and stays in sync with the server

The **Home page** (`app/page.js`) is a Server Component — it fetches the initial todo list directly from MongoDB on the server for fast first paint, then hands off to client components for interactivity.

## Project Structure

```
├── actions/
│   └── todo-actions.js       # Server Actions: createTodo, getTodos, toggleTodo, deleteTodo
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                 # Home page (Server Component) — headline, stats ring, form, list
│   └── globals.css
├── components/
│   ├── query-provider.jsx      # TanStack Query client provider
│   ├── todo-form.jsx           # Create-todo form (React Hook Form + Zod)
│   ├── todo-filter.jsx         # All / Active / Completed filter tabs
│   ├── todo-list.jsx           # Renders filtered list, loading/error/empty states
│   └── todo-item.jsx           # Single todo card — toggle & delete
├── hooks/
│   └── use-create-todo.js      # useCreateTodo, useTodos, useToggleTodo, useDeleteTodo
├── lib/
│   └── db.js                   # MongoDB connection helper
├── model/
│   └── todo.js                  # Mongoose schema (title, description, completed, priority)
├── store/
│   └── todo-store.js            # Zustand store — todos, filter, derived counts
└── validation/
    └── todo.js                  # Zod schema shared by form + server action
```

## Data Model

Each todo document:

| Field                     | Type      | Notes                                         |
| ------------------------- | --------- | --------------------------------------------- |
| `title`                   | `String`  | required, max 100 chars                       |
| `description`             | `String`  | optional, max 500 chars                       |
| `completed`               | `Boolean` | default `false`                               |
| `priority`                | `String`  | `low` \| `medium` \| `high`, default `medium` |
| `createdAt` / `updatedAt` | `Date`    | from Mongoose timestamps                      |

## Getting Started

### Prerequisites

- Node.js 18.18+
- A MongoDB connection string (local or [Atlas](https://www.mongodb.com/atlas))

### Setup

```bash
git clone <your-repo-url>
cd todo-list
npm install
```

Create a `.env.local` file in the root:

```env
MONGODB_URI=your-mongodb-connection-string
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack) |
| `npm run build` | Production build                 |
| `npm run start` | Run the production build         |
| `npm run lint`  | Run ESLint                       |

## Roadmap

- [ ] Edit existing todos
- [ ] Due dates / reminders
- [ ] Drag-and-drop reordering
- [ ] Auth + per-user todo lists

## License

MIT
