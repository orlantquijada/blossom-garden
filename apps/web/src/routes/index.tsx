import { formatTaskAge } from "@blossom-garden/shared";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { api } from "../../convex/_generated/api";

const Home = () => {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list, {}));

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

        <section className="grid gap-3">
          {tasks.length === 0 ? (
            <div className="rounded-lg border border-dashed border-emerald-200 bg-white p-6 text-slate-600">
              No tasks yet. Import `sampleData.jsonl` or create one through the
              Convex mutation.
            </div>
          ) : null}

          {tasks.map((task) => (
            <article
              className="rounded-lg border border-emerald-100 bg-white p-4 shadow-sm"
              key={task._id}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-xl">{task.text}</h2>
                  <p className="text-slate-500 text-sm">
                    Created {formatTaskAge(task.createdAt)}
                  </p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 text-sm">
                  {task.status}
                </span>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export const Route = createFileRoute("/")({ component: Home });
