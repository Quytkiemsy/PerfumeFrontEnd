import type { Metadata } from "next";
import "../globals.css";
import Header from "@/app/components/header/header.app";
import Navbar from "@/app/components/navbar/navbar.menu";
import Footer from "@/app/components/footer/footer.app";
import { Toaster } from "react-hot-toast";
import NextAuthWrapper from "@/app/lib/next.auth.wrapper";
import { sendRequest } from "../util/api";
import SessionErrorHandler from "../lib/session.error";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/app/components/seo/JsonLd";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourperfumeshop.com';

export const metadata: Metadata = {
  title: {
    default: "Trang Chủ - Perfume Shop",
    template: "%s | Perfume Shop",
  },
  description: "Khám phá bộ sưu tập nước hoa chính hãng cao cấp. Chanel, Dior, Tom Ford, Versace và nhiều thương hiệu nổi tiếng khác. Giao hàng toàn quốc, cam kết 100% chính hãng.",
  openGraph: {
    title: "Perfume Shop - Nước Hoa Chính Hãng",
    description: "Khám phá bộ sưu tập nước hoa chính hãng cao cấp từ các thương hiệu nổi tiếng thế giới.",
    url: BASE_URL,
    siteName: "Perfume Shop",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const res = await sendRequest<IBackendRes<IModelPaginateRestJPA<IBrand>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/brands`,
    method: 'GET'
  });

  const brands = res.data?._embedded.brands || [] as IBrand[];
  return (
    <>
      <OrganizationJsonLd />
      <WebsiteJsonLd />
      <Header brands={brands} />
      <Navbar brands={brands} />
      {children}
      <Footer />
    </>
  );
}
