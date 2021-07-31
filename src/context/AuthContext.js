import React, { createContext, useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";

// Add the Firebase products that you want to use
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

export const AuthContext = createContext();

const firebaseConfig = {
  apiKey: "AIzaSyAujRjZAEoML-xebsCDsJ3PozhBUik5274",
  authDomain: "interview-questions-53d55.firebaseapp.com",
  projectId: "interview-questions-53d55",
  storageBucket: "interview-questions-53d55.appspot.com",
  messagingSenderId: "139221439684",
  appId: "1:139221439684:web:513a6a907d602797b8e591",
  measurementId: "G-F31C1GNHE9",
};

const AuthProvider = (props) => {
  console.log("abc");
  const firebaseApp = useRef();
  const firebaseAuth = useRef();

  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      firebaseApp.current = initializeApp(firebaseConfig);
      console.log("Dat 123321 firebaseApp", firebaseApp);
      firebaseAuth.current = getAuth(firebaseApp.current);
      await onAuthStateChanged(firebaseAuth.current, (user) => {
        if (user) {
          setCurrentUser(user);
        } else {
          setCurrentUser(null);
        }
      });
    } catch (e) {
      console.log("Dat 123321 e", e);
      setCurrentUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const loginResponse = await signInWithEmailAndPassword(
        firebaseAuth.current,
        email,
        password
      );

      setCurrentUser(loginResponse.user);
    } catch (e) {
      setCurrentUser(null);
      return e.message;
    }
  };

  const logout = () => {
    signOut(firebaseAuth.current);
  };

  const singup = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(
        firebaseAuth.current,
        email,
        password
      );

      setCurrentUser(res.user);
    } catch (e) {
      setCurrentUser(null);
      return e.message;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        singup,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
