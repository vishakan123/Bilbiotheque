import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchAllBooks, addBook, deleteBook, updateBook, addToWishlist, removeFromWishlist } from './services/bookApi';
import NavigationBar from './components/NavigationBar';
import SearchBar from './components/SearchBar';
import SortOptions from './components/SortOptions';
import BookList from './components/BookList';
import WishlistPage from './pages/WishlistPage';
import AddBookForm from './components/AddBookForm';
import BookDetailPage from './pages/BookDetailPage';
import EditBookPage from './pages/EditBookPage';
import './App.css';

/**
 * @typedef {object} Livre
 * @property {number} id
 * @property {string} title
 * @property {string} author
 * @property {boolean} [isInWishlist]
 */

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('');
  const [wishlist, setWishlist] = useState(/** @type {number[]} */ ([]));
  const [livres, setLivres] = useState(/** @type {Livre[]} */ ([]));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchAllBooks()
      .then(data => setLivres(data))
      .catch(err => { setError(err.message || "Erreur inconnue"); toast.error(`Erreur chargement: ${err.message || "Erreur inconnue"}`); setLivres([]); })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddBook = (nouveauLivreData) => {
    const livreExisteDeja = livres.some(livre => livre.title.toLowerCase() === nouveauLivreData.title.toLowerCase() && livre.author.toLowerCase() === nouveauLivreData.author.toLowerCase());
    if (livreExisteDeja) { toast.warn("Ce livre existe déjà !"); return; }
    addBook(nouveauLivreData)
      .then(livreAjoute => { setLivres(prevLivres => [...prevLivres, livreAjoute]); toast.success(`Livre "${livreAjoute.title}" ajouté !`); })
      .catch(err => { console.error(err); toast.error("Erreur lors de l'ajout."); });
  };

  const handleToggleWishlist = (bookId) => {
    const estDansWishlist = wishlist.includes(bookId);
    let nouvelleWishlist;
    const apiCall = estDansWishlist ? removeFromWishlist(bookId) : addToWishlist(bookId);
    if (estDansWishlist) { nouvelleWishlist = wishlist.filter(id => id !== bookId); }
    else { nouvelleWishlist = [...wishlist, bookId]; }
    setWishlist(nouvelleWishlist);
    apiCall.catch(err => { console.error(err); setWishlist(wishlist); toast.error("Erreur Wishlist"); });
  };

  const handleDeleteBook = (bookIdToDelete) => {
    const livreASupprimer = livres.find(livre => livre.id === bookIdToDelete);
    if (!livreASupprimer) return;
    const wantsToDelete = window.confirm(`Supprimer "${livreASupprimer.title}" ?`);
    if (wantsToDelete) {
      deleteBook(bookIdToDelete)
        .then(() => { setLivres(prevLivres => prevLivres.filter(livre => livre.id !== bookIdToDelete)); setWishlist(prevWishlist => prevWishlist.filter(id => id !== bookIdToDelete)); toast.info(`Livre "${livreASupprimer.title}" supprimé.`); })
        .catch(err => { console.error(err); toast.error("Erreur suppression."); });
    }
  };

  const handleUpdateBook = (bookIdToUpdate, updatedData) => {
     updateBook(bookIdToUpdate, updatedData)
       .then(livreMisAJour => {
         setLivres(prevLivres =>
           prevLivres.map(livre =>
             livre.id === bookIdToUpdate ? livreMisAJour : livre
           )
         );
         toast.success(`Livre "${livreMisAJour.title}" mis à jour !`); // Le point-virgule est bien là, le texte parasite est supprimé
       }) // Fin du .then()
       .catch(err => {
         console.error("Erreur lors de la mise à jour:", err);
         toast.error("Erreur lors de la mise à jour du livre.");
       });
  };
  // --- Fin Fonction handleUpdateBook ---


  // --- Logique de Filtrage / Tri / Préparation des données ---
  const livresFiltres = livres.filter(livre => {
    if (!livre?.title || !livre?.author) return false;
    const titreMinuscule = livre.title.toLowerCase();
    const auteurMinuscule = livre.author.toLowerCase();
    const rechercheMinuscule = searchTerm.toLowerCase();
    return titreMinuscule.includes(rechercheMinuscule) || auteurMinuscule.includes(rechercheMinuscule);
  });
  let livresFiltresEtTries = [...livresFiltres];
  if (sortCriteria === 'title-asc') { livresFiltresEtTries.sort((a, b) => (a?.title || '').localeCompare(b?.title || '')); }
  else if (sortCriteria === 'title-desc') { livresFiltresEtTries.sort((a, b) => (b?.title || '').localeCompare(a?.title || '')); }
  else if (sortCriteria === 'author-asc') { livresFiltresEtTries.sort((a, b) => (a?.author || '').localeCompare(b?.author || '')); }
  else if (sortCriteria === 'author-desc') { livresFiltresEtTries.sort((a, b) => (b?.author || '').localeCompare(a?.author || '')); }
  const livresPourAffichage = livresFiltresEtTries.map(livre => ({ ...(livre || {}), isInWishlist: wishlist.includes(livre?.id) }));
  const livresDeLaWishlist = livres.filter(livre => wishlist.includes(livre?.id)).map(livre => ({ ...(livre || {}), isInWishlist: true }));

  // --- Rendu ---
  return (
    <div className="App">
      <NavigationBar wishlistCount={wishlist.length} />
      <div className="main-container">
        <Routes>
          <Route path="/" element={
            <>
              <div className="controls-section">
                 <SearchBar searchTerm={searchTerm} onSearchTermChange={setSearchTerm} />
                 <SortOptions onSortChange={setSortCriteria} activeSortCriteria={sortCriteria} />
              </div>
              <div className="content-section">
                {error ? <p className="error-message">Erreur: {error}</p> :
                 isLoading ? <div className="loading-message"><div className="spinner"></div><span>Chargement...</span></div> :
                 (livresPourAffichage.length > 0 ?
                   <BookList books={livresPourAffichage} onToggleWishlist={handleToggleWishlist} onDeleteBook={handleDeleteBook} />
                   : <p>Aucun livre ne correspond à vos critères.</p>
                 )
                }
                {!isLoading && !error && (
                  <>
                    <AddBookForm onBookAdd={handleAddBook} />
                    {/* Wishlist Display est maintenant dans sa propre page/route */}
                  </>
                )}
              </div>
            </>
          } />
          <Route path="/wishlist" element={
             <WishlistPage
               wishlistBooks={livresDeLaWishlist}
               onToggleWishlist={handleToggleWishlist}
               onDeleteBook={handleDeleteBook}
             />
           } />
          <Route path="/book/:bookId" element={<BookDetailPage livres={livres} />} />
          <Route path="/book/edit/:bookId" element={<EditBookPage livres={livres} onBookUpdate={handleUpdateBook} />} />
        </Routes>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
    </div>
  );
}

export default App;