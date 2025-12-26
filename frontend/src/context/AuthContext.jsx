// frontend/src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 1. Create the context "box"
const AuthContext = createContext();

// 2. Create the Provider component
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  // 🎯 THE FIX FOR "WHITE PAGE": Add a 'loading' state.
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize navigate

  // 3. This runs ONCE when the app first loads
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        //  THE FIX: You must PARSE the user string back into an object
        setUser(JSON.parse(storedUser));
        const parsedUser=JSON.parse(storedUser);
        console.log("AuthContext Restoring user from storage:",parsedUser.role)
        setToken(storedToken);
        setIsLoggedIn(true);
      } catch (e) {
        // If localStorage is corrupted, clear it
        localStorage.clear();
       e.setIsLoggedIn(false);
      }
    }
    // 4. We are done checking, set loading to false
    setLoading(false);
  }, []); // Empty array [] means "run only once"

  // 5. Login function (called by Login.jsx)
  const login = (userData, userToken) => {
    // Save to React's state
    setUser(userData);
    setToken(userToken);
    setIsLoggedIn(true);
    // Save to browser's localStorage
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
    localStorage.setItem("isLoggedIn", "true");
  };

  // 6. Logout function (called by Navbar.jsx)
  const logout = () => {
    // Clear React's state
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
    // 🎯 THE FIX: Clear localStorage correctly
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    // Redirect to login
    navigate("/login");
  };

  // 7. Provide all these values to the entire app
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, login, logout, loading }}>
      {/* Don't render the app *until* loading is false */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 8. The custom hook that components will use
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);