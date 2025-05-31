// components/Header.tsx
import LoginPopup from "@/app/components/login/login.modal";
import MobileMenu, { ButtonLogout } from "@/app/components/moblieMenu/mobile.menu";
import { authOptions } from "@/app/lib/auth/authOptions";
import { sendRequest, SEX_OPTIONS, TIERS_OPTIONS } from "@/app/util/api";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Header({ brands }: { brands: IBrand[] }) {
    const session = await getServerSession(authOptions);
    console.log(session)

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
                    <Link href="/" className="flex items-center justify-center gap-2">
                        <span className="hidden lg:block">Reformation</span>
                    </Link>
                </div>

                {/* Right: Icons + Auth (desktop only) */}
                <div className="flex items-center gap-4 text-sm">
                    {/* Icons (always shown) */}
                    <Search className="w-5 h-5" />
                    <ShoppingBag className="w-5 h-5" />

                    {/* Desktop-only items */}
                    <div className="hidden lg:flex items-center gap-4 font-bold">
                        <Heart className="w-5 h-5" />
                        {
                            session?.user ? (
                                <div className="relative group z-10">
                                    <button className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                        {session.user.username}
                                    </button>
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ul className="py-1">
                                            <li>
                                                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <ButtonLogout />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <LoginPopup />
                            )
                        }
                    </div>
                </div>
            </div>

            {/* Bottom Nav (desktop only) */}
            <nav className="hidden lg:flex justify-center text-sm font-medium py-2">
                <ul className="flex gap-6 font-bold">
                    <li><Link href={`/product?isNew=true`} className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">New</Link></li>
                    {
                        brands.map((brand: IBrand, i) => (
                            <li key={i} className="cursor-pointer">
                                <Link href={`/product?brand=${brand.name}`} className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                    {brand.name}
                                </Link>
                            </li>
                        ))
                    }
                    {
                        SEX_OPTIONS.map((sex, i) => (
                            <li key={i} className="cursor-pointer">
                                <Link href={`/product?sex=${sex}`} className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                    {sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}
                                </Link>
                            </li>
                        ))
                    }
                    {
                        TIERS_OPTIONS.map((tier, i) => (
                            <li key={i} className="cursor-pointer">
                                <Link href={`/product?tier=${tier}`} className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]">
                                    {tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </nav>
        </header>
    );
}

