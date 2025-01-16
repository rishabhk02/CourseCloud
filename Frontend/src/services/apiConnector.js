import axios from "axios";

// Create an Axios instance
export const axiosInstance = axios.create({});

// Function to handle API calls
export const apiConnector = (method, url, bodyData = null, headers = {}, params = {}) => {
  return axiosInstance({
    method, // HTTP method (GET, POST, etc.)
    url, // API endpoint
    data: bodyData, // Request body data
    headers, // Custom headers for the request
    params, // URL parameters for the request
  });
};
