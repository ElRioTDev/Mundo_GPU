import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none h4 mb-0">
          Mundo GPU
        </Link>
        <nav>
          <Link to="/gpu" className="text-white mx-2 text-decoration-none">GPUs</Link>
          <Link to="/usuarios" className="text-white mx-2 text-decoration-none">Usuarios</Link>
          <Link to="/login" className="text-white mx-2 text-decoration-none">Login</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;