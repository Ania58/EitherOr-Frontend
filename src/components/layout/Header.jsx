import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import LogoutButton from "../firebaseUser/LogoutButton";



const Header = () => {
    const location = useLocation();
    const sortBy = new URLSearchParams(location.search).get("sortBy");

    const { user } = useContext(UserContext);

    return (
        <header className="sticky top-0 bg-white shadow-md p-4 z-50">
            <div className="flex justify-between items-center max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold text-green-600">Either Or</h1>
                <nav>
                    <ul className="flex gap-4 items-center text-gray-700">
                        <li className="hover:text-green-600"><Link to="/">🏠 Home</Link></li>
                        <li className="hover:text-green-600"><Link to="/questions">📋 Questions</Link></li>
                        {user ? (
                            <>
                                <span className="text-sm text-gray-500">
                                    👋 Hello, {user.displayName || user.email}
                                </span>
                                <li><Link to="/questions/create" className="hover:text-green-600">➕ Create</Link></li>
                                <li><LogoutButton /></li>
                            </>
                        ) : (
                            <>
                                <li><Link to="/login" className="hover:text-green-600">🔐 Login</Link></li>
                                <li><Link to="/register" className="hover:text-green-600">📝 Register</Link></li>
                            </>
                        )}
                        <li><Link to="/questions?sortBy=newest" className={`${sortBy === "newest" ? "font-bold text-green-600" : "hover:text-green-600"}`}>🆕 Newest</Link></li>
                        <li><Link to="/questions?sortBy=popular" className={`${sortBy === "popular" ? "font-bold text-green-600" : "hover:text-green-600"}`}>🔥 Popular</Link></li>
                        <li><Link to="/questions?sortBy=weird" className={`${sortBy === "weird" ? "font-bold text-green-600" : "hover:text-green-600"}`}>😵‍💫 Weirdest</Link></li>
                    </ul> 
                </nav>
            </div>
        </header>
    )
};

export default Header;