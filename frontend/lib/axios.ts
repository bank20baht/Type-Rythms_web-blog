import axios from "axios"
const BASE_URL = "http://localhost:5000/api"

export default axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
  });
  export const axiosAuth = axios.create({
    baseURL: BASE_URL,
    headers: { "Content-Type": "application/json" },
  });