import { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Loader, Center } from '@mantine/core';
import { auth } from '../lib/firebase';
import {
  onAuthStateChanged, signOut, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const skipNextAuthChange = useRef(false); // ✅ Add this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (skipNextAuthChange.current) {
        skipNextAuthChange.current = false;
        return; // ✅ Skip the auto-login after register
      }
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const register = async (email, password) => {
    skipNextAuthChange.current = true; // ✅ Tell listener to skip next change
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => signInWithPopup(auth, new GoogleAuthProvider());
  const logout = () => signOut(auth);

  if (loading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" type="bars" />
      </Center>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};