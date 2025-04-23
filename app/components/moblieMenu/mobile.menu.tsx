// components/MobileMenu.tsx
"use client";

import { X, Heart, Search, MapPin, User2, Eye, Store, Package, Cloud } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import clsx from "clsx";

export default function MobileMenu() {
    const [open, setOpen] = useState(false);

    const toggleMenu = () => setOpen(!open);

    return (
        <>
            {/* Button toggle */}
            <button className="lg:hidden" onClick={toggleMenu}>
                <svg width="24" height="24"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" /></svg>
            </button>

            {/* Overlay */}
            <div
                className={clsx(
                    "lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ",
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={toggleMenu}
            />

            {/* Side menu */}
            <aside
                className={clsx(
                    " lg:hidden fixed left-0 top-0 h-full w-[90%] max-w-sm bg-white z-50 transition-transform duration-300",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <span className="font-bold text-lg">Reformation</span>
                    <button onClick={toggleMenu}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col divide-y text-sm">
                    {["New", "Clothing", "Dresses", "Tops", "Jeans", "Sweaters", "Weddings", "Shoes", "Bags", "Vacation", "Edits"].map((item) => (
                        <Link key={item} href="#" className="px-4 py-3 hover:bg-gray-50 border-b-[0.5px] border-gray-100">
                            {item}
                        </Link>
                    ))}
                </nav>

                <div className="mt-6 px-4 flex flex-col gap-4 text-sm">
                    <Link href="#" className="flex items-center gap-2"><Cloud className="w-4 h-4" /> Sustainability</Link>
                    <Link href="#" className="flex items-center gap-2"><User2 className="w-4 h-4" /> Sign in</Link>
                    <Link href="#" className="flex items-center gap-2"><Store className="w-4 h-4" /> Stores</Link>
                    <Link href="#" className="flex items-center gap-2"><Heart className="w-4 h-4" /> Favorites</Link>
                    <Link href="#" className="flex items-center gap-2"><Eye className="w-4 h-4" /> Order lookup</Link>
                    <Link href="#" className="flex items-center gap-2"><Package className="w-4 h-4" /> Contact Ref</Link>
                    <Link href="#" className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Vietnam</Link>
                </div>
            </aside>
        </>
    );
}
