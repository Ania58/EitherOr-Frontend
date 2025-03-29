import { Link } from "react-router-dom";


const Header = () => {
    return (
        <header>
            <h1>Either Or</h1>
            <nav>
                <ul>
                    <li><Link to="/">🏠 Home</Link></li>
                    <li><Link to="/questions">📋 Questions</Link></li>
                    <li><Link to="/questions/create">➕ Create</Link></li>
                </ul> 
            </nav>
        </header>
    )
};

export default Header;