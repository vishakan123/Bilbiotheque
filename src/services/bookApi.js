// DANS src/services/bookApi.js 

// 
let mockLivresApiData = [
  { id: 1, title: "Le Rouge et le Noir", author: "Stendhal" },
  { id: 2, title: "Madame Bovary", author: "Gustave Flaubert" },
  { id: 3, title: "Orgueil et Préjugés", author: "Jane Austen" },
  { id: 4, title: "Les Misérables", author: "Victor Hugo" },
];

// Simule la récupération de TOUS les livres
export const fetchAllBooks = () => {
  console.log("API Service: fetchAllBooks() appelé (simulé)...");
  return new Promise((resolve) => {
    // Retourne une copie pour éviter les modifications directes de l'original
    setTimeout(() => resolve([...mockLivresApiData]), 500); // Délai réduit à 0.5s
  });
};

// Simule l'ajout d'un livre
export const addBook = (newBookData) => {
  console.log("API Service: addBook() appelé (simulé) avec:", newBookData);
  return new Promise((resolve) => {
    const newId = Date.now(); // Génère un ID simple (simulation)
    const bookToAdd = { ...newBookData, id: newId };
    mockLivresApiData.push(bookToAdd); // Modifie le tableau mocké
    setTimeout(() => resolve(bookToAdd), 300); // Retourne le livre ajouté
  });
};

// Simule la suppression d'un livre
export const deleteBook = (bookId) => {
  console.log("API Service: deleteBook() appelé (simulé) pour ID:", bookId);
  return new Promise((resolve, reject) => {
    const initialLength = mockLivresApiData.length;
    mockLivresApiData = mockLivresApiData.filter(book => book.id !== bookId); // Modifie le tableau mocké
    setTimeout(() => {
      if (mockLivresApiData.length < initialLength) {
        resolve({ success: true }); // Confirme
      } else {
        reject(new Error(`Livre avec ID ${bookId} non trouvé pour suppression.`));
      }
    }, 300);
  });
};

// Simule la mise à jour d'un livre
export const updateBook = (bookId, updatedData) => {
   console.log("API Service: updateBook() appelé (simulé) pour ID:", bookId, "avec:", updatedData);
   return new Promise((resolve, reject) => {
     let bookFound = false;
     let livreMisAJour = null;
     mockLivresApiData = mockLivresApiData.map(book => { // Modifie le tableau mocké
       if (book.id === bookId) {
         bookFound = true;
         livreMisAJour = { ...book, ...updatedData }; // Crée l'objet mis à jour
         return livreMisAJour;
       }
       return book;
     });
     setTimeout(() => {
       if (bookFound) {
         resolve(livreMisAJour); // Retourne le livre mis à jour
       } else {
         reject(new Error(`Livre avec ID ${bookId} non trouvé pour mise à jour.`));
       }
     }, 300);
   });
};

// --- Fonctions Wishlist (simulation simple de succès) ---
export const addToWishlist = (bookId) => {
  console.log("API Service: addToWishlist() appelé (simulé) pour ID:", bookId);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 200));
};

export const removeFromWishlist = (bookId) => {
  console.log("API Service: removeFromWishlist() appelé (simulé) pour ID:", bookId);
  return new Promise(resolve => setTimeout(() => resolve({ success: true }), 200));
};