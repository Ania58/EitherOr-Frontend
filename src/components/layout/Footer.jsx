
const Footer = () => {
    const fullYear = new Date().getFullYear();

    return (
        <footer className="text-center text-sm text-gray-500 py-4 mt-8 border-t">
            <p>© {fullYear} Either Or. All Rights Reserved.</p>
        </footer>
    )
};

export default Footer;