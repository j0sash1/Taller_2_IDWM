"use client";
import { useContext } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { VscAccount } from "react-icons/vsc";
import { FaShoppingCart } from "react-icons/fa";
import { AuthContext } from "@/contexts/auth/AuthContext";
import { Button } from "./ui/button";

export const Navbar = () => {
  const { user, status, logout } = useContext(AuthContext);

  const navStyle = { background: "#4B0082" }; // morado oscuro
  const carrito = (
    <Link href="/carrito" className="flex items-center space-x-1 hover:text-blue-200 transition-colors">
      <FaShoppingCart className="text-white text-base" />
      <span className="text-white text-sm font-medium">Carrito</span>
    </Link>
  );

  if (status === "non-authenticated" || status === "checking") {
    return (
      <nav className="shadow-lg" style={navStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-white text-xl font-bold tracking-wider">BLACKCAT</div>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-4 pr-12 py-2 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Enlaces y sesión */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Catálogo
              </Link>
              {carrito}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <VscAccount className="w-[95px] h-[95px] text-white" />
                </div>
                <div className="flex flex-col">
                  <Link href="/login" className="text-white hover:text-blue-200 text-sm font-medium leading-tight transition-colors">
                    Iniciar sesión
                  </Link>
                  <Link href="/register" className="text-white hover:text-blue-200 text-sm leading-tight transition-colors">
                    Registrarse
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const isAdmin = user?.role === "Admin" || user?.isAdmin === true;

  if (status === "authenticated" && !isAdmin) {
    return (
      <nav className="shadow-lg" style={navStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-white text-xl font-bold tracking-wider">BLACKCAT</div>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-4 pr-12 py-2 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Enlaces y sesión */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Catálogo
              </Link>
              {carrito}
              <Link href="/compras" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Compras
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <VscAccount className="w-[95px] h-[95px] text-white" />
                </div>
                <div className="flex flex-col">
                  <Link href="/login" className="text-white hover:text-blue-200 text-sm font-medium leading-tight transition-colors">
                    Mi perfil
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  if (status === "authenticated" && isAdmin) {
    return (
      <nav className="shadow-lg" style={navStyle}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-white text-xl font-bold tracking-wider">BLACKCAT</div>
            </div>

            {/* Barra de búsqueda */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar"
                  className="w-full pl-4 pr-12 py-2 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Enlaces y sesión */}
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Usuarios
              </Link>
              {carrito}
              <Link href="/compras" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                Productos
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <VscAccount className="w-[95px] h-[95px] text-white" />
                </div>
                <div className="flex flex-col">
                  <Button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return null;
};
