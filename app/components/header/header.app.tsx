
// components/Header.tsx
import LoginPopup from "@/app/components/login/login.modal";
import MobileMenu from "@/app/components/moblieMenu/mobile.menu";
import { Menu, Search, ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b">
            <div className="max-w-8xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Left: Country, Links (desktop) */}
                <div className="flex items-center gap-6">
                    {/* Hamburger Menu (mobile only) */}
                    <button className="lg:hidden" />
                    <MobileMenu />

                    {/* Country + Links (desktop only) */}
                    <div className="hidden lg:flex items-center gap-6 text-sm text-black font-bold ">
                        <span className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">▼ Vietnam</span>
                        <Link href="#" className="cursor-pointer hover:underline underline-offset-4 ">Our stores</Link>
                        <Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Sustainability</Link>
                    </div>
                </div>

                {/* Center: Logo */}
                <div className="text-lg font-semibold text-center flex-1 lg:flex-none">
                    Reformation
                </div>

                {/* Right: Icons + Auth (desktop only) */}
                <div className="flex items-center gap-4 text-sm">
                    {/* Icons (always shown) */}
                    <Search className="w-5 h-5" />
                    <ShoppingBag className="w-5 h-5" />

                    {/* Desktop-only items */}
                    <div className="hidden lg:flex items-center gap-4 font-bold">
                        <Heart className="w-5 h-5" />
                        <LoginPopup />
                        {/* <Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Sign in</Link> */}
                    </div>
                </div>
            </div>

            {/* Bottom Nav (desktop only) */}
            <nav className="hidden lg:flex justify-center text-sm font-medium py-2">
                <ul className="flex gap-6 font-bold">
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">New</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Clothing</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Dresses</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Tops</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Jeans</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Sweaters</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Weddings</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Shoes</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Bags</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Vacation</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Edits</Link></li>
                    <li><Link href="#" className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">Search</Link></li>
                </ul>
            </nav>
        </header>
    );
}

