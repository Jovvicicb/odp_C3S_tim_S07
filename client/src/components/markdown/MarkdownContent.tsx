import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
};

export function MarkdownContent({ content }: Props) {
  return (
    <div className="space-y-4 text-sm leading-7 text-white/65">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mb-4 mt-1 text-3xl font-bold tracking-tight text-white">
              {children}
            </h1>
          ),

          h2: ({ children }) => (
            <h2 className="mb-3 mt-6 text-2xl font-bold tracking-tight text-white">
              {children}
            </h2>
          ),

          h3: ({ children }) => (
            <h3 className="mb-2 mt-5 text-xl font-semibold tracking-tight text-white">
              {children}
            </h3>
          ),

          h4: ({ children }) => (
            <h4 className="mb-2 mt-4 text-base font-semibold text-white">
              {children}
            </h4>
          ),

          p: ({ children }) => (
            <p className="text-sm leading-7 text-white/65">{children}</p>
          ),

          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),

          em: ({ children }) => (
            <em className="italic text-white/75">{children}</em>
          ),

          ul: ({ children }) => (
            <ul className="ml-5 list-disc space-y-1 text-sm text-white/65">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="ml-5 list-decimal space-y-1 text-sm text-white/65">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="pl-1 leading-7 marker:text-sky-300/70">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="rounded-r-2xl border-l-4 border-sky-300/40 bg-sky-400/5 px-4 py-3 text-sm italic text-white/55">
              {children}
            </blockquote>
          ),

          hr: () => <hr className="border-white/10" />,

          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-sky-300 underline decoration-sky-300/30 underline-offset-4 transition-colors hover:text-sky-200"
            >
              {children}
            </a>
          ),

          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");

            if (isBlock) {
              return (
                <code className="block whitespace-pre text-xs leading-6 text-sky-100">
                  {children}
                </code>
              );
            }

            return (
              <code className="rounded-lg border border-white/10 bg-white/10 px-1.5 py-0.5 text-xs font-semibold text-sky-100">
                {children}
              </code>
            );
          },

          pre: ({ children }) => (
            <pre className="overflow-x-auto rounded-2xl border border-white/10 bg-[#07111f] p-4 shadow-inner shadow-black/20">
              {children}
            </pre>
          ),

          table: ({ children }) => (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-white/4 text-white">{children}</thead>
          ),

          th: ({ children }) => (
            <th className="border-b border-white/10 px-4 py-3 text-xs font-bold uppercase tracking-wide text-white/70">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-white/5 px-4 py-3 text-white/60">
              {children}
            </td>
          ),

          input: (props) => (
            <input
              {...props}
              disabled
              className="mr-2 align-middle accent-sky-400"
            />
          ),

          img: ({ src, alt }) => (
            <img
              src={src ?? ""}
              alt={alt ?? "Markdown image"}
              className="max-h-105 w-full rounded-2xl border border-white/10 object-cover"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
