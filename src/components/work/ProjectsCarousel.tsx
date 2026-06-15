"use client";

import { Column, IconButton, Row, Text } from "@once-ui-system/core";
import { Children, type ReactNode, useState } from "react";
import styles from "./projectsCarousel.module.scss";

export function ProjectsCarousel({ children }: { children: ReactNode }) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [index, setIndex] = useState(0);

  if (count === 0) return null;

  const active = Math.min(index, count - 1);
  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <Column fillWidth gap="32" paddingX="l" marginBottom="80">
      <div className={styles.viewport}>
        {/* key forces the enter animation to replay on each slide change */}
        <div key={active} className={styles.slide}>
          {slides[active]}
        </div>
      </div>

      {count > 1 && (
        <Row fillWidth horizontal="between" vertical="center" gap="16" wrap>
          <Text variant="label-default-s" onBackground="neutral-weak">
            {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </Text>

          <Row gap="8" vertical="center" horizontal="center">
            {slides.map((_, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: slides are a fixed ordered list
                key={i}
                type="button"
                aria-label={`Go to project ${i + 1}`}
                aria-current={i === active}
                onClick={() => setIndex(i)}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              />
            ))}
          </Row>

          <Row gap="8">
            <IconButton
              icon="arrowLeft"
              size="m"
              variant="secondary"
              tooltip="Previous project"
              onClick={() => go(active - 1)}
            />
            <IconButton
              icon="arrowRight"
              size="m"
              variant="secondary"
              tooltip="Next project"
              onClick={() => go(active + 1)}
            />
          </Row>
        </Row>
      )}
    </Column>
  );
}
