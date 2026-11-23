"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminEditor } from "@/components/admin/AdminEditor";
import { AdminSignIn } from "@/components/admin/AdminSignIn";
import { Spinner } from "@/components/ui/spinner";
import { type LiveContent, loadContent, StoreError, signIn } from "@/lib/siteStore";

// Session storage: the sign-in ends when the tab closes.
const TOKEN_KEY = "admin:session";

export function AdminView() {
  const [session, setSession] = useState<{ token: string; live: LiveContent } | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setRestoring(false);
      return;
    }
    loadContent()
      .then((live) => setSession({ token, live }))
      .catch((error) =>
        setRestoreError(
          error instanceof StoreError ? error.message : "Couldn't connect. Try again.",
        ),
      )
      .finally(() => setRestoring(false));
  }, []);

  const submit = useCallback(async (password: string) => {
    const token = await signIn(password);
    const live = await loadContent();
    sessionStorage.setItem(TOKEN_KEY, token);
    setSession({ token, live });
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setRestoreError("");
    setSession(null);
  }, []);

  if (restoring) {
    return (
      <div className="flex w-full justify-center py-32">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    );
  }
  if (!session) return <AdminSignIn onSignIn={submit} initialError={restoreError} />;
  return <AdminEditor token={session.token} initial={session.live} onSignOut={signOut} />;
}
