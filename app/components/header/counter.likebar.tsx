'use client';
import { Heart } from "lucide-react";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { sendRequest } from "@/app/util/api";
import { IUser } from "../types/next-auth";
import { useLikedProductsStore } from "@/app/store/likedProductsStore";

export default function CounterLikeBar() {
    const [likeCount, setLikeCount] = useState<number>(0);
    const setLikedProducts = useLikedProductsStore(state => state.setLikedProducts);
    const { data: session } = useSession();

    const fetchLikeCount = async () => {
        if (!session?.user?.username) {
            setLikeCount(0);
            return;
        }

        try {
            const res = await sendRequest<IBackendRes<IUser>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/account`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            // res.data.likedProducts is expected to be an array
            if (Array.isArray(res.data?.likedProducts)) {
                setLikeCount(res.data.likedProducts.length);
                setLikedProducts(res.data.likedProducts);
            } else {
                setLikeCount(0);
                setLikedProducts([]);
            }
        } catch (error) {
            console.error('Error fetching like count:', error);
            setLikeCount(0);
        }
    };

    useEffect(() => {
        fetchLikeCount();

        // Listen for like count updates
        window.addEventListener('likeCountUpdated', fetchLikeCount);

        return () => {
            window.removeEventListener('likeCountUpdated', fetchLikeCount);
        };
    }, [session]);

    return (
        <button className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 group relative">
            <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
            {likeCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {likeCount > 9 ? '9+' : likeCount}
                </span>
            )}
        </button>
    );
}
