import Homepage from "@/app/components/home/homepage";
import { authOptions } from "@/app/lib/auth/authOptions";
import { sendRequest } from "@/app/util/api";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

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

  const vintageVibeProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Vintage Vibe'",
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
  const byredoProduct = await sendRequest<IBackendRes<IModelPaginate<IProduct>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/products`,
    method: 'GET',
    queryParams: {
      page: 0,
      size: 1,
      filter: "brand.name='Byredo'",
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
      size: 4,
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
        vintageVibeProduct={vintageVibeProduct.data?.result[0] as IProduct}
        chanelProduct={chanelProduct.data?.result[0] as IProduct}
        diorProduct={diorProduct.data?.result[0] as IProduct}
        byredoProduct={byredoProduct.data?.result[0] as IProduct}
        tomFordProduct={tomFordProduct.data?.result[0] as IProduct}
        sortedProductByPrice={sortedProductByPrice.data?.result || [] as IProduct[]}
      />
    </div>
  );
}
