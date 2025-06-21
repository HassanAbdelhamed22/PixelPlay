export interface Game {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail: {
    formats?: {
      thumbnail?: { url: string };
      url?: string;
    };
    url?: string;
    name: string;
  };
  images?: { url: string; name: string }[] | null;
  developer: string;
  platform: string;
  rating: number;
  releaseDate: string;
  stock: number;
  videoTrailer?: { url: string; name: string } | null;
  genres: { id: string; title: string }[];
}
