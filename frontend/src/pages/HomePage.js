import React, { useState, useEffect } from 'react';
import SearchFilters from '../components/SearchFilters';
import ProductCard from '../components/ProductCard';
import { searchProducts } from '../services/productService';
import { addFavorite, getFavorites, removeFavorite } from '../services/favoritesService';

function HomePage({ isAuthenticated }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data.map(f => f.product_id));
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const handleSearch = async (filters) => {
    setLoading(true);
    setSearchPerformed(true);
    try {
      const data = await searchProducts(filters);
      setProducts(data.products);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToFavorites = async (product) => {
    try {
      if (favorites.includes(product.id)) {
        await removeFavorite(product.id);
        setFavorites(favorites.filter(id => id !== product.id));
      } else {
        await addFavorite(product.id, product);
        setFavorites([...favorites, product.id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
    }
  };

  return (
    <div className="container">
      <SearchFilters onSearch={handleSearch} />

      {loading && <div className="loading">Searching...</div>}

      {!loading && searchPerformed && products.length === 0 && (
        <div className="no-results">
          <p>No products found</p>
          <p>Try adjusting your search filters</p>
        </div>
      )}

      {!loading && !searchPerformed && (
        <div className="no-results">
          <p>Start searching for second-hand products!</p>
          <p>Use the filters above to find what you're looking for</p>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToFavorites={handleAddToFavorites}
              isFavorited={favorites.includes(product.id)}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
