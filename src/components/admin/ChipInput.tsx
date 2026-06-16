"use client";

import { Button, Column, IconButton, Input, Row, Text } from "@once-ui-system/core";
import { useState } from "react";

/** Add/remove a list of string "chips" (used for skills, languages, tech). */
export function ChipInput({
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
