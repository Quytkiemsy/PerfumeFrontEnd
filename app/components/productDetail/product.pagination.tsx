"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", page.toString());
        return `?${params.toString()}`;
    };

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        router.push(createPageUrl(page));
    };

    const renderPages = () => {
        const pages = [];
        const maxShown = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);
        if (currentPage <= 3) end = Math.min(totalPages, 5);
        if (currentPage >= totalPages - 2) start = Math.max(1, totalPages - 4);
        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold text-sm transition-all duration-300 transform
                        ${i === currentPage
                            ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg scale-110 ring-2 ring-gray-400"
                            : "bg-white text-gray-700 border border-gray-200 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-105 hover:shadow-md"}
                    `}
                    aria-current={i === currentPage ? "page" : undefined}
                >
                    {i}
                </button>
            );
        }
        return pages;
    };

    return (
        <nav className="flex flex-col items-center gap-4 select-none" aria-label="Pagination">
            {/* Pagination info */}
            <div className="text-sm text-gray-600 font-medium">
                Page <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
                <span className="font-bold text-gray-900">{totalPages}</span>
            </div>

            {/* Pagination controls */}
            <div className="flex items-center gap-2 bg-white rounded-2xl shadow-lg px-4 py-3 border border-gray-100">
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-105 active:scale-95"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {currentPage > 3 && totalPages > 5 && (
                    <>
                        <button 
                            onClick={() => goToPage(1)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-105 hover:shadow-md transition-all duration-300"
                        >
                            1
                        </button>
                        <span className="px-2 text-gray-400 font-bold">•••</span>
                    </>
                )}

                {renderPages()}

                {currentPage < totalPages - 2 && totalPages > 5 && (
                    <>
                        <span className="px-2 text-gray-400 font-bold">•••</span>
                        <button 
                            onClick={() => goToPage(totalPages)} 
                            className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-sm hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-200 hover:scale-105 hover:shadow-md transition-all duration-300"
                        >
                            {totalPages}
                        </button>
                    </>
                )}

                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-600 hover:from-gray-100 hover:to-gray-200 hover:shadow-md transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transform hover:scale-105 active:scale-95"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Quick jump buttons */}
            {totalPages > 5 && (
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => goToPage(1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ⏮️ First
                    </button>
                    <button
                        onClick={() => goToPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        Last ⏭️
                    </button>
                </div>
            )}
        </nav>
    );
}
