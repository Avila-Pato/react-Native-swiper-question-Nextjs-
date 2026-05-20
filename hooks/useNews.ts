import { getTopHeadlines } from "@/lib/NewsApi";
import { NewsArticle, NewsCategory } from "@/types/news";
import { useEffect, useState } from "react";

const TTL_MS = 10 * 60 * 1000;

type CacheEntry = { articles: NewsArticle[]; fetchedAt: number };
const cache: Record<string, CacheEntry> = {};

// Requests en vuelo — misma clave comparte la misma promesa
const inflight: Record<string, Promise<NewsArticle[]>> = {};

function buildKey(category: NewsCategory, keywords?: string, sort?: string) {
  return `${category}:${keywords ?? ""}:${sort ?? "published_desc"}`;
}

function getCached(key: string): NewsArticle[] | null {
  const entry = cache[key];
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
  const key = buildKey(category, keywords, sort);
  const cached = getCached(key);

  const [state, setState] = useState<State>({
    articles: cached ?? [],
    loading: cached === null,
    error: null,
  });

  useEffect(() => {
    if (getCached(key)) return;

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));

    // Si ya hay un request en vuelo para esta clave, reutilizarlo
    if (!inflight[key]) {
      inflight[key] = getTopHeadlines(category, 20, keywords, sort).then(
        (articles) => {
          const seen = new Set<string>();
          const filtered = articles.filter((a) => {
            if (!a.urlToImage || seen.has(a.url)) return false;
            seen.add(a.url);
            return true;
          });
          cache[key] = { articles: filtered, fetchedAt: Date.now() };
          delete inflight[key];
          return filtered;
        }
      ).catch((e) => {
        delete inflight[key];
        throw e;
      });
    }

    inflight[key]
      .then((articles) => {
        if (!cancelled)
          setState({ articles: getCached(key) ?? articles, loading: false, error: null });
      })
      .catch((e) => {
        if (!cancelled)
          setState({ articles: [], loading: false, error: e.message ?? "Error al cargar noticias" });
      });

    return () => { cancelled = true; };
  }, [key]);

  return state;
}
