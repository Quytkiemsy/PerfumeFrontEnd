'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface IProductDetailProps {
    product: IProduct | null;
}

export default function ProductDetail({ product }: IProductDetailProps) {
    const [selectVar, setSelectVar] = useState<string>('');
    const [selectedVolume, setSelectedVolume] = useState<string>('');

    console.log(product);

    // Hàm xử lý zoom động
    const handleMouseMove = (e: any, imgRef: any) => {
        const rect = imgRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left; // Tọa độ X tương đối với hình ảnh
        const y = e.clientY - rect.top; // Tọa độ Y tương đối với hình ảnh
        const xPercent = (x / rect.width) * 100; // Tính phần trăm X
        const yPercent = (y / rect.height) * 100; // Tính phần trăm Y

        // Cập nhật transform-origin
        imgRef.current.style.transformOrigin = `${xPercent}% ${yPercent}%`;
    };

    // Tham chiếu cho các hình ảnh
    const mainImgRef = useRef<HTMLImageElement | null>(null);

    return (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3  gap-8">
            {/* Images */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 ">
                <div className="md:col-span-2 relative aspect-[4/3] md:border-b md:border-r border-gray-300 overflow-hidden">
                    <Image
                        ref={mainImgRef}
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt="Close up"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-150"
                        onMouseMove={(e) => handleMouseMove(e, mainImgRef)}
                        onMouseLeave={() => {
                            if (mainImgRef.current) {
                                mainImgRef.current.style.transformOrigin = 'center center';
                            }
                        }}
                    />
                </div>
                <div className="relative aspect-[4/3] md:border-b md:border-r border-gray-300 overflow-hidden">
                    <Image
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt="Close up"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-160" />
                </div>
                <div className="relative aspect-[4/3] md:border-b md:border-r border-gray-300 overflow-hidden" >
                    <Image
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt="Back view"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-160" />
                </div>

            </div>

            {/* Info */}
            <div>
                <h1 className="text-2xl font-semibold ">{product?.name}</h1>
                {/* Brand */}
                <p className="text-sm text-gray-600 mb-2">{product?.brand?.name}</p>
                <p className="text-xl font-bold mb-4">
                    ₫ {product?.perfumeVariants?.find((variant) => variant.variantType === selectVar && variant.volume === selectedVolume)?.price?.toLocaleString('en-US') ?? '0'}
                </p>
                {/* Colors */}
                <div className="mb-4">
                    <p className="mb-1 font-medium">Options</p>
                    <div className="flex gap-2">
                        {['FULLBOTTLE', 'DECANT'].map((variant, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectVar(variant)}
                                className={`w-18 h-10 border rounded-md ${variant === selectVar ? 'ring-2 ring-black' : ''}`}
                            >{variant === 'FULLBOTTLE' ? 'FULL' : 'DECANT'}</button>
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                    <p className="mb-1 font-medium">Size</p>
                    <div className="flex flex-wrap gap-2">
                        {
                            product?.perfumeVariants !== null && product?.perfumeVariants?.map((variant, i) => {

                                return (
                                    <button
                                        disabled={selectVar !== variant.variantType}
                                        key={i}
                                        onClick={() => setSelectedVolume(variant.volume ?? '')}
                                        className={`w-15 h-10 flex items-center justify-center border rounded-md ${selectedVolume === variant.volume ? 'ring-2 ring-black' : ''}
                                        ${selectVar !== variant.variantType ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {variant?.volume}ml
                                    </button>
                                )
                            })
                        }



                    </div>
                </div>

                {/* Add to bag */}
                <button className="w-full bg-black text-white py-3 rounded-md mb-4">Add to bag</button>

                {/* Shipping */}
                <p className="text-sm text-gray-600 mb-1">Free express shipping</p>
                <p className="text-sm text-gray-600 mb-1">Duties and taxes are guaranteed</p>
                <p className="text-sm text-gray-600 mb-4">Estimated delivery in 3-8 business days</p>

                {/* Fit */}
                <div className="mb-4">
                    <h2 className="font-semibold mb-1">Decription</h2>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                        <li>{product?.description}</li>
                    </ul>
                </div>

                {/* Details */}
                <div>
                    <h2 className="font-semibold mb-1">The details</h2>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                        <li>{product?.details}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

