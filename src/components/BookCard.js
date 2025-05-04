import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

function BookCard({ id, title, author, isInWishlist, onToggleWishlist, onDeleteBook }) {
  const wishlistButtonClass = isInWishlist ? 'is-in-wishlist' : 'not-in-wishlist';

  return (
    <div className="book-card">
      <div className="book-card-actions">
        {/* Applique la classe .btn-icon en plus des autres */}
        <Link to={`/book/edit/${id}`} className="edit-link btn-icon" title="Modifier">✏️</Link>
        <button className="delete-button btn-icon" onClick={() => onDeleteBook(id)} aria-label="Supprimer">🗑️</button>
        <button className={`wishlist-button ${wishlistButtonClass} btn-icon`} onClick={() => onToggleWishlist(id)} aria-label={isInWishlist ? "Retirer wishlist" : "Ajouter wishlist"}>
          {isInWishlist ? '❤️' : '♡'}
        </button>
      </div>
      {/* ... Placeholder et Content ... */}
       <div className="book-card-image-placeholder">(Image Bientôt Disponible)</div>
       <div className="book-card-content">
         <Link to={`/book/${id}`} title={`Détails de "${title}"`} style={{ textDecoration: 'none', color: 'inherit' }}>
           <h3>{title}</h3>
         </Link>
         <p>{author}</p>
       </div>
    </div>
  );
}

export default BookCard;