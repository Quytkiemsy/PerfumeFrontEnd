// components/ProductCard.tsx
'use client';
import { formatPrice, getMinPrice } from "@/app/util/api";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
    product: IProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    console.log("ProductCard", product);

    return (
        <div className="h-100 relative bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 hover:scale-105 group">
            {/* Badge new */}
            {product.new && (
                <span className="absolute top-3 left-3 bg-red-500 text-white rounded-full px-2 py-1 text-xs font-bold z-10 shadow">
                    MỚI
                </span>
            )}
            {/* Product Image */}
            <Link href={`/product/${product.id}`} className="block">
                <Image
                    src={`/api/image?filename=${product?.images[0]}`}
                    alt={product.name}
                    width={400}
                    height={270}
                    className="w-full h-48 object-cover object-center transition group-hover:scale-105 duration-300"
                    style={{ aspectRatio: '4/3' }}
                />
            </Link>
            {/* Info */}
            <div className="p-4 flex flex-col gap-2">
                <Link href={`/product/${product.id}`} className="text-base font-semibold text-gray-900 hover:text-primary line-clamp-1 transition">
                    {product.name}
                </Link>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    {product.brand?.name && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.brand.name}</span>}
                    {product.tier && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.tier}</span>}
                    {product.sex && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.sex}</span>}
                    {product.fragranceTypes?.name && <span className="bg-gray-100 px-2 py-0.5 rounded">{product.fragranceTypes.name}</span>}
                </div>
                <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-black">
                        {product.perfumeVariants ? formatPrice(getMinPrice(product.perfumeVariants)) : '0'}đ
                    </span>
                    <span className="text-xs text-gray-600">
                        {product.perfumeVariants?.length ? `${product.perfumeVariants.length} phiên bản` : ''}
                    </span>
                </div>
                <div className="text-xs text-gray-600 line-clamp-2 min-h-[32px]">
                    {product.description}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    Dung tích: {product?.perfumeVariants?.map((v) => v.volume ? `${v.volume}ml` : '').filter(Boolean).join(', ')}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;