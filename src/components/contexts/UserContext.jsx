import { createContext, useState, useEffect } from "react";
import { auth } from "../../config/firebase";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      const currentUser = auth.currentUser;

      if (currentUser) {
        try {
          await currentUser.reload();
          if (currentUser.emailVerified) {
            setUser({ email: currentUser.email, uid: currentUser.uid });
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Error checking user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    };

    checkUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
