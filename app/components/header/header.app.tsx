// components/Header.tsx
import CounterShoppingBar from "@/app/components/header/counter.shoppingbar";
import CounterLikeBar from "@/app/components/header/counter.likebar";
import LoginPopup from "@/app/components/login/login.modal";
import MobileMenu, { ButtonLogout } from "@/app/components/moblieMenu/mobile.menu";
import { authOptions } from "@/app/lib/auth/authOptions";
import { SEX_OPTIONS, TIERS_OPTIONS } from "@/app/util/api";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SearchForm from "@/app/components/header/search.form";


export default async function Header({ brands }: { brands: IBrand[] }) {
    const session = await getServerSession(authOptions);

    return (
        <header className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
            {/* Top Bar */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-2">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 hover:text-gray-200 transition cursor-pointer">
                            🌍 Vietnam
                        </span>
                        <Link href="#" className="hover:text-gray-200 transition hidden md:block">
                            📍 Our Stores
                        </Link>
                        <Link href="#" className="hover:text-gray-200 transition hidden md:block">
                            🌱 Sustainability
                        </Link>
                    </div>
                    <div className="hidden lg:block text-xs">
                        ✨ Free shipping on orders over 500,000đ
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Mobile Menu + Desktop Nav */}
                    <div className="flex items-center gap-6 flex-1">
                        {/* Mobile Hamburger */}
                        <div className="lg:hidden">
                            <MobileMenu brands={brands} />
                        </div>

                        {/* Desktop Quick Links */}
                        <div className="hidden lg:flex items-center gap-6">
                            <Link 
                                href="/product?isNew=true" 
                                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors relative group"
                            >
                                🔥 New Arrivals
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                            <Link 
                                href="/product" 
                                className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors relative group"
                            >
                                All Products
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
                            </Link>
                        </div>
                    </div>

                    {/* Center: Logo */}
                    <Link href="/" className="flex items-center justify-center flex-shrink-0">
                        <div className="text-center">
                            <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent tracking-tight">
                                ✨ Reformation
                            </h1>
                            <p className="text-xs text-gray-500 hidden lg:block">Premium Fragrance</p>
                        </div>
                    </Link>

                    {/* Right: Icons + Auth */}
                    <div className="flex items-center gap-3 lg:gap-5 flex-1 justify-end">
                        {/* Search Icon */}
                        <SearchForm />

                        {/* Wishlist (Desktop only) */}
                        <div className="hidden lg:block">
                            <CounterLikeBar />
                        </div>

                        {/* Shopping Cart */}
                        <div className="relative">
                            <CounterShoppingBar />
                        </div>

                        {/* Auth Section (Desktop) */}
                        <div className="hidden lg:block">
                            {session?.user ? (
                                <div className="relative group">
                                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full font-semibold text-sm text-gray-800 hover:from-gray-200 hover:to-gray-300 transition-all duration-300 shadow-sm">
                                        <span className="w-7 h-7 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                            {session.user.username?.charAt(0).toUpperCase()}
                                        </span>
                                        <span className="hidden xl:block">{session.user.username}</span>
                                        <svg className="w-4 h-4 text-gray-600 transition-transform group-hover:rotate-180 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 border border-gray-100">
                                        <div className="p-4 border-b border-gray-100">
                                            <p className="font-bold text-gray-900">{session.user.username}</p>
                                            <p className="text-xs text-gray-500">{session.user.email}</p>
                                        </div>
                                        <ul className="py-2">
                                            <li>
                                                <Link 
                                                    href="/my-orders" 
                                                    className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all"
                                                >
                                                    <span>📦</span>
                                                    <span className="font-medium">My Orders</span>
                                                </Link>
                                            </li>
                                            <li className="border-t border-gray-100 mt-2 pt-2">
                                                <ButtonLogout />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <LoginPopup />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation (Desktop only) */}
            <nav className="hidden lg:block bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4">
                    <ul className="flex items-center justify-center gap-8 py-3 overflow-x-auto">
                        {brands.slice(0, 5).map((brand: IBrand, i) => (
                            <li key={i}>
                                <Link 
                                    href={`/product?brand=${brand.name}`} 
                                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap relative group"
                                >
                                    {brand.name}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        ))}
                        
                        {SEX_OPTIONS.map((sex, i) => (
                            <li key={i}>
                                <Link 
                                    href={`/product?sex=${sex}`} 
                                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap relative group"
                                >
                                    {sex === 'MALE' ? '👨 ' : sex === 'FEMALE' ? '👩 ' : '👥 '}
                                    {sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        ))}

                        {TIERS_OPTIONS.map((tier, i) => (
                            <li key={i}>
                                <Link 
                                    href={`/product?tier=${tier}`} 
                                    className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap relative group"
                                >
                                    ⭐ {tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}
                                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 group-hover:w-full transition-all duration-300"></span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
}

