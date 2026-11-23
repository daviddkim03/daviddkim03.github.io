"use client";

import { useEffect, useId, useRef, useState } from "react";
import { LuArrowDown, LuArrowUp, LuPlus, LuTrash2, LuUpload } from "react-icons/lu";
import { toast } from "sonner";
import { CONTENT_PATH } from "@/components/admin/AdminView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type { EditableContent } from "@/lib/content";
import { findSha, GitHubError, writeFile } from "@/lib/github";

const RESUME_PATH = "resumes/david-kim-main.pdf";
const MAX_RESUME_BYTES = 10 * 1024 * 1024;

type Experience = EditableContent["about"]["work"][number];
type Study = EditableContent["about"]["studies"][number];
/** Entries get a stable key while editing so reordering keeps focus and state. */
type Keyed<T> = { key: string; value: T };

const withKeys = <T,>(items: T[]): Keyed<T>[] =>
  items.map((value) => ({ key: crypto.randomUUID(), value }));

const lines = (text: string) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

const errorMessage = (error: unknown) =>
  error instanceof GitHubError ? error.message : "Couldn't reach GitHub. Try again.";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">{children}</CardContent>
    </Card>
  );
}

function TextField({
  label,
  value,
  onChange,
  multiline = false,
  required = true,
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  required?: boolean;
  description?: string;
}) {
  const id = useId();
  const Control = multiline ? Textarea : Input;
  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Control
        id={id}
        value={value}
        required={required}
        onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
          onChange(event.target.value)
        }
      />
      {description && <FieldDescription>{description}</FieldDescription>}
    </Field>
  );
}

/** An editable, reorderable list of entries. */
function EntryList<T>({
  items,
  onChange,
  noun,
  create,
  children,
}: {
  items: Keyed<T>[];
  onChange: (items: Keyed<T>[]) => void;
  noun: string;
  create: () => T;
  children: (value: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  const move = (from: number, to: number) => {
    const next = [...items];
    next.splice(to, 0, ...next.splice(from, 1));
    onChange(next);
  };

  return (
    <>
      {items.map(({ key, value }, index) => (
        <fieldset key={key} className="flex min-w-0 flex-col gap-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {noun} {index + 1}
            </span>
            <div className="-mr-1.5 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={index === 0}
                onClick={() => move(index, index - 1)}
              >
                <LuArrowUp />
                <span className="sr-only">Move up</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={index === items.length - 1}
                onClick={() => move(index, index + 1)}
              >
                <LuArrowDown />
                <span className="sr-only">Move down</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => onChange(items.filter((item) => item.key !== key))}
              >
                <LuTrash2 />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          </div>
          {children(value, (patch) =>
            onChange(
              items.map((item) =>
                item.key === key ? { key, value: { ...item.value, ...patch } } : item,
              ),
            ),
          )}
        </fieldset>
      ))}
      <Button
        type="button"
        variant="outline"
        className="self-start"
        onClick={() => onChange([...items, { key: crypto.randomUUID(), value: create() }])}
      >
        <LuPlus data-icon="inline-start" />
        Add {noun.toLowerCase()}
      </Button>
    </>
  );
}

export function AdminEditor({
  token,
  initialContent,
  initialSha,
  onSignOut,
}: {
  token: string;
  initialContent: EditableContent;
  initialSha: string;
  onSignOut: () => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [work, setWork] = useState(() => withKeys<Experience>(initialContent.about.work));
  const [studies, setStudies] = useState(() => withKeys<Study>(initialContent.about.studies));
  const [skills, setSkills] = useState(() => initialContent.about.skills.join("\n"));
  const [languages, setLanguages] = useState(() => initialContent.person.languages.join("\n"));
  const [sha, setSha] = useState(initialSha);
  const [saved, setSaved] = useState(() => JSON.stringify(initialContent));
  const [busy, setBusy] = useState<"save" | "resume" | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const switchId = useId();

  const draft: EditableContent = {
    ...content,
    person: { ...content.person, languages: lines(languages) },
    about: {
      ...content.about,
      work: work.map((item) => item.value),
      studies: studies.map((item) => item.value),
      skills: lines(skills),
    },
  };
  const dirty = JSON.stringify(draft) !== saved;

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const setPerson = (patch: Partial<EditableContent["person"]>) =>
    setContent((c) => ({ ...c, person: { ...c.person, ...patch } }));
  const setHome = (patch: Partial<EditableContent["home"]>) =>
    setContent((c) => ({ ...c, home: { ...c.home, ...patch } }));
  const setResume = (patch: Partial<EditableContent["resume"]>) =>
    setContent((c) => ({ ...c, resume: { ...c.resume, ...patch } }));

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy("save");
    try {
      const text = `${JSON.stringify(draft, null, 2)}\n`;
      setSha(await writeFile(token, CONTENT_PATH, text, "content: update site content", sha));
      setSaved(JSON.stringify(draft));
      toast.success("Saved. The site updates in about a minute.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  const uploadResume = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" || file.size > MAX_RESUME_BYTES) {
      toast.error("Choose a PDF smaller than 10 MB.");
      return;
    }
    setBusy("resume");
    try {
      const path = `public/${RESUME_PATH}`;
      const bytes = new Uint8Array(await file.arrayBuffer());
      const current = await findSha(token, path);
      await writeFile(token, path, bytes, "content: update resume", current);
      toast.success("Résumé uploaded. The site updates in about a minute.");
    } catch (error) {
      toast.error(errorMessage(error));
    } finally {
      setBusy(null);
    }
  };

  return (
    <form onSubmit={save} className="flex w-full max-w-3xl flex-col gap-6 pt-4 md:pt-8">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Admin</h1>
        <Button type="button" variant="outline" disabled={busy !== null} onClick={onSignOut}>
          Sign out
        </Button>
      </div>

      <Section title="Profile">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            value={content.person.name}
            onChange={(name) => setPerson({ name })}
          />
          <TextField
            label="Headline role"
            value={content.person.role}
            onChange={(role) => setPerson({ role })}
          />
        </div>
        <TextField
          label="Location"
          value={content.person.location}
          onChange={(location) => setPerson({ location })}
        />
        <TextField
          label="Languages"
          multiline
          required={false}
          value={languages}
          onChange={setLanguages}
          description="One per line."
        />
        <TextField
          label="About intro"
          multiline
          value={content.about.intro}
          onChange={(intro) => setContent((c) => ({ ...c, about: { ...c.about, intro } }))}
        />
      </Section>

      <Section title="Home page">
        <TextField
          label="Headline"
          value={content.home.headline}
          onChange={(headline) => setHome({ headline })}
        />
        <TextField
          label="Intro"
          multiline
          value={content.home.subline}
          onChange={(subline) => setHome({ subline })}
        />
      </Section>

      <Section title="Work experience">
        <EntryList
          items={work}
          onChange={setWork}
          noun="Job"
          create={(): Experience => ({ company: "", role: "", timeframe: "", achievements: [] })}
        >
          {(job, update) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  label="Company"
                  value={job.company}
                  onChange={(company) => update({ company })}
                />
                <TextField label="Role" value={job.role} onChange={(role) => update({ role })} />
              </div>
              <TextField
                label="Dates"
                value={job.timeframe}
                onChange={(timeframe) => update({ timeframe })}
              />
            </>
          )}
        </EntryList>
      </Section>

      <Section title="Education">
        <EntryList
          items={studies}
          onChange={setStudies}
          noun="Entry"
          create={(): Study => ({ name: "", description: "", timeframe: "" })}
        >
          {(study, update) => (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" value={study.name} onChange={(name) => update({ name })} />
                <TextField
                  label="Dates"
                  required={false}
                  value={study.timeframe}
                  onChange={(timeframe) => update({ timeframe })}
                />
              </div>
              <TextField
                label="Description"
                value={study.description}
                onChange={(description) => update({ description })}
              />
            </>
          )}
        </EntryList>
      </Section>

      <Section title="Skills">
        <TextField
          label="Skills"
          multiline
          required={false}
          value={skills}
          onChange={setSkills}
          description="One per line."
        />
      </Section>

      <Section title="Résumé">
        <Field orientation="horizontal">
          <FieldLabel htmlFor={switchId}>Show the résumé button</FieldLabel>
          <Switch
            id={switchId}
            checked={content.resume.display}
            onCheckedChange={(display) => setResume({ display })}
          />
        </Field>
        <TextField
          label="Button label"
          value={content.resume.label}
          onChange={(label) => setResume({ label })}
        />
        <input
          ref={fileInput}
          type="file"
          accept="application/pdf"
          aria-label="Résumé PDF"
          className="hidden"
          onChange={uploadResume}
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={busy !== null}
            onClick={() => fileInput.current?.click()}
          >
            {busy === "resume" ? (
              <Spinner data-icon="inline-start" />
            ) : (
              <LuUpload data-icon="inline-start" />
            )}
            Replace PDF
          </Button>
          <p className="text-sm text-muted-foreground">Publishes as soon as you pick a file.</p>
        </div>
      </Section>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-between gap-4 border-t bg-background px-6 py-4">
        <p className="text-sm text-muted-foreground">
          {dirty ? "You have unsaved changes." : "All changes saved."}
        </p>
        <Button type="submit" disabled={!dirty || busy !== null}>
          {busy === "save" && <Spinner data-icon="inline-start" />}
          Save and publish
        </Button>
      </div>
    </form>
  );
}
