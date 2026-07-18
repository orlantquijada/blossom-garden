import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

function LogoutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    void authClient.signOut().finally(() => navigate({ to: "/" }));
  }, [navigate]);

  return (
    <main className="grid min-h-screen place-items-center">Signing out…</main>
  );
}

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
});
