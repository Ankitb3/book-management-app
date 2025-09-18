export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: string;
  createdAt: any
}

export type BookFormData = {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
  status: string;
};