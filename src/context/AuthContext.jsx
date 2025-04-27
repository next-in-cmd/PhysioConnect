import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signIn = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/signin', { email, password });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return true;
    } catch (error) {
      console.error('Sign-in error:', error);
      return false;
    }
  };

  const signUp = async (name, email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/signup', { name, email, password, role });
      setUser(response.data.user);
      localStorage.setItem('token', response.data.token);
      return true;
    } catch (error) {
      console.error('Sign-up error:', error);
      return false;
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}