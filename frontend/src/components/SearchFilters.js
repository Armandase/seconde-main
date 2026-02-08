import React, { useState } from 'react';

function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    query: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    location: ''
  });

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="search-section">
      <h2>Search Second-Hand Products</h2>
      
      <input
        type="text"
        name="query"
        placeholder="Search for products..."
        value={filters.query}
        onChange={handleChange}
        className="search-input"
      />

      <div className="filters">
        <div className="filter-group">
          <label>Category</label>
          <select name="category" value={filters.category} onChange={handleChange}>
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="furniture">Furniture</option>
            <option value="clothing">Clothing</option>
            <option value="sports">Sports</option>
            <option value="books">Books</option>
            <option value="home">Home & Garden</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Condition</label>
          <select name="condition" value={filters.condition} onChange={handleChange}>
            <option value="">Any Condition</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Location</label>
          <select name="location" value={filters.location} onChange={handleChange}>
            <option value="">All Locations</option>
            <option value="Paris">Paris</option>
            <option value="Lyon">Lyon</option>
            <option value="Marseille">Marseille</option>
            <option value="Toulouse">Toulouse</option>
            <option value="Nice">Nice</option>
            <option value="Bordeaux">Bordeaux</option>
            <option value="Grenoble">Grenoble</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price (€)</label>
          <input
            type="number"
            name="minPrice"
            placeholder="0"
            value={filters.minPrice}
            onChange={handleChange}
            min="0"
          />
        </div>

        <div className="filter-group">
          <label>Max Price (€)</label>
          <input
            type="number"
            name="maxPrice"
            placeholder="1000"
            value={filters.maxPrice}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
}

export default SearchFilters;
