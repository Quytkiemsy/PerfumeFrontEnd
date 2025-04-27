'use client';

import { AnimatePresence, motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { useState } from "react";
import { toast } from 'react-hot-toast';

export default function LoginPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleCredentialLogin = async () => {
        const res = await signIn("credentials", {
            username,
            password,
            redirect: false,
            callbackUrl: `${window.location.origin}`
        });

        if (res?.error) {
            toast.error(res?.error ? res.error as string : "");
        } else {
            toast.success('Đăng nhập thành công!');
            setIsOpen(false);
        }
        if (res?.url) {
            router.push(res.url);
        }
    };

    const handleGoogleLogin = () => signIn("google");

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="cursor-pointer hover:underline underline-offset-4 decoration-[2px]"
            >
                Đăng nhập
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white p-8 rounded-lg shadow-xl w-96 relative"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Close button */}
                            <button
                                className="absolute top-4 right-4 text-black text-2xl font-bold"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>

                            {/* Title */}
                            <p className="text-center text-gray-800 text-sm mb-6">
                                Check your order status, create a return,<br />
                                start an exchange, or update your<br />
                                account.
                            </p>

                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email*"
                                className="w-full border border-black px-4 py-3 mb-4 text-sm outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            {/* Password */}
                            <input
                                type="password"
                                placeholder="Password*"
                                className="w-full border border-black px-4 py-3 mb-6 text-sm outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Sign in Button */}
                            <button
                                onClick={handleCredentialLogin}
                                className="w-full bg-black text-white py-3 mb-4 text-sm font-bold uppercase tracking-wide"
                            >
                                Sign in
                            </button>

                            {/* Forgot password */}
                            <div className="text-center mb-6">
                                <a href="#" className="text-sm text-black underline">
                                    Forgot password?
                                </a>
                            </div>

                            {/* Google Sign in */}
                            <button
                                onClick={handleGoogleLogin}
                                className="w-full border border-black py-3 mb-6 text-sm font-semibold hover:bg-gray-100"
                            >
                                Sign in with Google
                            </button>

                            {/* Create account */}
                            <div className="text-center">
                                <a href="#" className="text-sm text-black underline">
                                    Create an account
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
