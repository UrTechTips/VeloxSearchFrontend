"use client"

import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import { useCallback, useMemo, useState } from "react";
import styles from "./CodeBlock.module.scss";

import {
  buildSnippet,
  HLJS_LANGUAGE_MAP,
  LANGUAGE_LABELS,
  type Language,
} from "./snippets";

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("go", go);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("bash", bash); // used for cURL

interface CodeBlockProps {
  apiKey: string;
  query: string;
  limit: number;
  response: null | Record<string, any>;
}

const CodeBlock = ({ apiKey, query, limit, response }: CodeBlockProps) => {
  const [language, setLanguage] = useState<Language>("javascript");
  const [copied, setCopied] = useState(false);

  const snippet = useMemo(
    () => buildSnippet(language, apiKey, query, limit),
    [language, apiKey, query, limit]
  );

  // Highlight the raw snippet string directly — no DOM scanning, no stale state
  const highlightedCode = useMemo(
    () => hljs.highlight(snippet, { language: HLJS_LANGUAGE_MAP[language] }).value,
    [snippet, language]
  );

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [snippet]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <select
          className={styles.select}
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
        >
          {(Object.entries(LANGUAGE_LABELS) as [Language, string][]).map(
            ([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            )
          )}
        </select>

        <button
          className={`${styles.copyButton} ${copied ? styles.copied : ""}`}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <pre className={styles.code}>
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>

      {response && (
        <div className={styles.response}>
          <h3>API Response:</h3>
          <pre>
            <code>
              {JSON.stringify(response, null, 2)}
            </code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeBlock;