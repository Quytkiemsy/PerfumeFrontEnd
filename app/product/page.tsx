import ListProduct from '@/app/components/productDetail/product.list';
import { sendRequest } from '../util/api';

type PageProps = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
const Page = async ({ searchParams }: PageProps) => {

    const res = await sendRequest<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
        method: 'GET'
    });

    const brands = res.data?._embedded.brands || [] as IBrand[];


    return (
        <>
            <ListProduct searchParams={searchParams} brands={brands} />
        </>
    );
}

export default Page;
