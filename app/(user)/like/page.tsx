'use client';
import { useLikedProductsStore } from "@/app/store/likedProductsStore";
import ProductCard from "@/app/components/productDetail/product.card";
import { Heart } from "lucide-react";

export default function LikedProductsPage() {
    const likedProducts = useLikedProductsStore(state => state.likedProducts);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-8 h-8 text-red-500 fill-red-500" />
                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                            My Favorites
                        </h1>
                    </div>
                    <p className="text-gray-600 text-sm md:text-base">
                        {likedProducts.length > 0 
                            ? `You have ${likedProducts.length} favorite ${likedProducts.length === 1 ? 'product' : 'products'}`
                            : 'No favorite products yet'
                        }
                    </p>
                </div>

                {/* Products Grid */}
                {likedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {likedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Heart className="w-24 h-24 text-gray-300 mb-4" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Favorites Yet</h2>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            Start exploring our collection and save your favorite fragrances by clicking the heart icon on products.
                        </p>
                        <a
                            href="/product"
                            className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold rounded-xl hover:from-gray-900 hover:to-black transition-all duration-300 shadow-lg"
                        >
                            Browse Products
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}
