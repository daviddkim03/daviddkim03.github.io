"use client";

import { useCallback, useEffect, useState } from "react";
import { AdminEditor } from "@/components/admin/AdminEditor";
import { AdminSignIn } from "@/components/admin/AdminSignIn";
import { Spinner } from "@/components/ui/spinner";
import type { EditableContent } from "@/lib/content";
import { assertWriteAccess, GitHubError, readText } from "@/lib/github";

export const CONTENT_PATH = "src/content/site.json";
// Session storage: the token is dropped when the tab closes.
const TOKEN_KEY = "admin:github-token";

interface Session {
  token: string;
  content: EditableContent;
  sha: string;
}

async function openSession(token: string): Promise<Session> {
  await assertWriteAccess(token);
  const { text, sha } = await readText(token, CONTENT_PATH);
  return { token, content: JSON.parse(text), sha };
}

export function AdminView() {
  const [session, setSession] = useState<Session | null>(null);
  const [restoring, setRestoring] = useState(true);
  const [restoreError, setRestoreError] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem(TOKEN_KEY);
    if (!token) {
      setRestoring(false);
      return;
    }
    openSession(token)
      .then(setSession)
      .catch((error) => {
        // Keep the token on a network failure so a reload can retry.
        if (error instanceof GitHubError) sessionStorage.removeItem(TOKEN_KEY);
        setRestoreError(
          error instanceof GitHubError ? error.message : "Couldn't reach GitHub. Try again.",
        );
      })
      .finally(() => setRestoring(false));
  }, []);

  const signIn = useCallback(async (token: string) => {
    const next = await openSession(token);
    sessionStorage.setItem(TOKEN_KEY, token);
    setSession(next);
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
  if (!session) return <AdminSignIn onSignIn={signIn} initialError={restoreError} />;
  return (
    <AdminEditor
      token={session.token}
      initialContent={session.content}
      initialSha={session.sha}
      onSignOut={signOut}
    />
  );
}
