// components/ProductCard.tsx
'use client';
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const getMinPrice = (variants: IPerfumeVariant[]): number => {
        return Math.min(...variants.map((v) => v.price).filter((price): price is number => price !== undefined));
    };

    const formatPrice = (price: number): string => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    return (
        <div className="bg-white h-90 border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            <Image
                src={`/api/image?filename=${product?.images[0]}`}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-50 object-cover"
            />
            <div className="p-4 text-center">
                <Link href={`/product/${product.id}`} className="text-sm font-semibold text-gray-800">{product.name}</Link>
                <p className="text-black font-bold mt-2">
                    {product.perfumeVariants ? formatPrice(getMinPrice(product.perfumeVariants)) : '0'}đ
                </p>
                <p className="text-xs text-gray-600 mt-1">
                    Dung tích: {product?.perfumeVariants?.map((v) => `${v.volume}ml`).join(', ')}
                </p>
                <button
                    className="mt-3 w-full bg-black text-white py-2 rounded hover:bg-black transition"
                    onClick={() => alert(`Đã thêm ${product.name} vào giỏ hàng!`)}
                >
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCard;