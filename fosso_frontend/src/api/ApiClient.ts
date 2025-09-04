import axios from "axios";
import { logout } from "../slices/authSlice";
import { store } from "../store/store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
});

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.token;  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response && error.response.status === 401) {
    store.dispatch(logout()); 
  }
  return Promise.reject(error);
});


export default apiClient;
