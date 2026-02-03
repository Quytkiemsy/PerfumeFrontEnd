import OrdersPage from "@/app/components/orders/orders.page";
import { authOptions } from '@/app/lib/auth/authOptions';
import { sendRequest } from "@/app/util/api";
import { getServerSession } from "next-auth";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Đơn Hàng Của Tôi',
    description: 'Xem lịch sử đơn hàng và theo dõi tình trạng giao hàng tại Perfume Shop.',
    robots: {
        index: false,
        follow: false,
    },
};

const MyOrdersPage = async () => {
    const session = await getServerSession(authOptions);
    console.log("accessToken", session?.accessToken);
    const sortedOrdersByPrice = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: 'GET',
        queryParams: {
            page: 0,
            size: 10,
            sort: 'createdAt,asc',
        },
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        }

    });
    return (
        <OrdersPage orders={sortedOrdersByPrice.data?.result as IOrder[]} />
    );
}

export default MyOrdersPage;
