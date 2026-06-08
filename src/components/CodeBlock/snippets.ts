const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export type Language = "javascript" | "typescript" | "python" | "curl" | "go" | "ruby";

export const LANGUAGE_LABELS: Record<Language, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  curl: "cURL",
  go: "Go",
  ruby: "Ruby",
};

// hljs has no 'curl' grammar — bash gives the closest highlighting
export const HLJS_LANGUAGE_MAP: Record<Language, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  curl: "bash",
  go: "go",
  ruby: "ruby",
};

export function buildSnippet(
  language: Language,
  apiKey: string,
  query: string,
  limit: number
): string {
  const base = `${BACKEND_URL}/search/query`;
  const url = `${base}?query=${encodeURIComponent(query)}&limit=${limit}`;
  const auth = `Bearer ${apiKey}`;

  switch (language) {
    case "javascript":
      return `const response = await fetch("${url}", {
  headers: {
    "Authorization": "${auth}"
  }
});
const data = await response.json();
console.log(data);`;

    case "typescript":
      return `interface SearchResult {
  // define your result shape here
  [key: string]: unknown;
}

const response = await fetch("${url}", {
  headers: {
    "Authorization": \`${auth}\`
  }
});
const data: SearchResult = await response.json();
console.log(data);`;

    case "python":
      return `import requests

response = requests.get(
    "${base}",
    params={"query": "${query}", "limit": ${limit}},
    headers={"Authorization": "${auth}"}
)
print(response.json())`;

    case "curl":
      return `curl "${url}" \\
  -H "Authorization: ${auth}"`;

    case "go":
      return `package main

import (
\t"fmt"
\t"io"
\t"net/http"
)

func main() {
\treq, _ := http.NewRequest(http.MethodGet, "${url}", nil)
\treq.Header.Set("Authorization", "${auth}")

\tclient := &http.Client{}
\tresp, _ := client.Do(req)
\tdefer resp.Body.Close()

\tresult, _ := io.ReadAll(resp.Body)
\tfmt.Println(string(result))
}`;

    case "ruby":
      return `require "net/http"
require "json"

uri = URI("${url}")
http = Net::HTTP.new(uri.host, uri.port)
http.use_ssl = uri.scheme == "https"

request = Net::HTTP::Get.new(uri)
request["Authorization"] = "${auth}"

response = http.request(request)
puts JSON.parse(response.body)`;
  }
}