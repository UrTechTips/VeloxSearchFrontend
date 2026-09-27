"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import styles from "./page.module.scss";
import CodeBlock from "@/components/CodeBlock/CodeBlock.component";
import { toast } from "react-toastify/unstyled";

interface FilterRow {
  id: number;
  key: string;
  value: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Maps the endpoint picker to a path. Only one option today, but keeps
// handleRequest from needing changes when a second endpoint is added.
const ENDPOINT_PATHS: Record<string, string> = {
  search: "/search/query",
};

const Playground = () => {
  const [endpoint, setEndpoint] = useState("search");
  const [apiKey, setApiKey] = useState("");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState("10"); // string-backed so the field can be cleared while typing
  const [filters, setFilters] = useState<FilterRow[]>([]);
  const [response, setResponse] = useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const nextFilterId = useRef(0);
  const parsedLimit = Number(limit) || 10;

  function coerceFilterValue(raw: string): string | number | boolean {
    const trimmed = raw.trim();
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (trimmed !== "" && !Number.isNaN(Number(trimmed))) return Number(trimmed);
    return raw;
  }

  const filtersPayload = useMemo(() => {
    return filters.reduce<Record<string, string | number | boolean>>((acc, filter) => {
      const key = filter.key.trim();
      if (key) acc[key] = coerceFilterValue(filter.value);
      return acc;
    }, {});
  }, [filters]);

  const handleRequest = useCallback(async () => {
    console.log("Sending request with:", { endpoint, apiKey, query, parsedLimit, filtersPayload });
    if (!apiKey.trim()) {
      toast.error("Please enter an API key.");
      return;
    }
    if (!query.trim()) {
      toast.error("Please enter a search query.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${BACKEND_URL}${ENDPOINT_PATHS[endpoint]}?query=${encodeURIComponent(query)}&limit=${parsedLimit}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ query, filters: filtersPayload }),
        }
      );
      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.error || "API request failed. Please try again later.");
      }
      setResponse(data);
    } catch (error) {
      console.error("Error making API request:", error);
      toast.error("Error making API request. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, query, parsedLimit, endpoint, filtersPayload]);

  const handleAddFilter = () => {
    setFilters((prev) => [...prev, { id: nextFilterId.current++, key: "", value: "" }]);
  };

  const handleRemoveFilter = (id: number) => {
    setFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const handleFilterChange = (id: number, field: "key" | "value", value: string) => {
    setFilters((prev) => prev.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  return (
    <div className={styles.container}>
      <div className={styles.playground}>
        <div className={styles.requestUi}>
          <h1>Playground</h1>
          <p className={styles.subtitle}>Test your API endpoints here!</p>

          <div className={styles.requestForm}>
            <label className={styles.field}>
              <span>Endpoint</span>
              <select value={endpoint} onChange={(e) => setEndpoint(e.target.value)} disabled={isLoading}>
                <option value="search">Search</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>API Key</span>
              <input
                type="password"
                placeholder="sk-..."
                autoComplete="off"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isLoading}
              />
            </label>

            <label className={styles.field}>
              <span>Query</span>
              <input
                type="text"
                placeholder="What are you searching for?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
              />
            </label>

            <label className={styles.field}>
              <span>Limit</span>
              <input
                type="number"
                min={1}
                placeholder="10"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                disabled={isLoading}
              />
            </label>

            {filters.length > 0 && (
              <div className={styles.filters}>
                {filters.map((filter) => (
                  <div key={filter.id} className={styles.filter}>
                    <input
                      type="text"
                      placeholder="Filter Key"
                      value={filter.key}
                      onChange={(e) => handleFilterChange(filter.id, "key", e.target.value)}
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      placeholder="Filter Value"
                      value={filter.value}
                      onChange={(e) => handleFilterChange(filter.id, "value", e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className={styles.removeFilter}
                      onClick={() => handleRemoveFilter(filter.id)}
                      disabled={isLoading}
                      aria-label="Remove filter"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="button" onClick={handleAddFilter} disabled={isLoading}>
              Add Filter
            </button>
            <button type="button" onClick={handleRequest} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Request"}
            </button>
          </div>
        </div>

        <div className={styles.code}>
          <h1>Code snippet</h1>
          <p className={styles.subtitle}>Copy and use this code in your project</p>

          <div className={styles.codeSnippet}>
            <CodeBlock apiKey={apiKey} query={query} limit={parsedLimit} filters={filtersPayload} response={response} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;