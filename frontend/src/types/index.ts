export interface Game {
  id: number; // or number, depending on your backend
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail: {
    url: string;
    name: string;
  };
  images: {
    url: string;
    name: string;
  }[];
  developer: string;
  platform: string;
  rating: number;
  releaseDate: string; // ISO date string
  stock: number;
  videoTrailer: {
    url: string;
    name: string;
  };
  genres: {
    id: string;
    name: string;
  }[];
}
