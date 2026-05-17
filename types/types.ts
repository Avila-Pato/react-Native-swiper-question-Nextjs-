export type Currency = {
  currency: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  textColor: string;
};

export type CardItem = {
  uri: string;
  title: string;
};

export type Opcion = {
  texto: string;
  puntos: Record<string, number>;
  siguienteNodo: string;
};

export type GameNode = {
  texto: string;
  opciones: Opcion[];
  image: string;
};

export type GameData = Record<string, GameNode>;

export type PerfilPoints = Record<string, number>;