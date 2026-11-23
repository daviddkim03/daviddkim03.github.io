/**
 * Minimal client for the GitHub Contents API, used by `/admin` to commit
 * content changes straight to the repo (which triggers a deploy).
 */
const API = "https://api.github.com/repos/daviddkim03/daviddkim03.github.io";
const BRANCH = "main";

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

const MESSAGES: Record<number, string> = {
  401: "That token is invalid or has expired.",
  403: "That token can't write to this repository.",
  404: "That token doesn't have access to this repository.",
  409: "The content changed since you loaded it. Reload the page and try again.",
  422: "The content changed since you loaded it. Reload the page and try again.",
};

async function request(token: string, path: string, init?: RequestInit) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  if (!response.ok) {
    throw new GitHubError(
      MESSAGES[response.status] ?? `GitHub returned an error (${response.status}).`,
      response.status,
    );
  }
  return response.json();
}

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  // Chunked: spreading a whole file would overflow the argument limit.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

/** Fails unless the token can read and push to the repo. */
export async function assertWriteAccess(token: string): Promise<void> {
  const repo = await request(token, "");
  if (!repo.permissions?.push) throw new GitHubError(MESSAGES[403], 403);
}

export async function readText(
  token: string,
  path: string,
): Promise<{ text: string; sha: string }> {
  const file = await request(token, `/contents/${path}?ref=${BRANCH}`);
  const bytes = Uint8Array.from(atob(file.content.replace(/\s/g, "")), (c) => c.charCodeAt(0));
  return { text: new TextDecoder().decode(bytes), sha: file.sha };
}

/** The file's current blob sha, or undefined when it doesn't exist yet. */
export async function findSha(token: string, path: string): Promise<string | undefined> {
  try {
    return (await request(token, `/contents/${path}?ref=${BRANCH}`)).sha;
  } catch (error) {
    if (error instanceof GitHubError && error.status === 404) return undefined;
    throw error;
  }
}

/** Commits a file and returns its new sha. */
export async function writeFile(
  token: string,
  path: string,
  content: string | Uint8Array,
  message: string,
  sha?: string,
): Promise<string> {
  const bytes = typeof content === "string" ? new TextEncoder().encode(content) : content;
  const result = await request(token, `/contents/${path}`, {
    method: "PUT",
    body: JSON.stringify({ message, branch: BRANCH, content: toBase64(bytes), sha }),
  });
  return result.content.sha;
}
