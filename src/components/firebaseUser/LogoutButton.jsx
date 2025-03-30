import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { auth } from "../../config/firebase";
import { signOut } from "firebase/auth";
import { UserContext } from "../contexts/UserContext";

function LogoutButton() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); 

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default LogoutButton;



