
import PerfumeAdminDashboard from "@/app/components/admin/manage.product";
import { sendRequest } from "@/app/util/api";


export default async function AdminDashboard() {
    const resProducts = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
        method: 'GET'
    });
    const products = resProducts.data?.result || [] as IProduct[];
    const resBrands = await sendRequest<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
        method: 'GET',
    });

    const brands = resBrands.data?._embedded.brands || [] as IBrand[];
    return <PerfumeAdminDashboard products={products} brands={brands} />;
}