import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Sản Phẩm Yêu Thích',
    description: 'Danh sách nước hoa yêu thích của bạn tại Perfume Shop.',
    robots: {
        index: false,
        follow: false,
    },
};

export default function LikeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
