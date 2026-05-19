export type Category =
  | "Todo"
  | "Desarrollo"
  | "Ciberseguridad"
  | "DevOps"
  | "Datos"
  | "Cloud";

export type CareerItem = {
  title: string;
  desc: string;
  meta: string;
  image: string;
  tag: string;
  tagColor: string;
};

export type ListItem = CareerItem & { id: string };

export type Highlight = {
  id: string;
  title: string;
  image: string;
  color: string;
};

export type CatData = {
  sectionTitle: string;
  highlights: Highlight[];
  items: ListItem[];
};
