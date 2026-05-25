import type { ReactNode } from "react";

const mentionSearchRegex = /(?:^|\s)@([a-zA-Z0-9-]{2,40})$/;
const mentionRenderRegex = /(@[a-zA-Z0-9-]{3,40})/g;
const mentionExactRegex = /^@[a-zA-Z0-9-]{3,40}$/;

export function getMentionQuery(content: string): string {
  const match = content.match(mentionSearchRegex);

  return match ? match[1] : "";
}

export function insertMention(content: string, username: string): string {
  return content.replace(mentionSearchRegex, (match) => {
    const prefix = match.startsWith(" ") ? " " : "";

    return `${prefix}@${username} `;
  });
}

export function renderContentWithMentions(content: string): ReactNode {
  return content.split(mentionRenderRegex).map((part, index) => {
    const isMention = mentionExactRegex.test(part);

    if (!isMention) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span key={`${part}-${index}`} className="font-semibold text-sky-200/80">
        {part}
      </span>
    );
  });
}
