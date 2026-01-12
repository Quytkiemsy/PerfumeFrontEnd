import Homepage from "@/app/components/home/homepage";
import { sendRequest } from "@/app/util/api";

export default async function Home() {

  const luxuryProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "tier='luxury'",
    },
  });

  const menProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "sex='men'",
    },
  });

  const womenProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "sex='women'",
    },
  });

  const unisexProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "sex='UNISEX'",
    },
  });

  const calvinKleinProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Calvin Klein'",
    },
  });
  const chanelProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Chanel'",
    },
  });
  const diorProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Dior'",
    },
  });
  const versaceProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Versace'",
    },
  });
  const tomFordProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Tom Ford'",
    },
  });

  const sortedProductByPrice = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 6,
      sort: 'perfumeVariants.price,asc',
    },
  });


  return (
    <div>
      <Homepage
        luxuryProduct={luxuryProduct.data?.result[0] as IProduct}
        menProduct={menProduct.data?.result[0] as IProduct}
        womenProduct={womenProduct.data?.result[0] as IProduct}
        unisexProduct={unisexProduct.data?.result[0] as IProduct}
        calvinKleinProduct={calvinKleinProduct.data?.result[0] as IProduct}
        chanelProduct={chanelProduct.data?.result[0] as IProduct}
        diorProduct={diorProduct.data?.result[0] as IProduct}
        versaceProduct={versaceProduct.data?.result[0] as IProduct}
        tomFordProduct={tomFordProduct.data?.result[0] as IProduct}
        sortedProductByPrice={sortedProductByPrice.data?.result || [] as IProduct[]}
      />
    </div>
  );
}
