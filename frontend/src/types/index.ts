export interface Game {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail: {
    id?: number;
    formats?: {
      large?: { url: string };
      medium?: { url: string };
      small?: { url: string };
      url?: string;
    } | null;
    url?: string;
    name: string;
  };
  images: (File | { id?: number; url: string; name: string })[] | null;
  developer: string;
  platform: string;
  rating: number;
  releaseDate: string;
  stock: number;
  videoTrailer: File | { id?: number; url: string; name: string } | null;
  genres: { id: string; title: string }[];
}

export interface Genre {
  id: string;
  title: string;
}
