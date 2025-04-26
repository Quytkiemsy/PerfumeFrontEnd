"use client"; // Nếu đang dùng App Router
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";

export default function Navbar() {
    const [showNavbar, setShowNavbar] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowNavbar(window.scrollY > 100);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={` fixed top-0 left-0 w-full bg-white z-50 shadow-sm border-b transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <nav className="max-lg:hidden flex justify-between items-center px-6 py-3 overflow-x-auto whitespace-nowrap">
                <div className="flex space-x-6 text-sm font-medium">
                    <Link href="#" className="font-bold">Reformation</Link>
                    <Link href="#">New</Link>
                    <Link href="#">Clothing</Link>
                    <Link href="#">Dresses</Link>
                    <Link href="#">Tops</Link>
                    <Link href="#">Jeans</Link>
                    <Link href="#">Sweaters</Link>
                    <Link href="#">Weddings</Link>
                    <Link href="#">Shoes</Link>
                    <Link href="#">Bags</Link>
                    <Link href="#">Vacation</Link>
                    <Link href="#">Edits</Link>
                    <Link href="#">Search</Link>
                </div>
                <div className="text-sm">
                    <Link href="#" className="flex items-center gap-1">
                        <FaShoppingBag /> <span>Bag</span>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
