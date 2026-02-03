import Link from 'next/link';

export default function ProductNotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
            <div className="text-center">
                {/* Icon */}
                <div className="mb-6">
                    <span className="text-8xl">🔍</span>
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Không tìm thấy sản phẩm
                </h1>
                
                {/* Description */}
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa khỏi hệ thống.
                </p>
                
                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link 
                        href="/product"
                        className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                    >
                        Xem tất cả sản phẩm
                    </Link>
                    <Link 
                        href="/"
                        className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        Về trang chủ
                    </Link>
                </div>
            </div>
        </div>
    );
}
