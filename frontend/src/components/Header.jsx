import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Header = () => {
  const { isAuthenticated, handleLogout, userRole } = useAuth(); // añadir userRole
  const navigate = useNavigate();

  return (
    <header className="bg-primary text-white py-3 mb-4">
      <div className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none h4 mb-0">
          Mundo GPU
        </Link>
        <nav>
          <Link to="/gpu" className="text-white mx-2 text-decoration-none">GPUs</Link>

         {/*{/* Botón visible solo para administradores 
          {isAuthenticated && String(userRole || "").toUpperCase() === "ADMIN" && (
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={() => navigate("/user", { replace: true })}
            >
              Usuarios
            </button>
          )}
          */ }
         

          {isAuthenticated ? (
            <button
              className="btn btn-outline-light btn-sm ms-2"
              onClick={() => {
                handleLogout();
                navigate("/login", { replace: true });
              }}
            >
              Cerrar sesión
            </button>
          ) : (
            <Link to="/login" className="text-white mx-2 text-decoration-none">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;