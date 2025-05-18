import ListProduct from '@/app/components/productDetail/product.list';
import { sendRequest } from '@/app/util/api';
const Page = async () => {

    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`;
    const res = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
        url: url,
        method: 'GET',
        queryParams: {
            page: 0,
            size: 8,
        },
        nextOption: {
            cache: 'no-store'
        }
    });

    return (
        <>
            <ListProduct products={res.data?.result ?? []} />
        </>
    );
}

export default Page;
