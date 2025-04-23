"use client";

import { FaTiktok } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";

export default function Footer() {
    return (
        <footer className="bg-white text-black px-6 py-12 border-t text-sm">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                    <p className="font-medium">About Ref</p>
                    <p>Stores</p>
                    <p>Careers</p>
                    <p>Affiliates</p>
                </div>
                <div className="space-y-2">
                    <p className="font-medium">FAQ</p>
                    <p>Contact</p>
                    <p>Size guide</p>
                    <p>E-gift cards</p>
                </div>
                <div className="space-y-2">
                    <p className="font-medium">Sign in</p>
                    <p>Returns & exchanges</p>
                    <p>Order lookup</p>
                </div>
                <div className="space-y-4">
                    <p className="font-medium">We make great emails</p>
                    <div className="flex">
                        <input
                            type="email"
                            placeholder="Give us your email"
                            className="border px-4 py-2 flex-1"
                        />
                        <button className="bg-black text-white px-4 py-2 font-semibold">
                            Sign up
                        </button>
                    </div>
                    <div className="flex space-x-4 mt-2 text-lg">
                        <FaTiktok />
                        <FaFacebook />
                        <FaInstagram />
                        <FaYoutube />
                    </div>
                </div>
            </div>

            <div className="mt-12 border-t pt-6 text-xs text-gray-500 flex flex-wrap gap-4 justify-between items-center">
                <p>© 2025 Reformation</p>
                <div className="flex flex-wrap gap-4">
                    <p>Do not sell or share my info</p>
                    <p>Terms</p>
                    <p>Privacy</p>
                    <p>California Privacy Notice</p>
                    <p>Sitemap</p>
                    <p>Accessibility</p>
                    <p>CA Supply Chain</p>
                </div>
            </div>
        </footer>
    );
}
