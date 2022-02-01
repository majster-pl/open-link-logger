import axios from "axios";

const host = window.location.hostname;

const apiClient = axios.create({
  baseURL: `http://${host}:4981`,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-type": "application/json",
  },
  withCredentials: true,
});


export default apiClient;
