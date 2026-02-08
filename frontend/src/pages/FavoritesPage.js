import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { getFavorites, removeFavorite } from '../services/favoritesService';

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
      alert('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (productId) => {
    try {
      await removeFavorite(productId);
      setFavorites(favorites.filter(f => f.product_id !== productId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  return (
    <div className="container">
      <h2 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem' }}>
        My Favorites
      </h2>

      {loading && <div className="loading">Loading favorites...</div>}

      {!loading && favorites.length === 0 && (
        <div className="no-results">
          <p>No favorites yet</p>
          <p>Start adding products to your favorites from the search page!</p>
        </div>
      )}

      {!loading && favorites.length > 0 && (
        <div className="product-grid">
          {favorites.map((favorite) => (
            <ProductCard
              key={favorite.id}
              product={favorite.product_data}
              onAddToFavorites={() => handleRemoveFavorite(favorite.product_id)}
              isFavorited={true}
              isAuthenticated={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;
