import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:4981",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  },
  withCredentials: true,
});


export default apiClient;
