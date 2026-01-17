'use client';

import { Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { sendRequest } from "@/app/util/api";
import Image from "next/image";

export default function SearchForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);
    const [keyword, setKeyword] = useState("");
    const [searchResults, setSearchResults] = useState<IProduct[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout>(null);

    // Load keyword from URL on mount
    useEffect(() => {
        const keywordParam = searchParams.get('keyword');
        if (keywordParam) {
            setKeyword(keywordParam);
        }
    }, [searchParams]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
                setSearchResults([]);
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    // Search as user types (debounced)
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (keyword.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            setIsLoading(true);
            try {
                const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/search`,
                    method: 'GET',
                    queryParams: {
                        keyword: keyword.trim(),
                        page: 0,
                        size: 5, // Limit suggestions to 5 items
                    }
                });
                setSearchResults(res.data?.result || []);
            } catch (error) {
                console.error('Search error:', error);
                setSearchResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300); // Wait 300ms after user stops typing

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [keyword]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (keyword.trim()) {
            router.push(`/product?keyword=${encodeURIComponent(keyword.trim())}`);
            setIsOpen(false);
            setSearchResults([]);
        }
    };

    const handleProductClick = (slug: string) => {
        router.push(`/product/${slug}`);
        setIsOpen(false);
        setKeyword("");
        setSearchResults([]);
    };

    const handleClear = () => {
        setKeyword("");
        setSearchResults([]);
        router.push('/product');
        setIsOpen(false);
    };

    return (
        <>
            {/* Search Button */}
            <button 
                onClick={() => setIsOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all duration-300 group"
            >
                <Search className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
            </button>

            {/* Search Modal */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-[100] flex items-start justify-center pt-20"
                    onClick={() => {
                        setIsOpen(false);
                        setSearchResults([]);
                    }}
                >
                    <div 
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
                            <div className="flex items-center gap-3">
                                <Search className="w-6 h-6 text-gray-400" />
                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    placeholder="Search perfumes by name or description..."
                                    className="flex-1 text-lg outline-none"
                                    autoFocus
                                />
                                {isLoading && (
                                    <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
                                )}
                                {keyword && !isLoading && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setKeyword("");
                                            setSearchResults([]);
                                        }}
                                        className="p-1 hover:bg-gray-100 rounded-full"
                                    >
                                        <X className="w-5 h-5 text-gray-400" />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setSearchResults([]);
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded-full"
                                >
                                    <X className="w-6 h-6 text-gray-600" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={!keyword.trim()}
                                    className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full font-semibold hover:from-gray-800 hover:to-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    View All Results
                                </button>
                                {keyword && (
                                    <button
                                        type="button"
                                        onClick={handleClear}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-all"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>

                            <p className="text-xs text-gray-500">
                                {keyword.trim() ? 'Click on a product or press Enter to see all results' : 'Press Enter to search or ESC to close'}
                            </p>
                        </form>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <div className="border-t border-gray-100 max-h-[400px] overflow-y-auto">
                                <div className="p-4">
                                    <p className="text-xs text-gray-500 mb-3 px-2">
                                        Showing {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                    </p>
                                    <div className="space-y-2">
                                        {searchResults.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleProductClick(String(product.id))} 
                                                className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-all text-left group"
                                            >
                                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                                    {product.images ? (
                                                        <Image
                                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/storage/images/${product.images[0]}`}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                                            ✨
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors truncate">
                                                        {product.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {product.brand?.name} • {product.sex}
                                                    </p>
                                                    {product.perfumeVariants && product.perfumeVariants[0] && (
                                                        <p className="text-sm font-semibold text-gray-900 mt-1">
                                                            {product.perfumeVariants[0].price?.toLocaleString('vi-VN')}đ
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* No Results */}
                        {keyword.trim().length >= 2 && !isLoading && searchResults.length === 0 && (
                            <div className="border-t border-gray-100 p-8 text-center">
                                <div className="text-4xl mb-2">🔍</div>
                                <p className="text-gray-600 text-sm">No products found for "{keyword}"</p>
                                <p className="text-gray-500 text-xs mt-1">Try different keywords</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
