import axios from 'axios';

import { API_BASE } from '../config/constants';

// Resources for /users endpoint on API
// @see https://github.com/mzabriskie/axios#creating-an-instance
export const usersResource = axios.create({
  baseURL: `${API_BASE}/users/`,
});
