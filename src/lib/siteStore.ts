import { defaultContent, type EditableContent } from "@/lib/content";

/**
 * Live site content in Firestore, over its REST API so visitors don't download
 * the Firebase SDK. Reads are public; `firestore.rules` limits writes to the
 * admin account. The web API key identifies the project and is not a secret.
 */
const PROJECT = "dkim-portfolio-8689bc";
const API_KEY = "AIzaSyDfyM9yaJWHRqd-qeVAUCQM5lyK5qz2A8M";
const ADMIN_EMAIL = "admin@daviddkim03.github.io";
const DOCS = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents/site`;

/** An error whose message can be shown to the admin. */
export class StoreError extends Error {}

/** The parts of the content that `/admin` edits; the rest comes from the code. */
type StoredContent = Pick<EditableContent, "person" | "about" | "resume"> & {
  home: Pick<EditableContent["home"], "headline" | "subline">;
};

export interface LiveContent {
  content: EditableContent;
  /** Whether a résumé uploaded in `/admin` replaces the one in the repo. */
  resumeUploaded: boolean;
  /** Firestore update time, or undefined before the first save. */
  version?: string;
}

interface FirestoreDoc {
  updateTime: string;
  fields?: {
    json?: { stringValue: string };
    resumeUploaded?: { booleanValue: boolean };
  };
}

function merge(stored: StoredContent): EditableContent {
  return {
    ...defaultContent,
    person: stored.person,
    about: stored.about,
    resume: stored.resume,
    home: { ...defaultContent.home, ...stored.home },
  };
}

function toLive(doc: FirestoreDoc): LiveContent {
  const json = doc.fields?.json?.stringValue;
  return {
    content: json ? merge(JSON.parse(json)) : defaultContent,
    resumeUploaded: doc.fields?.resumeUploaded?.booleanValue ?? false,
    version: doc.updateTime,
  };
}

export async function loadContent(): Promise<LiveContent> {
  const response = await fetch(`${DOCS}/content`, { cache: "no-store" });
  if (response.status === 404) return { content: defaultContent, resumeUploaded: false };
  if (!response.ok) throw new StoreError("Couldn't load the site content.");
  return toLive(await response.json());
}

export async function loadResume(): Promise<Blob> {
  const response = await fetch(`${DOCS}/resume`);
  if (!response.ok) throw new StoreError("Couldn't load the résumé.");
  const doc = await response.json();
  const bytes = Uint8Array.from(atob(doc.fields.pdf.bytesValue), (c) => c.charCodeAt(0));
  return new Blob([bytes], { type: "application/pdf" });
}

/** Signs in and returns a refresh token. */
export async function signIn(password: string): Promise<string> {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password, returnSecureToken: true }),
    },
  );
  const data = await response.json();
  if (response.ok) return data.refreshToken;

  const code: string = data.error?.message ?? "";
  if (code.startsWith("TOO_MANY_ATTEMPTS")) {
    throw new StoreError("Too many attempts. Wait a few minutes and try again.");
  }
  if (code.startsWith("INVALID")) throw new StoreError("Wrong password.");
  throw new StoreError("Couldn't sign in. Try again.");
}

async function idToken(refreshToken: string): Promise<string> {
  const response = await fetch(`https://securetoken.googleapis.com/v1/token?key=${API_KEY}`, {
    method: "POST",
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  if (!response.ok) throw new StoreError("Your session ended. Sign in again.");
  return (await response.json()).id_token;
}

async function write(
  refreshToken: string,
  doc: string,
  fields: object,
  query: Record<string, string> = {},
): Promise<FirestoreDoc> {
  const params = new URLSearchParams(query);
  for (const field of Object.keys(fields)) params.append("updateMask.fieldPaths", field);
  const response = await fetch(`${DOCS}/${doc}?${params}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${await idToken(refreshToken)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields }),
  });
  if (response.ok) return response.json();

  const status = (await response.json()).error?.status;
  // A failed precondition: the document isn't the version that was loaded.
  if (["FAILED_PRECONDITION", "ALREADY_EXISTS", "NOT_FOUND", "ABORTED"].includes(status)) {
    throw new StoreError("The content changed since you loaded it. Reload and try again.");
  }
  if (status === "PERMISSION_DENIED") throw new StoreError("This account can't edit the site.");
  throw new StoreError("Couldn't save. Try again.");
}

/** Saves over the given version and returns the new one. */
export async function saveContent(
  refreshToken: string,
  content: EditableContent,
  version?: string,
): Promise<string> {
  const { person, about, resume, home } = content;
  const stored: StoredContent = {
    person,
    about,
    resume,
    home: { headline: home.headline, subline: home.subline },
  };
  const doc = await write(
    refreshToken,
    "content",
    { json: { stringValue: JSON.stringify(stored) } },
    version ? { "currentDocument.updateTime": version } : { "currentDocument.exists": "false" },
  );
  return doc.updateTime;
}

/** Replaces the résumé and returns the content document's new version. */
export async function saveResume(refreshToken: string, bytes: Uint8Array): Promise<string> {
  let binary = "";
  // Chunked: spreading a whole file would overflow the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  await write(refreshToken, "resume", { pdf: { bytesValue: btoa(binary) } });
  const doc = await write(refreshToken, "content", { resumeUploaded: { booleanValue: true } });
  return doc.updateTime;
}
