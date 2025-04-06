import { useState, useEffect, useContext } from "react";
import { auth } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import Spinner from "../common/Spinner";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptRules, setAcceptRules] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleRegister, setIsGoogleRegister] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);


  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*~()\-_+=\/[\]{}\\|;:'"<>,.?])(?=.{7,})/;

  useEffect(() => {
    if (!isRegistrationComplete || isGoogleRegister) return;

    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (!user) {
        clearInterval(interval);
        return;
      }

      await user.reload();
      if (user.emailVerified) {
        clearInterval(interval);
        const token = await user.getIdToken();
        localStorage.setItem("authToken", token);
        setUser({ email: user.email, uid: user.uid });

        setSuccessMessage("✅ Email verified! Redirecting...");
        setTimeout(() => {
          navigate("/questions");
        }, 1000);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, isRegistrationComplete, isGoogleRegister, setUser]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!acceptRules) {
      setError("❗ You must accept the rules to register.");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "❗ Password must be at least 7 characters long, contain a number and a special character."
      );
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName });

      await sendEmailVerification(user);

      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
      setUser({ email: user.email, uid: user.uid });


      setSuccessMessage("📩 A verification email has been sent to your inbox. Please verify your email. This page will check every few seconds.");
      setIsRegistrationComplete(true);
      setError("");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessages = {
        "auth/email-already-in-use": "⚠️ This email is already registered. If you didn’t verify it, please check your inbox.",
        "auth/invalid-email": "❗ Invalid email format.",
        "auth/weak-password": "❗ Password is too weak.",
      };
      setError(errorMessages[err.code] || "❌ Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setIsGoogleRegister(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const token = await user.getIdToken();

      localStorage.setItem("authToken", token);
      setUser({ email: user.email, uid: user.uid });
      setSuccessMessage("✅ Registered with Google! You can now log in.");
      navigate("/questions");
    } catch (err) {
      console.error("Google registration error:", err);
      setError("❌ Google registration failed.");
    } finally {
      setIsGoogleRegister(false);
    }
  };

  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    ) : (
      <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
          <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Your display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 pr-20 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-0 right-0 h-full px-3 text-sm text-gray-600 hover:text-black cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <label>
                <input
                  type="checkbox"
                  checked={acceptRules}
                  onChange={(e) => setAcceptRules(e.target.checked)}
                  required
                />
                I accept the{" "}
                <a
                  href="/rules-and-regulations.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  rules
                </a>
                .
              </label>
            </div>
            <button type="submit" className="w-full bg-orange-400 text-white py-2 rounded hover:bg-orange-500 transition cursor-pointer" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>
          <div className="mt-4">
            <button onClick={handleGoogleRegister} className="w-full flex items-center justify-center gap-2 bg-white text-black border border-gray-300 py-2 rounded hover:bg-gray-100 transition cursor-pointer">
              <img
                src="https://cdnjs.cloudflare.com/ajax/libs/simple-icons/3.0.1/google.svg"
                alt="Google Logo"
                className="w-5 h-5"
              />
              Register with Google
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
          {successMessage && <p className="text-green-600 mt-4 text-sm">{successMessage}</p>}
      </div>
    )
  );
}

export default Register;
