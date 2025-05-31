'use client';

import Image from 'next/image';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { formatPrice, getMinPrice } from '@/app/util/api';
import Link from 'next/link';

interface IProductProps {
    sortedProductByPrice: IProduct[];
}

const imageSizes = {
    grid: "(max-width: 768px) 100vw, 25vw",
    slider: "(max-width: 768px) 100vw, 50vw"
};

export default function ProductGrid({ sortedProductByPrice }: IProductProps) {

    const [sliderRef] = useKeenSlider<HTMLDivElement>({
        slides: {
            perView: 2, // 👉 mỗi lần hiện 2 sản phẩm
            spacing: 20, // khoảng cách giữa các sản phẩm
        },
        mode: "snap", // cuộn "khớp" từng cụm
    });
    return (
        <>
            <div className="hidden md:flex flex-col items-center space-y-8 py-10">
                <h2 className="text-2xl font-semibold">We're cute, too</h2>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-8 w-full px-4">
                    {sortedProductByPrice.map((product) => (
                        <div key={product.id} className="flex flex-col space-y-2">
                            <div className="relative w-full h-80">
                                <Image
                                    src={`/api/image?filename=${product?.images[0]}`}
                                    alt={product?.name}
                                    fill
                                    className="rounded-md object-cover"
                                    sizes={imageSizes.grid}
                                />
                            </div>
                            <Link href={`/product/${product.id}`} className="text-sm font-semibold text-gray-800">{product.name}</Link>
                            <div className="text-sm font-semibold">{product?.perfumeVariants ? formatPrice(getMinPrice(product?.perfumeVariants)) : '0'}đ</div>
                            {product?.tier && (
                                <div className="text-xs text-gray-500">{product?.tier}</div>
                            )}
                        </div>
                    ))}
                </div>


                <Link href={`/product`} className="mt-2 text-sm hover:no-underline">
                    <button className="border px-6 py-2 rounded-md hover:bg-black hover:text-white transition">
                        Show more
                    </button>
                </Link>
            </div>
            <div className=" hidden max-md:flex  flex-col items-center space-y-8 py-10">
                <h2 className="text-2xl font-semibold">We're cute, too</h2>

                <div className="w-full max-w-6xl px-6">
                    <div ref={sliderRef} className="keen-slider">
                        {sortedProductByPrice.map((product) => (
                            <div key={product.id} className="keen-slider__slide flex flex-col space-y-2">
                                <div className="relative w-full h-50 rounded-md overflow-hidden">
                                    <Image
                                        src={`/api/image?filename=${product?.images[0]}`}
                                        alt={product?.name}
                                        fill
                                        className="object-cover"
                                        sizes={imageSizes.slider}
                                    />
                                </div>
                                <Link href={`/product/${product.id}`} className="text-sm font-semibold text-gray-800">{product.name}</Link>
                                <div className="text-sm font-semibold">{product?.perfumeVariants ? formatPrice(getMinPrice(product?.perfumeVariants)) : '0'}đ</div>
                                {product?.tier && (
                                    <div className="text-xs text-gray-500">{product?.tier}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <Link href={`/product`} className="mt-2 text-sm hover:no-underline">
                    <button className="border px-6 py-2 rounded-md hover:bg-black hover:text-white transition">
                        Show more
                    </button>
                </Link>
            </div>
        </>

    );
}


