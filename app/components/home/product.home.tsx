'use client';

import Image from 'next/image';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

interface Product {
    id: number;
    name: string;
    price: number;
    category?: string;
    imageUrl: string;
}

const products: Product[] = [
    {
        id: 1,
        name: 'Everett Linen Dress',
        price: 8385200,
        category: 'Spring Things',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6Ux75AXGv1rvA5SfH7e5wyDo8Q8wuqNb_g&s',
    },
    {
        id: 2,
        name: 'Monette Linen Dress',
        price: 5571400,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6Ux75AXGv1rvA5SfH7e5wyDo8Q8wuqNb_g&s',
    },
    {
        id: 3,
        name: 'Bess Linen Top',
        price: 4727200,
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6Ux75AXGv1rvA5SfH7e5wyDo8Q8wuqNb_g&s',
    },
    {
        id: 4,
        name: 'Aubree Linen Dress',
        price: 2757600,
        category: 'Spring Things',
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH6Ux75AXGv1rvA5SfH7e5wyDo8Q8wuqNb_g&s',
    },
];

export default function ProductGrid() {

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
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col space-y-2">
                            <div className="relative w-full h-80">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-md"
                                />
                            </div>
                            <div className="text-sm font-medium">{product.name}</div>
                            <div className="text-sm font-semibold">₫ {product.price.toLocaleString()}</div>
                            {product.category && (
                                <div className="text-xs text-gray-500">{product.category}</div>
                            )}
                        </div>
                    ))}
                </div>

                <button className="border px-6 py-2 rounded-md hover:bg-black hover:text-white transition">
                    Show more
                </button>
            </div>
            <div className=" hidden max-md:flex  flex-col items-center space-y-8 py-10">
                <h2 className="text-2xl font-semibold">We're cute, too</h2>

                <div className="w-full max-w-6xl px-6">
                    <div ref={sliderRef} className="keen-slider">
                        {products.map((product) => (
                            <div key={product.id} className="keen-slider__slide flex flex-col space-y-2">
                                <div className="relative w-full h-50 rounded-md overflow-hidden">
                                    <Image
                                        src={product.imageUrl}
                                        alt={product.name}
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                                <div className="text-sm font-medium">{product.name}</div>
                                <div className="text-sm font-semibold">₫ {product.price.toLocaleString()}</div>
                                {product.category && (
                                    <div className="text-xs text-gray-500">{product.category}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button className="border px-6 py-2 rounded-md hover:bg-black hover:text-white transition">
                    Show more
                </button>
            </div>
        </>

    );
}


