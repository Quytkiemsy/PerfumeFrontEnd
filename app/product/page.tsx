import ListProduct from '@/app/components/productDetail/product.list';
import { sendRequest } from '../util/api';
import { getServerSession } from "next-auth";
import { authOptions } from '../lib/auth/authOptions';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const Page = async ({ searchParams }: PageProps) => {
    const session = await getServerSession(authOptions);

    const res = await sendRequest<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${session?.accessToken}`
        },
    });

    const brands = res.data?._embedded.brands || [] as IBrand[];


    return (
        <>
            <ListProduct searchParams={searchParams} brands={brands} />
        </>
    );
}

export default Page;
