import OrderDashboard from '@/app/components/statistical/page';
import { sendRequest } from '@/app/util/api';
import React from 'react';

const DashboardPage = async () => {

    const resProducts = await sendRequest<IBackendRes<IModelPaginate<IOrder>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/orders`,
        method: 'GET'
    });
    const orders = resProducts.data?.result || [] as IOrder[];
    return (
        <OrderDashboard orders={orders} />
    );
}

export default DashboardPage;
