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
                    className={`w-9 h-9 flex items-center justify-center rounded-full border transition-all duration-150 font-semibold text-base
                        ${i === currentPage
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md scale-110"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600"}
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
        <nav className="mt-8 flex items-center justify-center gap-2 select-none" aria-label="Pagination">
            <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Trang trước"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {currentPage > 3 && totalPages > 5 && (
                <>
                    <button onClick={() => goToPage(1)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-indigo-50">1</button>
                    <span className="px-1 text-gray-400">...</span>
                </>
            )}

            {renderPages()}

            {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                    <span className="px-1 text-gray-400">...</span>
                    <button onClick={() => goToPage(totalPages)} className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-indigo-50">{totalPages}</button>
                </>
            )}

            <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Trang sau"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </nav>
    );
}
