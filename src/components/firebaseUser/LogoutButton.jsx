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

  return <button onClick={handleLogout} className="text-gray-700 hover:text-red-600 px-2 py-1 transition-colors duration-200 cursor-pointer">Logout</button>;
}

export default LogoutButton;



