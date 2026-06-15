"use client";

import {
  type EditableContent,
  defaultContent,
  loadContent,
  saveContent,
  uploadAsset,
} from "@/lib/content";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  Avatar,
  Button,
  Checkbox,
  Column,
  Feedback,
  Heading,
  IconButton,
  Input,
  PasswordInput,
  Row,
  Select,
  Spinner,
  Switch,
  Text,
  Textarea,
} from "@once-ui-system/core";
import { useEffect, useRef, useState } from "react";

type ProjectRef = { slug: string; title: string };
type Phase = "loading" | "login" | "editor";

/** Initials fallback for an avatar when no logo image is set. */
function monogram(name: string): string {
  const cleaned = name.replace(/\(.*?\)/g, " ").replace(/\b(LLC|Inc|Ltd|Co)\.?\b/gi, " ");
  const words = cleaned.split(/\s+/).filter((w) => /[a-z0-9]/i.test(w));
  if (words.length === 0) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Add/remove a list of string "chips" (used for skills and languages). */
function ChipInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const [text, setText] = useState("");
  const commit = () => {
    const t = text.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText("");
  };
  return (
    <Column fillWidth gap="8">
      <Text variant="label-default-s" onBackground="neutral-weak">
        {label}
      </Text>
      {value.length > 0 && (
        <Row fillWidth wrap gap="8">
          {value.map((v) => (
            <Row
              key={v}
              vertical="center"
              gap="4"
              paddingLeft="12"
              paddingRight="4"
              paddingY="2"
              radius="full"
              background="neutral-alpha-weak"
              border="neutral-alpha-medium"
            >
              <Text variant="label-default-s">{v}</Text>
              <IconButton
                icon="close"
                size="s"
                variant="ghost"
                tooltip="Remove"
                onClick={() => onChange(value.filter((x) => x !== v))}
              />
            </Row>
          ))}
        </Row>
      )}
      <Row fillWidth gap="8" vertical="center">
        <Row fillWidth>
          <Input
            id={`chip-${label}`}
            placeholder={`Add ${label.toLowerCase()} and press Enter`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commit();
              }
            }}
          />
        </Row>
        <Button size="m" variant="secondary" onClick={commit}>
          Add
        </Button>
      </Row>
    </Column>
  );
}

/** Avatar preview + image upload for a work/education logo. */
function LogoUpload({
  name,
  url,
  onChange,
}: {
  name: string;
  url?: string;
  onChange: (url: string | undefined) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const pick = async (file: File) => {
    setBusy(true);
    const { url: uploaded } = await uploadAsset(file, `logos/${Date.now()}-${file.name}`);
    setBusy(false);
    if (uploaded) onChange(uploaded);
  };
  return (
    <Row vertical="center" gap="12">
      <Avatar size="m" src={url} value={monogram(name || "?")} />
      <input
        ref={ref}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) pick(f);
        }}
      />
      <Button size="s" variant="secondary" loading={busy} onClick={() => ref.current?.click()}>
        {url ? "Change logo" : "Upload logo"}
      </Button>
      {url && (
        <Button size="s" variant="tertiary" onClick={() => onChange(undefined)}>
          Remove
        </Button>
      )}
    </Row>
  );
}

export function AdminEditor({ projects }: { projects: ProjectRef[] }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | undefined>();
  const [draft, setDraft] = useState<EditableContent>(defaultContent);
  const [message, setMessage] = useState<{ kind: "success" | "danger"; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const resumeRef = useRef<HTMLInputElement>(null);
  const [resumeBusy, setResumeBusy] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setPhase("login");
      return;
    }
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session) {
        setDraft(await loadContent());
        setPhase("editor");
      } else {
        setPhase("login");
      }
    });
  }, []);

  const signIn = async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setAuthError(undefined);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
      return;
    }
    setDraft(await loadContent());
    setPhase("editor");
  };

  const signOut = async () => {
    await getSupabase()?.auth.signOut();
    setPhase("login");
    setPassword("");
  };

  const save = async (next: EditableContent = draft) => {
    setSaving(true);
    setMessage(null);
    const { error } = await saveContent(next);
    setSaving(false);
    setMessage(
      error
        ? { kind: "danger", text: error }
        : { kind: "success", text: "Saved. Changes are live now." },
    );
  };

  const onResumeUpload = async (file: File) => {
    setResumeBusy(true);
    setMessage(null);
    const { url, error } = await uploadAsset(file, `resume/${Date.now()}-${file.name}`);
    if (error || !url) {
      setResumeBusy(false);
      setMessage({ kind: "danger", text: error ?? "Upload failed" });
      return;
    }
    const next = { ...draft, resume: { ...draft.resume, url } };
    setDraft(next);
    // Upload + persist to the database in one step.
    const { error: saveErr } = await saveContent(next);
    setResumeBusy(false);
    setMessage(
      saveErr
        ? { kind: "danger", text: saveErr }
        : { kind: "success", text: "Résumé uploaded and saved." },
    );
  };

  // immutable nested setters
  const setPerson = (patch: Partial<EditableContent["person"]>) =>
    setDraft((d) => ({ ...d, person: { ...d.person, ...patch } }));
  const setHome = (patch: Partial<EditableContent["home"]>) =>
    setDraft((d) => ({ ...d, home: { ...d.home, ...patch } }));
  const setAbout = (patch: Partial<EditableContent["about"]>) =>
    setDraft((d) => ({ ...d, about: { ...d.about, ...patch } }));
  const setResume = (patch: Partial<EditableContent["resume"]>) =>
    setDraft((d) => ({ ...d, resume: { ...d.resume, ...patch } }));

  if (phase === "loading") {
    return (
      <Column fillWidth horizontal="center" paddingY="128">
        <Spinner />
      </Column>
    );
  }

  if (phase === "login") {
    return (
      <Column maxWidth={24} fillWidth horizontal="center" gap="16" paddingY="128">
        <Heading variant="display-strong-xs">Admin</Heading>
        {!isSupabaseConfigured && (
          <Feedback
            variant="warning"
            title="Supabase not configured"
            description="Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable the editor."
          />
        )}
        <form
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: "16px" }}
          onSubmit={(e) => {
            e.preventDefault();
            signIn();
          }}
        >
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            errorMessage={authError}
          />
          <Button type="submit" fillWidth disabled={!isSupabaseConfigured}>
            Sign in
          </Button>
        </form>
      </Column>
    );
  }

  return (
    <Column maxWidth={48} fillWidth horizontal="center" gap="40" paddingY="64">
      <Row fillWidth horizontal="between" vertical="center">
        <Heading variant="display-strong-xs">Edit content</Heading>
        <Row gap="8">
          <Button variant="secondary" size="s" onClick={signOut}>
            Sign out
          </Button>
          <Button size="s" loading={saving} onClick={() => save()}>
            Save
          </Button>
        </Row>
      </Row>

      {message && <Feedback variant={message.kind} description={message.text} />}

      {/* Profile */}
      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-m">
          Profile
        </Heading>
        <Input
          id="name"
          label="Name"
          value={draft.person.name}
          onChange={(e) => setPerson({ name: e.target.value })}
        />
        <Input
          id="role"
          label="Role"
          value={draft.person.role}
          onChange={(e) => setPerson({ role: e.target.value })}
        />
        <Input
          id="location"
          label="Location"
          value={draft.person.location}
          onChange={(e) => setPerson({ location: e.target.value })}
        />
        <ChipInput
          label="Languages"
          value={draft.person.languages}
          onChange={(v) => setPerson({ languages: v })}
        />
      </Column>

      {/* Home */}
      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-m">
          Home page
        </Heading>
        <Input
          id="headline"
          label="Headline"
          value={draft.home.headline}
          onChange={(e) => setHome({ headline: e.target.value })}
        />
        <Textarea
          id="subline"
          label="Subline"
          lines={3}
          value={draft.home.subline}
          onChange={(e) => setHome({ subline: e.target.value })}
        />
        <Select
          id="featured"
          label="Featured project (hero badge)"
          options={projects.map((p) => ({ label: p.title, value: p.slug }))}
          value={draft.home.featuredSlug}
          onSelect={(value) => setHome({ featuredSlug: String(value) })}
        />
        <Text variant="label-default-s" onBackground="neutral-weak">
          Selected Work (home grid)
        </Text>
        <Column fillWidth gap="8">
          {projects.map((p) => {
            const checked = draft.home.selectedSlugs.includes(p.slug);
            return (
              <Checkbox
                key={p.slug}
                label={p.title}
                isChecked={checked}
                onToggle={() =>
                  setHome({
                    selectedSlugs: checked
                      ? draft.home.selectedSlugs.filter((s) => s !== p.slug)
                      : [...draft.home.selectedSlugs, p.slug],
                  })
                }
              />
            );
          })}
        </Column>
      </Column>

      {/* About */}
      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-m">
          About
        </Heading>
        <Textarea
          id="intro"
          label="Intro"
          lines={5}
          value={draft.about.intro}
          onChange={(e) => setAbout({ intro: e.target.value })}
        />
        <ChipInput
          label="Skills"
          value={draft.about.skills}
          onChange={(v) => setAbout({ skills: v })}
        />
      </Column>

      {/* Work experience */}
      <Column fillWidth gap="16">
        <Row fillWidth horizontal="between" vertical="center">
          <Heading as="h2" variant="heading-strong-m">
            Work experience
          </Heading>
          <Button
            size="s"
            variant="secondary"
            onClick={() =>
              setAbout({
                work: [
                  ...draft.about.work,
                  { company: "", role: "", timeframe: "", achievements: [] },
                ],
              })
            }
          >
            Add
          </Button>
        </Row>
        {draft.about.work.map((exp, i) => (
          <Column key={i} fillWidth gap="12" padding="16" radius="m" border="neutral-alpha-medium">
            <Row fillWidth horizontal="between" vertical="center">
              <LogoUpload
                name={exp.company}
                url={exp.logo}
                onChange={(logo) =>
                  setAbout({ work: draft.about.work.map((w, j) => (j === i ? { ...w, logo } : w)) })
                }
              />
              <Button
                size="s"
                variant="danger"
                onClick={() => setAbout({ work: draft.about.work.filter((_, j) => j !== i) })}
              >
                Remove
              </Button>
            </Row>
            <Input
              id={`work-company-${i}`}
              label="Company"
              value={exp.company}
              onChange={(e) =>
                setAbout({
                  work: draft.about.work.map((w, j) =>
                    j === i ? { ...w, company: e.target.value } : w,
                  ),
                })
              }
            />
            <Input
              id={`work-role-${i}`}
              label="Role"
              value={exp.role}
              onChange={(e) =>
                setAbout({
                  work: draft.about.work.map((w, j) =>
                    j === i ? { ...w, role: e.target.value } : w,
                  ),
                })
              }
            />
            <Input
              id={`work-time-${i}`}
              label="Timeframe"
              value={exp.timeframe}
              onChange={(e) =>
                setAbout({
                  work: draft.about.work.map((w, j) =>
                    j === i ? { ...w, timeframe: e.target.value } : w,
                  ),
                })
              }
            />
          </Column>
        ))}
      </Column>

      {/* Education */}
      <Column fillWidth gap="16">
        <Row fillWidth horizontal="between" vertical="center">
          <Heading as="h2" variant="heading-strong-m">
            Education
          </Heading>
          <Button
            size="s"
            variant="secondary"
            onClick={() =>
              setAbout({
                studies: [...draft.about.studies, { name: "", timeframe: "", description: "" }],
              })
            }
          >
            Add
          </Button>
        </Row>
        {draft.about.studies.map((edu, i) => (
          <Column key={i} fillWidth gap="12" padding="16" radius="m" border="neutral-alpha-medium">
            <Row fillWidth horizontal="between" vertical="center">
              <LogoUpload
                name={edu.name}
                url={edu.logo}
                onChange={(logo) =>
                  setAbout({
                    studies: draft.about.studies.map((s, j) => (j === i ? { ...s, logo } : s)),
                  })
                }
              />
              <Button
                size="s"
                variant="danger"
                onClick={() => setAbout({ studies: draft.about.studies.filter((_, j) => j !== i) })}
              >
                Remove
              </Button>
            </Row>
            <Input
              id={`edu-name-${i}`}
              label="Institution"
              value={edu.name}
              onChange={(e) =>
                setAbout({
                  studies: draft.about.studies.map((s, j) =>
                    j === i ? { ...s, name: e.target.value } : s,
                  ),
                })
              }
            />
            <Input
              id={`edu-time-${i}`}
              label="Date"
              value={edu.timeframe}
              onChange={(e) =>
                setAbout({
                  studies: draft.about.studies.map((s, j) =>
                    j === i ? { ...s, timeframe: e.target.value } : s,
                  ),
                })
              }
            />
            <Input
              id={`edu-desc-${i}`}
              label="Description"
              value={edu.description}
              onChange={(e) =>
                setAbout({
                  studies: draft.about.studies.map((s, j) =>
                    j === i ? { ...s, description: e.target.value } : s,
                  ),
                })
              }
            />
          </Column>
        ))}
      </Column>

      {/* Project descriptions */}
      <Column fillWidth gap="16">
        <Heading as="h2" variant="heading-strong-m">
          Project descriptions
        </Heading>
        {projects.map((p) => (
          <Column
            key={p.slug}
            fillWidth
            gap="8"
            padding="16"
            radius="m"
            border="neutral-alpha-medium"
          >
            <Text variant="heading-strong-xs">{p.title}</Text>
            <Textarea
              id={`proj-sum-${p.slug}`}
              label="Summary"
              lines={2}
              value={draft.projects[p.slug]?.summary ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  projects: {
                    ...d.projects,
                    [p.slug]: { ...d.projects[p.slug], summary: e.target.value },
                  },
                }))
              }
            />
          </Column>
        ))}
      </Column>

      {/* Résumé */}
      <Column fillWidth gap="12">
        <Heading as="h2" variant="heading-strong-m">
          Résumé
        </Heading>
        <Switch
          label="Show résumé button"
          isChecked={draft.resume.display}
          onToggle={() => setResume({ display: !draft.resume.display })}
        />
        <Input
          id="resume-label"
          label="Button label"
          value={draft.resume.label}
          onChange={(e) => setResume({ label: e.target.value })}
        />
        <Text variant="label-default-s" onBackground="neutral-weak">
          Current file: {draft.resume.url || "none"}
        </Text>
        <input
          ref={resumeRef}
          type="file"
          accept="application/pdf"
          style={{ display: "none" }}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onResumeUpload(f);
          }}
        />
        <Row gap="8">
          <Button
            size="s"
            variant="secondary"
            prefixIcon="document"
            loading={resumeBusy}
            onClick={() => resumeRef.current?.click()}
          >
            Upload &amp; save PDF
          </Button>
        </Row>
      </Column>

      <Row fillWidth horizontal="end" paddingTop="16">
        <Button loading={saving} onClick={() => save()}>
          Save changes
        </Button>
      </Row>
    </Column>
  );
}
