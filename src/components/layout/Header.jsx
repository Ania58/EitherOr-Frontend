import { Link, useLocation } from "react-router-dom";


const Header = () => {
    const location = useLocation();
    const sortBy = new URLSearchParams(location.search).get("sortBy");

    return (
        <header>
            <h1>Either Or</h1>
            <nav>
                <ul>
                    <li><Link to="/">🏠 Home</Link></li>
                    <li><Link to="/questions">📋 Questions</Link></li>
                    <li><Link to="/questions/create">➕ Create</Link></li>
                    <li><Link to="/questions?sortBy=newest" style={{ fontWeight: sortBy === "newest" ? "bold" : "normal" }}>🆕 Newest</Link></li>
                    <li><Link to="/questions?sortBy=popular" style={{ fontWeight: sortBy === "popular" ? "bold" : "normal" }}>🔥 Popular</Link></li>
                    <li><Link to="/questions?sortBy=weird" style={{ fontWeight: sortBy === "weird" ? "bold" : "normal" }}>😵‍💫 Weirdest</Link></li>
                </ul> 
            </nav>
        </header>
    )
};

export default Header;