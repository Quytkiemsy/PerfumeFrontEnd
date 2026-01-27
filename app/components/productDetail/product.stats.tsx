'use client';

import { Eye, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { sendRequest } from '@/app/util/api';

interface ProductStatsProps {
    productId: number;
    initialVisitCount?: number;
    initialRating?: number;
    initialReviewCount?: number;
}

const ProductStats: React.FC<ProductStatsProps> = ({ 
    productId, 
    initialVisitCount = 0,
    initialRating = 0,
    initialReviewCount = 0
}) => {
    const [visitCount, setVisitCount] = useState(initialVisitCount);
    const [hasTracked, setHasTracked] = useState(false);

    useEffect(() => {
        // Track visit only once per session
        if (!hasTracked) {
            trackVisit();
            setHasTracked(true);
        }
    }, [productId, hasTracked]);

    const trackVisit = async () => {
        try {
            const res = await sendRequest<IBackendRes<{ visitCount: number }>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products/${productId}/visit`,
                method: 'POST'
            });
            if (res.data?.visitCount) {
                setVisitCount(res.data.visitCount);
            }
        } catch (error) {
            console.error('Error tracking visit:', error);
        }
    };

    const formatCount = (count: number) => {
        if (count >= 1000000) {
            return `${(count / 1000000).toFixed(1)}M`;
        }
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}K`;
        }
        return count.toString();
    };

    return (
        <div className="flex items-center gap-4 text-sm text-gray-500">
            {/* Visit Count */}
            <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{formatCount(visitCount)} lượt xem</span>
            </div>

            {/* Rating */}
            {initialRating > 0 && (
                <>
                    <span className="text-gray-300">|</span>
                    <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span>{initialRating.toFixed(1)}</span>
                        <span className="text-gray-400">({initialReviewCount} đánh giá)</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductStats;
