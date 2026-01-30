'use client';

import { MessageSquare, Star, ThumbsUp, User, Camera, X, Send } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendRequest } from '@/app/util/api';

interface ProductReviewsProps {
    productId: number;
    initialReviews?: IReview[];
    initialStats?: IReviewStats;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ 
    productId, 
    initialReviews = [], 
    initialStats 
}) => {
    const [reviews, setReviews] = useState<IReview[]>(initialReviews);
    const [stats, setStats] = useState<IReviewStats | null>(initialStats || null);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [canReview, setCanReview] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        rating: 5,
        title: '',
        comment: '',
    });
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.accessToken) {
            checkCanReview();
        }
        if (!initialReviews.length) {
            fetchReviews();
        }
        if (!initialStats) {
            fetchStats();
        }
    }, [session, productId]);

    const checkCanReview = async () => {
        try {
            const res = await sendRequest<IBackendRes<{ canReview: boolean }>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/can-review/${productId}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                }
            });
            setCanReview(res.data?.canReview || false);
        } catch (error) {
            console.error('Error checking can review:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/product/${productId}`,
                method: 'GET',
                queryParams: { page: 0, size: 10 }
            });
            setReviews(res.data?.result || []);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await sendRequest<IBackendRes<IReviewStats>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/product/${productId}/stats`,
                method: 'GET'
            });
            setStats(res.data || null);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleSubmitReview = async () => {
        if (!reviewForm.comment.trim()) {
            toast.error('Vui lòng nhập nội dung đánh giá');
            return;
        }

        setIsLoading(true);
        try {
            const res = await sendRequest<IBackendRes<IReview>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: {
                    productId,
                    rating: reviewForm.rating,
                    title: reviewForm.title,
                    comment: reviewForm.comment,
                }
            });

            if (res.error) {
                toast.error(res.message || 'Lỗi gửi đánh giá');
                return;
            }

            toast.success('Đánh giá của bạn đã được gửi!');
            setShowWriteReview(false);
            setReviewForm({ rating: 5, title: '', comment: '' });
            fetchReviews();
            fetchStats();
        } catch (error) {
            toast.error('Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHelpful = async (reviewId: number) => {
        try {
            await sendRequest<IBackendRes<void>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/reviews/${reviewId}/helpful`,
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session?.accessToken}`
                },
            });
            
            fetchReviews();
        } catch (error) {
            console.error('Error marking helpful:', error);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md', interactive = false, onRate?: (r: number) => void) => {
        const sizeClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-8 h-8' : 'w-5 h-5';
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onRate?.(star)}
                        className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
                    >
                        <Star
                            className={`${sizeClass} ${
                                star <= rating 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                    </button>
                ))}
            </div>
        );
    };

    const getRatingPercentage = (rating: number) => {
        if (!stats || stats.totalReviews === 0) return 0;
        const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0;
        return (count / stats.totalReviews) * 100;
    };

    return (
        <div className="mt-12 border-t pt-12">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Stats Section */}
                <div className="lg:w-1/3">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá sản phẩm</h2>
                    
                    {stats && (
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <div className="text-center mb-6">
                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center mb-2">
                                    {renderStars(Math.round(stats.averageRating), 'md')}
                                </div>
                                <p className="text-gray-500">{stats.totalReviews} đánh giá</p>
                            </div>

                            {/* Rating Distribution */}
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((rating) => (
                                    <div key={rating} className="flex items-center gap-2">
                                        <span className="text-sm w-3">{rating}</span>
                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-400 rounded-full transition-all"
                                                style={{ width: `${getRatingPercentage(rating)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-500 w-8">
                                            {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] || 0}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Write Review Button */}
                    {session ? (
                        canReview ? (
                            <Button 
                                className="w-full mt-4" 
                                onClick={() => setShowWriteReview(true)}
                            >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Viết đánh giá
                            </Button>
                        ) : (
                            <p className="text-sm text-gray-500 mt-4 text-center">
                                Bạn cần mua sản phẩm để đánh giá
                            </p>
                        )
                    ) : (
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Đăng nhập để viết đánh giá
                        </p>
                    )}
                </div>

                {/* Reviews List */}
                <div className="lg:w-2/3">
                    <h3 className="text-xl font-semibold mb-6">
                        Tất cả đánh giá ({reviews.length})
                    </h3>

                    {reviews.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">Chưa có đánh giá nào</p>
                            <p className="text-sm text-gray-400 mt-1">Hãy là người đầu tiên đánh giá sản phẩm này</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-white border rounded-xl p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {review.userAvatar ? (
                                                    <Image
                                                        src={review.userAvatar}
                                                        alt={review.userName || ''}
                                                        width={40}
                                                        height={40}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-5 h-5 text-gray-500" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{review.userName || 'Người dùng'}</p>
                                                    {review.verified && (
                                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">
                                                            Đã mua hàng
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                                            </div>
                                        </div>
                                        {renderStars(review.rating, 'sm')}
                                    </div>

                                    {review.title && (
                                        <h4 className="font-semibold mb-2">{review.title}</h4>
                                    )}
                                    <p className="text-gray-700 mb-4">{review.comment}</p>

                                    {/* Review Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex gap-2 mb-4">
                                            {review.images.map((img, index) => (
                                                <div key={index} className="w-20 h-20 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={`/api/image?filename=${img}`}
                                                        alt={`Review image ${index + 1}`}
                                                        width={80}
                                                        height={80}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Admin Reply */}
                                    {review.adminReply && (
                                        <div className="bg-blue-50 rounded-lg p-4 mt-4">
                                            <p className="text-sm font-medium text-blue-800 mb-1">Phản hồi từ cửa hàng:</p>
                                            <p className="text-sm text-blue-700">{review.adminReply}</p>
                                        </div>
                                    )}

                                    {/* Helpful */}
                                    {session && (
                                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                                        <button
                                            onClick={() => handleHelpful(review.id)}
                                            className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                        >
                                            <ThumbsUp className="w-4 h-4" />
                                            Hữu ích ({review.helpfulCount || 0})
                                        </button>
                                    </div> )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Write Review Dialog */}
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Viết đánh giá</DialogTitle>
                        <DialogDescription>
                            Chia sẻ trải nghiệm của bạn về sản phẩm
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Rating */}
                        <div className="text-center">
                            <p className="text-sm text-gray-500 mb-2">Đánh giá của bạn</p>
                            {renderStars(reviewForm.rating, 'lg', true, (r) => setReviewForm({ ...reviewForm, rating: r }))}
                            <p className="text-sm text-gray-500 mt-2">
                                {reviewForm.rating === 5 && 'Tuyệt vời'}
                                {reviewForm.rating === 4 && 'Tốt'}
                                {reviewForm.rating === 3 && 'Bình thường'}
                                {reviewForm.rating === 2 && 'Không hài lòng'}
                                {reviewForm.rating === 1 && 'Rất tệ'}
                            </p>
                        </div>

                        {/* Title */}
                        <div className="space-y-2">
                            <Label>Tiêu đề (tùy chọn)</Label>
                            <Input
                                value={reviewForm.title}
                                onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                                placeholder="Tóm tắt đánh giá của bạn"
                            />
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <Label>Nội dung đánh giá *</Label>
                            <Textarea
                                value={reviewForm.comment}
                                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                placeholder="Chia sẻ chi tiết trải nghiệm của bạn..."
                                rows={5}
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setShowWriteReview(false);
                                    setReviewForm({ rating: 5, title: '', comment: '' });
                                }}
                            >
                                Hủy
                            </Button>
                            <Button onClick={handleSubmitReview} disabled={isLoading}>
                                {isLoading ? (
                                    'Đang gửi...'
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 mr-2" />
                                        Gửi đánh giá
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ProductReviews;
