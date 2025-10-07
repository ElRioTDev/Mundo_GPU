import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // ✅ Nuevo

import HomeIndex from "./pages/Home/Index";
import Login from "./pages/Login/Index";
import Registro from "./pages/Registro/Index";
import UserIndex from "./pages/User/Index";
import GPUIndex from "./pages/GPU/Index";

import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomeIndex />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/registro"
            element={
              <PublicRoute>
                <Registro />
              </PublicRoute>
            }
          />

          <Route
            path="/user/*"
            element={
              <PrivateRoute>
                <UserIndex />
              </PrivateRoute>
            }
          />

          <Route
            path="/gpu/*"
            element={
              <PrivateRoute>
                <GPUIndex />
              </PrivateRoute>
            }
          />

          {/* Redirige rutas desconocidas a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
