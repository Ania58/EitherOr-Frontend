import { useState, useContext } from "react";
import { auth } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await user.reload();
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        return;
      }

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);

      setUser({ email: user.email, uid: user.uid }); 
      navigate("/questions");
    } catch (err) {
      console.error("Login error:", err);
      const errorMessages = {
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later.",
        "auth/invalid-credential": "Invalid credentials.",
      };
      setError(errorMessages[err.code] || "Login failed. Try again.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      setUser({ email: user.email, uid: user.uid }); 
      navigate("/questions");
    } catch (err) {
      console.error("Google login error:", err);
      setError("Google login failed. Try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", width: "100%", marginBottom: "1rem" }}
        />
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              height: "100%",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "0 1rem",
            }}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" style={{ width: "100%", marginBottom: "1rem" }}>
          Login
        </button>
      </form>

      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          backgroundColor: "#4285F4",
          color: "#fff",
          border: "none",
          padding: "0.5rem",
          cursor: "pointer",
        }}
      >
        Login with Google
      </button>

      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
    </div>
  );
}

export default Login;

