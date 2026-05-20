import { getTopHeadlines } from "@/lib/NewsApi";
import { NewsArticle, NewsCategory } from "@/types/news";
import { useEffect, useState } from "react";

const TTL_MS = 10 * 60 * 1000;

type CacheEntry = { articles: NewsArticle[]; fetchedAt: number };
const cache: Record<string, CacheEntry> = {};

function cacheKey(category: NewsCategory, keywords?: string, sort?: string) {
  return `${category}:${keywords ?? ""}:${sort ?? "published_desc"}`;
}

function getCached(category: NewsCategory, keywords?: string, sort?: string): NewsArticle[] | null {
  const entry = cache[cacheKey(category, keywords, sort)];
  if (!entry) return null;
  if (Date.now() - entry.fetchedAt > TTL_MS) return null;
  return entry.articles;
}

type State = { articles: NewsArticle[]; loading: boolean; error: string | null };

export function useNews(
  category: NewsCategory = "technology",
  keywords?: string,
  sort: "published_desc" | "popularity" = "published_desc"
) {
  const cached = getCached(category, keywords, sort);

  const [state, setState] = useState<State>({
    articles: cached ?? [],
    loading: cached === null,
    error: null,
  });

  useEffect(() => {
    if (getCached(category, keywords, sort)) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    getTopHeadlines(category, 20, keywords, sort)
      .then((articles) => {
        const seen = new Set<string>();
        const filtered = articles.filter((a) => {
          if (!a.urlToImage || seen.has(a.url)) return false;
          seen.add(a.url);
          return true;
        });
        cache[cacheKey(category, keywords, sort)] = { articles: filtered, fetchedAt: Date.now() };
        if (!cancelled) setState({ articles: filtered, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled)
          setState({ articles: [], loading: false, error: e.message ?? "Error al cargar noticias" });
      });

    return () => { cancelled = true; };
  }, [category, keywords, sort]);

  return state;
}
