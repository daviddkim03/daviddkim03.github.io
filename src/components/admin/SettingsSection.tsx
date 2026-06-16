"use client";

import {
  CLAUDE_MODELS,
  DEFAULT_CLAUDE_MODEL,
  getClaudeKey,
  getClaudeModel,
  setClaudeKey,
  setClaudeModel,
} from "@/lib/claudeKey";
import { Button, Column, Heading, PasswordInput, Row, Select, Text } from "@once-ui-system/core";
import { useEffect, useState } from "react";

/**
 * Settings for the AI cover generator. The Claude API key is stored only in
 * this browser (localStorage) and is sent only to api.anthropic.com.
 */
export function SettingsSection({ onSaved }: { onSaved?: () => void }) {
  const [key, setKey] = useState("");
  const [model, setModel] = useState(DEFAULT_CLAUDE_MODEL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getClaudeKey());
    setModel(getClaudeModel());
  }, []);

  const save = () => {
    setClaudeKey(key);
    setClaudeModel(model);
    setSaved(true);
    onSaved?.();
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <Column fillWidth gap="16">
      <Heading as="h2" variant="heading-strong-m">
        Settings — AI cover generator
      </Heading>
      <Text variant="body-default-s" onBackground="neutral-weak">
        Add a Claude API key to auto-generate project cover images. The key is stored only in this
        browser and is sent only to api.anthropic.com — never to the database or git. Get one at
        console.anthropic.com.
      </Text>
      <PasswordInput
        id="claude-key"
        label="Claude API key"
        value={key}
        onChange={(e) => setKey(e.target.value)}
      />
      <Select
        id="claude-model"
        label="Model"
        options={CLAUDE_MODELS}
        value={model}
        onSelect={(value) => setModel(String(value))}
      />
      <Row gap="12" vertical="center">
        <Button size="s" variant="secondary" onClick={save}>
          Save key
        </Button>
        {saved && (
          <Text variant="label-default-s" onBackground="brand-weak">
            Saved in this browser.
          </Text>
        )}
      </Row>
    </Column>
  );
}
