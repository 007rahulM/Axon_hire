// frontend/src/api/axiosInstance.js

// 1. Import axios library
import axios from "axios";

// 2. Create an axios instance so we can preconfigure it
//const axiosInstance = axios.create({
//   baseURL: "http://localhost:5000/api", // Your backend base url
//  //new render base url
// // baseURL: "https://axon-hire.onrender.com/api",
 
//  headers: {
//     "Content-Type": "application/json", // Tell backend we are sending json
//   },
// });
// If we are in "production" (deployed), use the Render URL.
// If we are in "development" (localhost), use localhost:5000.
// This way, you never have to manually switch it again.
const baseURL = import.meta.env.MODE === "production"
  ? "https://axon-hire.onrender.com/api"
  : "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
// 3. REQUEST Interceptor (Runs BEFORE sending any request)
axiosInstance.interceptors.request.use(
  (config) => {
    // 4. Get the token from localStorage
    const token = localStorage.getItem("token");

    // 5. Log for debugging
    console.log("Sending request:", config.url);
    console.log("Attaching token:", token ? "token found" : "no token");

    // 6. If the token exists, add it to the 'Authorization' header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // 7. Send the request
    return config;
  },
  (error) => {
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }
);

// 8. RESPONSE Interceptor (Runs AFTER receiving a response)
axiosInstance.interceptors.response.use(
  (response) => {
    // 9. If the response is good (e.g., status 200), just return it
    return response;
  },
  (error) => {
    // 10. If the response is an error...
    const status = error.response?.status;
    
    // 11. ...and the error is 401 (Unauthorized) or 403 (Forbidden)
    if (status === 401 || status === 403) {
      console.warn("Token expired or invalid, redirecting to login...");
      
      // 12. Clear the broken token from storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");

      // 13. Redirect to login, but NOT if we are already on login/register
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    }
    
    // 14. Log any other errors
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);

// 15.  THE FIX:
// This line "exports" the axiosInstance as the "default" thing from this file.
// This is the line that was missing and causing your crash.
export default axiosInstance;