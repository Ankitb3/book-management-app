import { useContext } from "react";
import { BookContext } from "../context/BooksContext";

export const useBooks = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};