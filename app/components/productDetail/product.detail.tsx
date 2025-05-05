'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';

const sizes = ['0', '2', '4', '6', '8', '10', '12'];
const colors = [
    '#E3C6BE', '#1B1B1B', '#CAD1D6', '#F6F4EC', '#F1E7C9', '#D5C6B4'
];

interface IProductDetailProps {
    product: IProduct | null;
}

export default function ProductDetail({ product }: IProductDetailProps) {
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [selectedColor, setSelectedColor] = useState<string>('');

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
    const closeUpImgRef = useRef<HTMLImageElement | null>(null);
    const backViewImgRef = useRef<HTMLImageElement | null>(null);

    return (
        <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3  gap-8">
            {/* Images */}
            <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 ">
                <div className="md:col-span-2 relative aspect-[1/1] md:border-b md:border-r border-gray-300 overflow-hidden">
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
                <div className="relative aspect-[3/4] md:border-b md:border-r border-gray-300 overflow-hidden">
                    <Image
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt="Close up"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-160" />
                </div>
                <div className="relative aspect-[3/4] md:border-b md:border-r border-gray-300 overflow-hidden" >
                    <Image
                        src={`/api/image?filename=${product?.images[0]}`}
                        alt="Back view"
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-160" />
                </div>

            </div>

            {/* Info */}
            <div>
                <h1 className="text-2xl font-semibold mb-2">Everett Linen Dress</h1>
                <p className="text-xl font-bold mb-4">₫ {product?.price.toLocaleString('en-US')}</p>

                {/* Colors */}
                <div className="mb-4">
                    <p className="mb-1 font-medium">Color</p>
                    <div className="flex gap-2">
                        {colors.map((color, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedColor(color)}
                                className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'ring-2 ring-black' : ''}`}
                                style={{ backgroundColor: color }}
                            ></button>
                        ))}
                    </div>
                </div>

                {/* Sizes */}
                <div className="mb-4">
                    <p className="mb-1 font-medium">Size</p>
                    <div className="flex flex-wrap gap-2">
                        {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`w-10 h-10 flex items-center justify-center border rounded-md ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black'}`}
                            >
                                {size}
                            </button>
                        ))}
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
                    <h2 className="font-semibold mb-1">The fit</h2>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                        <li>Designed to be fitted at bodice with an A-line skirt</li>
                        <li>Also available in Mini</li>
                        <li>Model is wearing size 0: 175.3cm height, 61cm waist, 87.6cm hips, 86.4cm bust</li>
                    </ul>
                </div>

                {/* Details */}
                <div>
                    <h2 className="font-semibold mb-1">The details</h2>
                    <ul className="list-disc ml-5 text-sm text-gray-700">
                        <li>Back smocking, square neckline</li>
                        <li>Lightweight linen fabric – 100% linen</li>
                        <li>Wash cold + dry flat</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

