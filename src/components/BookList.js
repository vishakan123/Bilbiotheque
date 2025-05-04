import React from 'react';
import BookCard from './BookCard';
import './BookList.css';
import { Livre } from '../App'; // Importe le type Livre depuis App

interface BookListProps {
  books: Livre[];
  onToggleWishlist: (bookId: number) => void; // ID est number maintenant
  onDeleteBook: (bookId: number) => void; // ID est number
}

function BookList({ books, onToggleWishlist, onDeleteBook }: BookListProps) {
  return (
    <div className="book-list">
      {books.length === 0 ? (
         null // Message géré par App
      ) : (
        books.map((book) => (
          <BookCard
            key={book.id}
            // Passe toutes les props nécessaires
            id={book.id} // number
            title={book.title}
            author={book.author}
            isInWishlist={book.isInWishlist || false} // Assure une valeur booléenne
            coverUrl={book.coverUrl} // Passe l'URL de l'image
            onToggleWishlist={onToggleWishlist}
            onDeleteBook={onDeleteBook} // Repasse onDeleteBook
          />
        ))
      )}
    </div>
  );
}

export default BookList;