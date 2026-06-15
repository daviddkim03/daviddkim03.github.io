import { getPosts } from "@/utils/utils";
import { Column, Heading, Media, Row, SmartLink, Text } from "@once-ui-system/core";
import styles from "./selectedWork.module.scss";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function SelectedWork({ count = 2 }: { count?: number }) {
  const projects = getPosts(["src", "app", "work", "projects"])
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime(),
    )
    .slice(0, count);

  if (projects.length === 0) return null;

  return (
    <Column fillWidth gap="24" paddingX="l" marginBottom="80">
      <Row fillWidth horizontal="between" vertical="center" gap="16">
        <Heading as="h2" variant="heading-strong-l">
          Selected Work
        </Heading>
        <SmartLink href="/work" suffixIcon="arrowRight" style={{ width: "fit-content" }}>
          <Text variant="label-default-s" onBackground="neutral-weak">
            View all
          </Text>
        </SmartLink>
      </Row>

      <Row fillWidth gap="24" s={{ direction: "column" }}>
        {projects.map((post) => (
          <Column key={post.slug} flex={1} fillWidth style={{ minWidth: 0 }}>
            <SmartLink href={`/work/${post.slug}`} style={{ width: "100%" }}>
              <Column className={styles.card} fillWidth gap="12">
                <Media
                  border="neutral-alpha-weak"
                  radius="l"
                  aspectRatio="16 / 9"
                  sizes="(max-width: 960px) 100vw, 50vw"
                  src={post.metadata.images[0]}
                  alt={post.metadata.title}
                />
                <Column gap="4" paddingX="4">
                  <Text variant="heading-strong-s" onBackground="neutral-strong">
                    {post.metadata.title}
                  </Text>
                  <Text variant="label-default-s" onBackground="neutral-weak">
                    {formatDate(post.metadata.publishedAt)}
                  </Text>
                </Column>
              </Column>
            </SmartLink>
          </Column>
        ))}
      </Row>
    </Column>
  );
}
