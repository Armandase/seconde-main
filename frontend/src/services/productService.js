import api from './api';

export const searchProducts = async (filters) => {
  const params = new URLSearchParams();
  
  if (filters.query) params.append('query', filters.query);
  if (filters.category) params.append('category', filters.category);
  if (filters.minPrice) params.append('minPrice', filters.minPrice);
  if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
  if (filters.condition) params.append('condition', filters.condition);
  if (filters.location) params.append('location', filters.location);
  params.append('page', filters.page || 1);
  params.append('limit', filters.limit || 20);

  const response = await api.get(`/api/search?${params.toString()}`);
  return response.data;
};

export const getProduct = async (id) => {
  const response = await api.get(`/api/products/${id}`);
  return response.data;
};
