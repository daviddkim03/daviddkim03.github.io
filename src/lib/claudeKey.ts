/**
 * Browser-only storage for the Claude API key + model used by the admin's
 * cover-image generator. The key lives in localStorage on the admin device and
 * is sent only to api.anthropic.com — it is never written to Supabase or git.
 */

const KEY_STORAGE = "dkport.claudeApiKey";
const MODEL_STORAGE = "dkport.claudeModel";

export interface ClaudeModelOption {
  value: string;
  label: string;
}

/** Selectable Claude models (newest IDs). Users can pick by speed/quality. */
export const CLAUDE_MODELS: ClaudeModelOption[] = [
  { value: "claude-opus-4-8", label: "Opus 4.8 — best quality" },
  { value: "claude-sonnet-4-6", label: "Sonnet 4.6 — balanced (recommended)" },
  { value: "claude-haiku-4-5-20251001", label: "Haiku 4.5 — fastest / cheapest" },
];

export const DEFAULT_CLAUDE_MODEL = "claude-sonnet-4-6";

export function getClaudeKey(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(KEY_STORAGE) ?? "";
}

export function setClaudeKey(key: string): void {
  if (typeof window === "undefined") return;
  const trimmed = key.trim();
  if (trimmed) window.localStorage.setItem(KEY_STORAGE, trimmed);
  else window.localStorage.removeItem(KEY_STORAGE);
}

export function getClaudeModel(): string {
  if (typeof window === "undefined") return DEFAULT_CLAUDE_MODEL;
  return window.localStorage.getItem(MODEL_STORAGE) ?? DEFAULT_CLAUDE_MODEL;
}

export function setClaudeModel(model: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(MODEL_STORAGE, model);
}

export function hasClaudeKey(): boolean {
  return getClaudeKey().length > 0;
}
