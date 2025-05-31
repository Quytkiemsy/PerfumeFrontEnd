// components/ProductCard.tsx
'use client';
import { formatPrice, getMinPrice } from "@/app/util/api";
import Image from "next/image";
import Link from "next/link";
import { MdFiberNew } from "react-icons/md";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

    return (
        <div className="bg-white h-105 md:h-75 lg:h-90 border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-transform transform hover:scale-105">
            {product.new && (
                <span className="absolute top-2 left-2  rounded-full p-1 z-10">
                    <MdFiberNew size={25} color="black" />
                </span>
            )}
            <Image
                src={`/api/image?filename=${product?.images[0]}`}
                alt={product.name}
                width={300}
                height={200}
                className="w-full object-cover object-center"
                style={{ width: '100%', aspectRatio: '3/2', objectFit: 'cover', objectPosition: 'center' }}
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