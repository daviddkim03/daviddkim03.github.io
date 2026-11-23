"use client";

import { useState } from "react";
import { LuArrowUpRight } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { GitHubError } from "@/lib/github";

export function AdminSignIn({
  onSignIn,
  initialError,
}: {
  onSignIn: (token: string) => Promise<void>;
  initialError: string;
}) {
  const [token, setToken] = useState("");
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSignIn(token.trim());
    } catch (cause) {
      setError(cause instanceof GitHubError ? cause.message : "Couldn't reach GitHub. Try again.");
      setPending(false);
    }
  };

  return (
    <div className="flex w-full max-w-sm flex-col justify-center py-16">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1>Admin</h1>
          </CardTitle>
          <CardDescription>Sign in with a GitHub token to edit the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="token">GitHub token</FieldLabel>
              <Input
                id="token"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={error ? true : undefined}
                value={token}
                onChange={(event) => setToken(event.target.value)}
              />
              {error && <FieldError>{error}</FieldError>}
              <FieldDescription>
                Use a fine-grained token limited to this repository, with Contents set to read and
                write. It stays in this tab and is forgotten when you close it.
              </FieldDescription>
            </Field>
            <Button type="submit" disabled={pending || !token.trim()}>
              {pending && <Spinner data-icon="inline-start" />}
              Sign in
            </Button>
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Create a token
              <LuArrowUpRight className="size-4" />
            </a>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
