import { sendRequest } from "@/app/util/api";
import ManageOrders from "@/app/components/admin/manage.orders";
import { getSession } from "@/app/lib/auth/authOptions";

const AdminOrdersPage = async () => {
    const session = await getSession();

    const res = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders/admin`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
        queryParams: {
            page: 1,
            pageSize: 100
        },
        nextOption: {
            next: { tags: ['admin-orders'] }
        }
    });

    const orders = res?.data?.result || [];

    return <ManageOrders orders={orders} />;
};

export default AdminOrdersPage;
