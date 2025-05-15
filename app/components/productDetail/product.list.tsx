'use client';

import FilterProduct from '@/app/components/productDetail/filter.product';
import ProductCard from '@/app/components/productDetail/product.card';
import { useEffect, useState } from 'react';

interface IProps {
    products: IProduct[];
}

export default function ListProduct({ products }: IProps) {

    return (
        <div className="container mx-auto p-4 h-200">
            <div className="flex flex-col md:flex-row">
                {/* Bộ lọc bên trái */}
                <FilterProduct />

                {/* Danh sách sản phẩm */}
                <div className="w-full md:w-4/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}