export type NewsArticle = {
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  source: { name: string };
  author: string | null;
};

export type NewsCategory =
  | "technology"
  | "science"
  | "business"
  | "general";
