"use client"; // Nếu đang dùng App Router
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaShoppingBag } from "react-icons/fa";
import { SEX_OPTIONS, TIERS_OPTIONS } from "@/app/util/api";

export default function Navbar({ brands }: { brands: IBrand[] }) {
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
                    <Link href={`/product?isNew=true`} className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">New</Link>
                    {
                        brands.map((brand: IBrand, i) => (
                            <Link
                                key={brand.name}
                                href={`/product?brand=${brand.name}`}
                                className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                {brand.name}
                            </Link>
                        ))
                    }
                    {
                        SEX_OPTIONS.map((sex, i) => (
                            <Link
                                key={sex}
                                href={`/product?sex=${sex}`}
                                className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                {sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}
                            </Link>
                        ))
                    }
                    {
                        TIERS_OPTIONS.map((tier, i) => (
                            <Link
                                key={tier}
                                href={`/product?tier=${tier}`}
                                className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]"
                            >
                                {tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}
                            </Link>
                        ))
                    }
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
