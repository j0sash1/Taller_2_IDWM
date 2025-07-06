'use client';

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, ShoppingCartIcon, UserIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/CartStore";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "./ui/input";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { items: cart } = useCartStore();
    const { user } = useAuth();

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="shadow-lg bg-[#4B0082]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3">
                {/* Logo */}
                <div className="flex-shrink-0 mb-2 md:mb-0">
                    <div className="text-white text-xl font-bold tracking-wider">BLACKCAT</div>
                </div>

                {/* Barra de búsqueda */}
                <div className="flex-1 max-w-lg w-full md:mx-8 mb-3 md:mb-0">
                    <Input
                        type="text"
                        placeholder="Buscar"
                        className="w-full pl-4 pr-12 py-2 bg-white rounded-full text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                </div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex items-center space-x-6">
                    <li>
                        <Link href="/" className="text-white hover:text-blue-200 text-sm font-medium transition-colors">
                            Inicio
                        </Link>
                    </li>
                    {user ? (
                        <li>
                            <Link href="/profile" className="flex items-center space-x-2 text-white hover:text-blue-200 text-sm font-medium transition-colors">
                                <UserIcon className="w-6 h-6" />
                                <span>{user.firtsName}</span>
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link href="/login" className="flex items-center">
                                <Button className="bg-[#7B68EE] hover:bg-[#9370DB] text-white rounded-full text-sm">
                                    <UserIcon className="mr-1" /> Iniciar sesión
                                </Button>
                            </Link>
                        </li>
                    )}
                    <li>
                        <Link href="/cart" className="relative flex items-center hover:text-blue-200 transition-colors">
                            <ShoppingCartIcon className="w-6 h-6 text-white" />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    </li>
                </ul>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="text-white">
                        {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center bg-[#3A0066] text-white space-y-4 py-4">
                    <Link href="/" onClick={toggleMenu} className="hover:text-blue-200 text-sm font-medium">Inicio</Link>
                    <Link href="/login" className="w-full flex items-center justify-center px-7">
                        <Button className="bg-[#7B68EE] hover:bg-[#9370DB] text-white rounded-full w-full text-sm">
                            <UserIcon className="mr-1" /> Iniciar sesión
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
};
