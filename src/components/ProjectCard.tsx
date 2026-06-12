"use client";

import { Carousel, Column, Flex, Heading, SmartLink, Text } from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  images = [],
  title,
  content,
  description,
  link,
}) => {
  return (
    <Flex fillWidth gap="l" vertical="center" s={{ direction: "column" }}>
      {images.length > 0 && (
        <Flex flex={5} fillWidth style={{ minWidth: 0 }}>
          <Carousel
            sizes="(max-width: 960px) 100vw, 420px"
            items={images.map((image) => ({
              slide: image,
              alt: title,
            }))}
          />
        </Flex>
      )}
      <Column flex={7} gap="16" paddingX="s" paddingY="12">
        {title && (
          <Heading as="h2" wrap="balance" variant="heading-strong-l">
            {title}
          </Heading>
        )}
        {description?.trim() && (
          <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}
        {(content?.trim() || link) && (
          <Flex gap="24" wrap>
            {content?.trim() && (
              <SmartLink
                suffixIcon="arrowRight"
                style={{ margin: "0", width: "fit-content" }}
                href={href}
              >
                <Text variant="body-default-s">Read case study</Text>
              </SmartLink>
            )}
            {link && (
              <SmartLink
                suffixIcon="arrowUpRightFromSquare"
                style={{ margin: "0", width: "fit-content" }}
                href={link}
              >
                <Text variant="body-default-s">View project</Text>
              </SmartLink>
            )}
          </Flex>
        )}
      </Column>
    </Flex>
  );
};
