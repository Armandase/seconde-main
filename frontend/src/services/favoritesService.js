import api from './api';

export const addFavorite = async (productId, productData) => {
  const response = await api.post('/api/favorites', { productId, productData });
  return response.data;
};

export const getFavorites = async () => {
  const response = await api.get('/api/favorites');
  return response.data;
};

export const removeFavorite = async (productId) => {
  const response = await api.delete(`/api/favorites/${productId}`);
  return response.data;
};
