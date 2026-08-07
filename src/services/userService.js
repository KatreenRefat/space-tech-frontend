import { httpClient } from './httpClient.js';

export const userService = {
  /**
   * Complete registration for the phone number that was just verified.
   *
   * Takes FormData because technicians upload a profile image and a criminal
   * record file; httpClient passes it through so the browser sets the multipart
   * boundary itself.
   *
   * @param {FormData} formData
   */
  signup: (formData) => httpClient.post('/me/signup', formData),

  /** The signed-in user's own profile. */
  getProfile: () => httpClient.get('/me'),
};

export default userService;
