"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { StoreError } from "@/lib/siteStore";

export function AdminSignIn({
  onSignIn,
  initialError,
}: {
  onSignIn: (password: string) => Promise<void>;
  initialError: string;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [pending, setPending] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      await onSignIn(password);
    } catch (cause) {
      setError(cause instanceof StoreError ? cause.message : "Couldn't connect. Try again.");
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
          <CardDescription>Sign in with your password to edit the site.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="flex flex-col gap-4">
            <Field data-invalid={error ? true : undefined}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                aria-invalid={error ? true : undefined}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              {error && <FieldError>{error}</FieldError>}
            </Field>
            <Button type="submit" disabled={pending || !password}>
              {pending && <Spinner data-icon="inline-start" />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
