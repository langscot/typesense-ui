import SyntaxHighlighter from "react-syntax-highlighter";

export function Code({ content }: { content: string }) {
  return (
    <SyntaxHighlighter
      language="json"
      wrapLines
      wrapLongLines
      className="rounded-md overflow-x-auto"
      showLineNumbers
    >
      {JSON.stringify(content, null, 4)}
    </SyntaxHighlighter>
  );
}
