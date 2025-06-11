    // frontend/src/context/AuthContext.js
    import React, { createContext, useContext, useState, useEffect } from 'react';

    const AuthContext = createContext();

    export const AuthProvider = ({ children }) => {
      const [auth, setAuth] = useState({
        token: null,
        user: null,
      });

      // Load auth data from localStorage on initial load
      useEffect(() => {
        const storedAuth = localStorage.getItem('auth');
        if (storedAuth) {
          setAuth(JSON.parse(storedAuth));
        }
      }, []);

      // Update localStorage whenever auth changes
      useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
      }, [auth]);

      const updateAuth = (data) => {
        setAuth(data);
      };

      return (
        <AuthContext.Provider value={{ auth, updateAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };

    export const useAuth = () => useContext(AuthContext);
    