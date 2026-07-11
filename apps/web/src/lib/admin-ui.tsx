import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Crown,
  LayoutDashboard,
  ScanLine,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import type { Doc } from "../../convex/_generated/dataModel";

export type MemberStatus = Doc<"members">["status"];

const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/admin" },
  { icon: Users, label: "Members", to: "/admin/members" },
  { icon: ScanLine, label: "Check-in", to: "/admin/check-in" },
] as const;

export function AdminShell({
  children,
  title,
}: {
  readonly children: ReactNode;
  readonly title: string;
}) {
  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card border-b">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Blossom Garden admin
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-normal">
              {title}
            </h1>
          </div>
          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Button asChild key={item.to} variant="outline">
                  <Link
                    activeProps={{
                      className: "bg-accent text-accent-foreground",
                    }}
                    to={item.to}
                  >
                    <Icon />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">{children}</main>
    </div>
  );
}

export function MemberStatusBadge({
  status,
}: {
  readonly status: MemberStatus;
}) {
  const Icon = status === "vip" ? Crown : BadgeCheck;

  return (
    <Badge
      className={cn(
        status === "vip"
          ? "border-amber-300 bg-amber-100 text-amber-900"
          : "border-emerald-300 bg-emerald-100 text-emerald-900"
      )}
      variant="outline"
    >
      <Icon />
      {status === "vip" ? "VIP" : "Regular"}
    </Badge>
  );
}

export function formatDateTime(value: number) {
  return dateTimeFormatter.format(value);
}
