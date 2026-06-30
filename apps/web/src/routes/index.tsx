import { formatTaskAge } from "@blossom-garden/shared";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { useState } from "react";

import { api } from "../../convex/_generated/api";

const Home = () => {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list, {}));
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);
  const [newTaskText, setNewTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<
    (typeof tasks)[number]["_id"] | null
  >(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = newTaskText.trim();

    if (!text) {
      return;
    }

    await createTask({ text });
    setNewTaskText("");
  };

  const handleSaveTask = async (
    taskId: (typeof tasks)[number]["_id"],
    status: "todo" | "done"
  ) => {
    const text = editingTaskText.trim();

    if (!text) {
      return;
    }

    await updateTask({ id: taskId, status, text });
    setEditingTaskId(null);
    setEditingTaskText("");
  };

  return (
    <div className="min-h-screen bg-emerald-50 px-6 py-10 text-slate-950">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <section className="space-y-3">
          <p className="font-medium text-emerald-700 text-sm uppercase tracking-[0.16em]">
            Convex + TanStack Start
          </p>
          <h1 className="font-bold text-5xl tracking-tight">Blossom Garden</h1>
          <p className="max-w-2xl text-lg text-slate-700">
            Monorepo scaffold with live Convex data, Tailwind CSS, shadcn-ready
            utilities, Zod schemas, and date-fns helpers.
          </p>
        </section>

        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleCreateTask}>
            <input
              className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 outline-none transition focus:border-emerald-400"
              onChange={(event) => setNewTaskText(event.target.value)}
              placeholder="Add a new task"
              value={newTaskText}
            />
            <button
              className="rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition hover:bg-emerald-700"
              type="submit"
            >
              Add task
            </button>
          </form>
        </section>

        <section className="grid gap-3">
          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-emerald-200 bg-white p-6 text-slate-600">
              No tasks yet. Add one above to verify create works.
            </div>
          ) : null}

          {tasks.map((task) => (
            <article
              className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm"
              key={task._id}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  {editingTaskId === task._id ? (
                    <input
                      autoFocus
                      className="w-full rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 font-semibold text-xl outline-none transition focus:border-emerald-400"
                      onChange={(event) => setEditingTaskText(event.target.value)}
                      value={editingTaskText}
                    />
                  ) : (
                    <h2 className="font-semibold text-xl">{task.text}</h2>
                  )}
                  <p className="text-slate-500 text-sm">
                    Created {formatTaskAge(task.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 text-sm">
                  {task.status}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {editingTaskId === task._id ? (
                  <>
                    <button
                      className="rounded-lg bg-emerald-600 px-3 py-2 font-medium text-sm text-white transition hover:bg-emerald-700"
                      onClick={() => handleSaveTask(task._id, task.status)}
                      type="button"
                    >
                      Save
                    </button>
                    <button
                      className="rounded-lg border border-slate-200 px-3 py-2 font-medium text-slate-700 text-sm transition hover:bg-slate-50"
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditingTaskText("");
                      }}
                      type="button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="rounded-lg border border-emerald-200 px-3 py-2 font-medium text-emerald-800 text-sm transition hover:bg-emerald-50"
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditingTaskText(task.text);
                      }}
                      type="button"
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg border border-amber-200 px-3 py-2 font-medium text-amber-800 text-sm transition hover:bg-amber-50"
                      onClick={() =>
                        updateTask({
                          id: task._id,
                          status: task.status === "done" ? "todo" : "done",
                          text: task.text,
                        })
                      }
                      type="button"
                    >
                      Mark as {task.status === "done" ? "todo" : "done"}
                    </button>
                    <button
                      className="rounded-lg border border-rose-200 px-3 py-2 font-medium text-rose-800 text-sm transition hover:bg-rose-50"
                      onClick={() => deleteTask({ id: task._id })}
                      type="button"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/")({ component: Home });
