export interface Game {
  id: number;
  documentId?: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  thumbnail:
    | {
        id?: number; 
        formats?: {
          thumbnail?: { url: string };
          url?: string;
        };
        url?: string;
        name: string;
      }
    | File
    | null; // Allow null
  images: (File | { id?: number; url: string; name: string })[];
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
