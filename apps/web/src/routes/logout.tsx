import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { authClient } from "@/lib/auth-client";
// Side-effect import: initializes the i18n instance for useTranslation.
import "@/lib/i18n";

function LogoutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    void authClient.signOut().finally(() => navigate({ to: "/" }));
  }, [navigate]);

  return (
    <main className="garden bg-background text-foreground grid min-h-screen place-items-center">
      {t("signingOut")}
    </main>
  );
}

export const Route = createFileRoute("/logout")({
  component: LogoutPage,
  head: () => ({ styles: [{ children: "html { background: #060504 }" }] }),
});
