
"use client";

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
        router.push(createPageUrl(page));
    };

    const renderPages = () => {
        const pages = [];
        const maxShown = 5;

        let start = Math.max(1, currentPage - 2);
        let end = Math.min(totalPages, currentPage + 2);

        if (currentPage <= 3) {
            end = Math.min(totalPages, 5);
        }

        if (currentPage >= totalPages - 2) {
            start = Math.max(1, totalPages - 4);
        }

        for (let i = start; i <= end; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => goToPage(i)}
                    className={`px-3 py-1 rounded border ${i === currentPage ? "bg-gray-600 text-white" : "hover:bg-gray-100"}`}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    return (
        <div className="mt-6 flex items-center justify-center space-x-2">
            {currentPage > 1 && (
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                    &laquo;
                </button>
            )}

            {currentPage > 3 && totalPages > 5 && (
                <>
                    <button onClick={() => goToPage(1)} className="px-3 py-1 border rounded hover:bg-gray-100">1</button>
                    <span className="px-2">...</span>
                </>
            )}

            {renderPages()}

            {currentPage < totalPages - 2 && totalPages > 5 && (
                <>
                    <span className="px-2">...</span>
                    <button onClick={() => goToPage(totalPages)} className="px-3 py-1 border rounded hover:bg-gray-100">
                        {totalPages}
                    </button>
                </>
            )}

            {currentPage < totalPages && (
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                >
                    &raquo;
                </button>
            )}
        </div>
    );
}
