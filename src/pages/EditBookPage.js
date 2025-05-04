import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './EditBookPage.css'; // Importe le CSS

function EditBookPage({ livres, onBookUpdate }) {
  const params = useParams();
  const navigate = useNavigate();

  const bookIdString = params.bookId || '';
  const bookIdFromUrl = parseInt(bookIdString, 10);

  const livreAModifier = React.useMemo(() =>
    !isNaN(bookIdFromUrl) ? livres.find(livre => livre?.id === bookIdFromUrl) : undefined
  , [livres, bookIdFromUrl]);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isFormInitialized, setIsFormInitialized] = useState(false);

  useEffect(() => {
    if (livreAModifier && !isFormInitialized) {
      setTitle(livreAModifier.title || '');
      setAuthor(livreAModifier.author || '');
      setIsFormInitialized(true);
      console.log("Formulaire pré-rempli pour:", livreAModifier);
    }
  }, [livreAModifier, isFormInitialized]);

  // --- Définition UNIQUE de handleSubmit ---
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!title.trim() || !author.trim() || isNaN(bookIdFromUrl) || !livreAModifier) {
        alert("Impossible d'enregistrer. Vérifiez les informations ou le livre n'existe plus.");
        return;
    }
    onBookUpdate(bookIdFromUrl, { title: title.trim(), author: author.trim() });
    navigate(`/book/${bookIdFromUrl}`); // Redirige vers la page détail
  };
  


  // --- Blocs de retour conditionnels ---
  if (isNaN(bookIdFromUrl)) {
    return ( <div style={{ padding: '20px' }}> <h2>ID de livre invalide</h2> <Link to="/">Retour à la liste</Link> </div> );
  }
  if (!livreAModifier && livres.length > 0 && !isFormInitialized) {
    return ( <div style={{ padding: '20px' }}> <h2>Livre non trouvé !</h2> <p>Impossible de modifier le livre avec l'ID {bookIdFromUrl}.</p> <Link to="/">Retour à la liste</Link> </div> );
  }
  if (!livreAModifier && !isFormInitialized) {
    return <div style={{ padding: '20px' }}>Chargement du livre à modifier...</div>;
  }
  

  // Affiche le formulaire
  return (
    <div className="edit-book-page">
      <h1>Modifier : {livreAModifier?.title}</h1>
      {/* Le formulaire appelle bien handleSubmit défini plus haut */}
      <form onSubmit={handleSubmit}>
        <div className="edit-book-form-group">
          <label htmlFor="editTitleInput">Titre : </label>
          <input type="text" id="editTitleInput" value={title} onChange={(e) => setTitle(e.target.value)} required/>
        </div>
        <div className="edit-book-form-group">
          <label htmlFor="editAuthorInput">Auteur : </label>
          <input type="text" id="editAuthorInput" value={author} onChange={(e) => setAuthor(e.target.value)} required/>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={!isFormInitialized} className="btn btn-primary">
            Enregistrer
          </button>
          <Link to={`/book/${bookIdFromUrl}`} className="btn btn-secondary">Annuler</Link>
        </div>
      </form>
      <Link to="/" className="btn btn-link back-link">Retour à la liste principale</Link>
    </div>
  );
}

export default EditBookPage;