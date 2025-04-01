import { createContext, useState, useEffect } from "react";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); 

      if (firebaseUser && firebaseUser.emailVerified) {
        const token = await firebaseUser.getIdToken();
        localStorage.setItem("authToken", token);
        setUser({ email: firebaseUser.email, uid: firebaseUser.uid, displayName: firebaseUser.displayName || null });
      } else {
        localStorage.removeItem("authToken");
        setUser(null);
      }

      setLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
