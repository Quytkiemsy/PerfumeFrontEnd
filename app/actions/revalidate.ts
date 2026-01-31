'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateAddresses() {
    revalidateTag('user-addresses');
}

export async function revalidateAdminUsers() {
    revalidateTag('admin-users');
}
