import { NewsArticle, NewsCategory } from "@/types/news";
import axios from "axios";

const CATEGORY_MAP: Record<NewsCategory, string> = {
  technology: "technology",
  science:    "science",
  business:   "business",
  general:    "general",
};

const mediastack = axios.create({
  baseURL: "http://api.mediastack.com/v1",
  timeout: 10000,
});

mediastack.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("[NewsApi error]", err?.response?.status, err?.message);
    return Promise.reject(err);
  }
);

export const getTopHeadlines = async (
  category: NewsCategory = "technology",
  limit = 20,
  keywords?: string,
  sort: "published_desc" | "popularity" = "published_desc"
): Promise<NewsArticle[]> => {
  const { data } = await mediastack.get("/news", {
    params: {
      access_key: process.env.EXPO_PUBLIC_MEDIASTACK_KEY,
      categories: CATEGORY_MAP[category],
      languages: "es",
      limit,
      sort,
      ...(keywords ? { keywords } : {}),
    },
  });

  return (data.data ?? [])
    .filter((item: any) => item.image)
    .map((item: any): NewsArticle => ({
      title: item.title,
      description: item.description ?? null,
      url: item.url,
      urlToImage: item.image ?? null,
      publishedAt: item.published_at,
      source: { name: item.source ?? "MediaStack" },
      author: item.author ?? null,
    }));
};
