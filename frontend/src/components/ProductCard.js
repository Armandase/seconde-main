import React from 'react';

function ProductCard({ product, onAddToFavorites, isFavorited, isAuthenticated }) {
  return (
    <div className="product-card">
      <img 
        src={product.imageUrl} 
        alt={product.title} 
        className="product-image"
      />
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-details">
          <span className="product-badge badge-category">{product.category}</span>
          <span className="product-badge badge-condition">{product.condition}</span>
          <span className="product-badge badge-location">{product.location}</span>
        </div>

        <div className="product-footer">
          <span className="product-price">€{product.price}</span>
          {isAuthenticated && (
            <button 
              className={`favorite-button ${isFavorited ? 'favorited' : ''}`}
              onClick={() => onAddToFavorites(product)}
            >
              {isFavorited ? '♥ Saved' : '♡ Save'}
            </button>
          )}
        </div>

        <small style={{ color: '#95a5a6', fontSize: '0.8rem' }}>
          Source: {product.source}
        </small>
      </div>
    </div>
  );
}

export default ProductCard;
