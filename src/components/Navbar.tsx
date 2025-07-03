'use client';

import { useState } from "react";
import Link from "next/link";
import { MenuIcon, ShoppingCartIcon, UserIcon, XIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useCartStore } from "@/stores/CartStore";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const {items: cart} = useCartStore();
    const {user} = useAuth();

    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-blue-800 text-white">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
                <div className="font-bold text-2xl">IDWM</div>

                {/* Desktop Menu */}
                <ul className="hidden md:flex space-x-8 font-medium items-center">
                    <li><Link href="/">Inicio</Link></li>
                    <li><Link href="/about">Productos</Link></li>
                    <li><Link href="/services">Servicios</Link></li>
                    <li><Link href="/contact">Contacto</Link></li>

                    {user ? (
                        <li>
                            <Link href="/profile" className="flex items-center hover:bg-blue-400 rounded-full p-2 transition-all">
                                <UserIcon className="w-6 h-6" />
                                <span className="ml-2">{user.firtsName}</span>
                            </Link>
                        </li>
                    ) : <Link href="/login">
                            <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                                <UserIcon /> Iniciar sesión
                            </Button>
                        </Link>
                    }
                    <li>
                        <Link href={'/cart'} className="relative flex items-center hover:bg-blue-400 rounded-full p-2 transition-all">
                            <ShoppingCartIcon className="w-6 h-6"/>
                            {
                                totalItems > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full px-2">
                                        {totalItems}
                                    </span>
                                )
                            }
                        </Link>

                    </li>
                </ul>

                {/* Mobile Hamburger */}
                <div className="md:hidden">
                    <button onClick={toggleMenu}>
                        {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden flex flex-col items-center bg-blue-950 text-white space-y-4 py-4">
                    <Link href="/" onClick={toggleMenu}>Home</Link>
                    <Link href="/about" onClick={toggleMenu}>About</Link>
                    <Link href="/services" onClick={toggleMenu}>Services</Link>
                    <Link href="/contact" onClick={toggleMenu}>Contact</Link>
                    <Link href="/login" className="w-full flex items-center justify-center px-7">
                        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-full ">
                            <UserIcon/> Iniciar sesión
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
};