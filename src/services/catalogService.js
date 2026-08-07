import { httpClient } from './httpClient.js';

export const catalogService = {
  /** Service categories a technician can register under. */
  getCategories: () => httpClient.get('/public/categories', { auth: false }),
};

export default catalogService;
