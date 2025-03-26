
const Footer = () => {
    const fullYear = new Date().getFullYear();

    return (
        <footer>
            <p>© {fullYear} Either Or. All Rights Reserved.</p>
        </footer>
    )
};

export default Footer;