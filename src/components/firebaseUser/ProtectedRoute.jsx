import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload(); 
        setIsVerified(user.emailVerified);
      } else {
        setIsVerified(false);
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) return <p>Loading...</p>;

  const token = localStorage.getItem("authToken");

  return token && isVerified ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
