'use server';

import { revalidateTag, revalidatePath } from 'next/cache';

export async function revalidateAddresses() {
    revalidateTag('user-addresses');
}

export async function revalidateAdminUsers() {
    revalidateTag('admin-users');
}

// Revalidate a specific product page (ISR on-demand)
export async function revalidateProduct(productId: string | number) {
    revalidateTag(`product-${productId}`);
}

// Revalidate all products list
export async function revalidateProductsList() {
    revalidateTag('products-list');
}

// Revalidate product page by path
export async function revalidateProductPage(productId: string | number) {
    revalidatePath(`/product/${productId}`);
}

// Revalidate multiple products at once
export async function revalidateProducts(productIds: (string | number)[]) {
    productIds.forEach(id => {
        revalidateTag(`product-${id}`);
    });
}
