import axios from 'axios';

export const baseURL = 'http://localhost:8080';

export const MyAxios = axios.create({
  baseURL: baseURL,
});