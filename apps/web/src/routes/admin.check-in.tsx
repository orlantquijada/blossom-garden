import { Link, createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "convex/react";
import { ArrowRight, ScanLine, Trash2 } from "lucide-react";
import { useState } from "react";
import type { FormEvent } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AdminShell, formatDateTime } from "@/lib/admin-ui";

import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";

function CheckInPage() {
  const checkIn = useMutation(api.scanLogs.checkIn);
  const removeScan = useMutation(api.scanLogs.remove);
  const scanLogs = useQuery(api.scanLogs.list, {}) ?? [];
  const [result, setResult] = useState<Doc<"members"> | null>(null);
  const [error, setError] = useState("");

  async function handleCheckIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);

    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const memberCode = String(form.get("memberCode") ?? "").trim();

    if (!memberCode) {
      return;
    }

    try {
      const member = await checkIn({
        memberCode,
        note: String(form.get("note") ?? "").trim() || undefined,
      });
      setResult(member);
      formElement.reset();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Check-in failed.");
    }
  }

  return (
    <AdminShell title="Manual check-in">
      <div className="grid gap-6 lg:grid-cols-[24rem_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScanLine className="size-5" />
              Log scan
            </CardTitle>
            <CardDescription>
              Enter the QR/member code printed on the pass.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4" onSubmit={handleCheckIn}>
              <div className="grid gap-2">
                <Label htmlFor="memberCode">Member code</Label>
                <Input
                  className="font-mono uppercase"
                  id="memberCode"
                  name="memberCode"
                  placeholder="BGD-XXXXXXXX"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note">Note</Label>
                <Textarea id="note" name="note" rows={3} />
              </div>
              <Button type="submit">
                <ScanLine />
                Log check-in
              </Button>
              {error ? (
                <p className="text-destructive text-sm">{error}</p>
              ) : null}
              {result ? (
                <div className="bg-accent rounded-md border p-3">
                  <p className="font-medium">Checked in {result.name}</p>
                  <p className="text-muted-foreground font-mono text-sm">
                    {result.memberCode}
                  </p>
                  <Button asChild className="mt-3" size="sm" variant="outline">
                    <Link
                      params={{ memberId: result._id }}
                      to="/admin/members/$memberId"
                    >
                      View member
                      <ArrowRight />
                    </Link>
                  </Button>
                </div>
              ) : null}
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent check-ins</CardTitle>
            <CardDescription>Last 50 scan logs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {scanLogs.map((scan) => (
              <div
                className="flex flex-col gap-1 border-b pb-3 last:border-0 sm:flex-row sm:items-center sm:justify-between"
                key={scan._id}
              >
                <div className="flex items-center gap-2">
                  <Badge className="font-mono" variant="secondary">
                    {scan.memberCode}
                  </Badge>
                  {scan.source === "self" ? (
                    <Badge variant="outline">self</Badge>
                  ) : null}
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground text-sm">
                    {formatDateTime(scan.scannedAt)}
                  </p>
                  <Button
                    aria-label={`Delete check-in ${scan.memberCode}`}
                    onClick={() => removeScan({ id: scan._id })}
                    size="icon-xs"
                    variant="ghost"
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            {scanLogs.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No check-ins logged.
              </p>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}

export const Route = createFileRoute("/admin/check-in")({
  component: CheckInPage,
});
