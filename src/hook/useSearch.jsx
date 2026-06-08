import { useState, useEffect, useMemo } from "react";

/**
 * useSearch — Hook tái sử dụng cho cả search local & API
 *
 * @param {Array} data - Dữ liệu local (nếu có)
 * @param {string} keyword - Từ khóa người dùng nhập
 * @param {number} limit - Giới hạn kết quả
 * @param {string[]} fields - Danh sách field để tìm kiếm trong local
 * @param {number} delay - Thời gian debounce (ms)
 * @param {string|null} apiUrl - URL API (nếu muốn search qua backend)
 */
export function useSearch(
  data = [],
  keyword = "",
  limit = 10,
  fields = [],
  delay = 300,
  apiUrl = null
) {
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // ⏳ Debounce keyword
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedKeyword(keyword), delay);
    return () => clearTimeout(timer);
  }, [keyword, delay]);

  // 🌐 Nếu có apiUrl → dùng fetch API
  useEffect(() => {
    if (!apiUrl || !debouncedKeyword) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${apiUrl}?q=${debouncedKeyword}`, { signal });
        if (!res.ok) throw new Error("Fetch thất bại");
        const json = await res.json();
        setResults(json.slice(0, limit));
      } catch (err) {
        if (err.name === "AbortError") {
          console.log("🔹 Request bị huỷ:", debouncedKeyword);
        } else {
          console.error("❌ Search error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    search();

    // 🧹 Cleanup: huỷ request nếu keyword đổi hoặc component unmount
    return () => controller.abort();
  }, [debouncedKeyword, apiUrl, limit]);

  // 🔍 Nếu không có apiUrl → dùng local search với useMemo
  const localResults = useMemo(() => {
    if (!debouncedKeyword) return data.slice(0, limit);

    const lower = debouncedKeyword.toLowerCase();
    const filtered = data.filter((item) => {
      if (fields.length === 0)
        return JSON.stringify(item).toLowerCase().includes(lower);

      return fields.some((field) =>
        String(item[field] || "")
          .toLowerCase()
          .includes(lower)
      );
    });

    return filtered.slice(0, limit);
  }, [data, debouncedKeyword, fields, limit]);

  // ✅ Chọn kết quả phù hợp
  const finalResults = apiUrl ? results : localResults;

  return { results: finalResults, loadingSearch: loading };
}
