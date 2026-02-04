// components/MobileMenu.tsx
"use client";

import LoginPopup from "@/app/components/login/login.modal";
import { sendRequest, SEX_OPTIONS, TIERS_OPTIONS } from "@/app/util/api";
import clsx from "clsx";
import { Eye, MapPin, Package, User2, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useLanguage } from '@/app/i18n/LanguageContext';

// Separate component for session-dependent content to isolate useSession call
function AuthSection({ onClose }: { onClose: () => void }) {
    const { data: session, status } = useSession();
    const { t } = useLanguage();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || status === 'loading') {
        return <div className="h-10" />;
    }

    if (session?.user) {
        return (
            <>
                <Link href="/profile" className="flex items-center gap-2" onClick={onClose}>
                    <User2 className="w-4 h-4" /> {session.user.username}
                </Link>
                <ButtonLogout />
            </>
        );
    }

    return <LoginPopup />;
}

export default function MobileMenu({ brands }: { brands: IBrand[] }) {
    const [open, setOpen] = useState(false);
    const { t } = useLanguage();

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
                    " lg:hidden fixed left-0 top-0 h-full w-[90%] max-w-sm bg-white z-50 transition-transform duration-300 overflow-y-auto",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between px-4 py-4 border-b">
                    <span className="font-bold text-lg">{t('brandName')}</span>
                    <button onClick={toggleMenu}>
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex flex-col divide-y text-sm">
                    <Link href={`/product?isNew=true`} className="px-4 py-3 hover:bg-gray-50 border-b-[0.5px] border-gray-100" onClick={() => setOpen(false)}>New</Link>
                    {
                        brands.map((brand: IBrand, i) => (
                            <Link
                                key={brand.name}
                                href={`/product?brand=${brand.name}`}
                                className="px-4 py-3 hover:bg-gray-50 border-b-[0.5px] border-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                {brand.name}
                            </Link>
                        ))
                    }
                    {
                        SEX_OPTIONS.map((sex, i) => (
                            <Link
                                key={sex}
                                href={`/product?sex=${sex}`}
                                className="px-4 py-3 hover:bg-gray-50 border-b-[0.5px] border-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                {sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}
                            </Link>
                        ))
                    }
                    {
                        TIERS_OPTIONS.map((tier, i) => (
                            <Link
                                key={tier}
                                href={`/product?tier=${tier}`}
                                className="px-4 py-3 hover:bg-gray-50 border-b-[0.5px] border-gray-100"
                                onClick={() => setOpen(false)}
                            >
                                {tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}
                            </Link>
                        ))
                    }
                </nav>

                <div className="mt-6 px-4 flex flex-col gap-4 text-sm">

                    <Link href="#" className="flex items-center gap-2"><Eye className="w-4 h-4" /> {t('orderLookup')}</Link>
                    <Link href="#" className="flex items-center gap-2"><Package className="w-4 h-4" /> {t('contactRef')}</Link>
                    <Link href="#" className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {t('vietnam')}</Link>

                    <AuthSection onClose={() => setOpen(false)} />
                </div>
            </aside>
        </>
    );
}


export const ButtonLogout = () => {
    const { t } = useLanguage();

    const logoutFromBackend = async () => {
        await sendRequest<void>({
            url: `/api/logout`,
            method: 'POST',
        });
    }
    const handleLogout = async () => {
        await logoutFromBackend();
        signOut();
    }
    return (
        <button onClick={handleLogout} className="cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
            {t('logout')}
        </button>
    )
}

