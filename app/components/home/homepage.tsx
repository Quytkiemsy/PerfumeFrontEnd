import ProductGrid from "@/app/components/home/product.home";
import { authOptions } from "@/app/lib/auth/authOptions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

interface IProductProps {
    luxuryProduct: IProduct;
    menProduct: IProduct;
    womenProduct: IProduct;
    unisexProduct: IProduct;
    vintageVibeProduct: IProduct;
    chanelProduct: IProduct;
    diorProduct: IProduct;
    byredoProduct: IProduct;
    tomFordProduct: IProduct;
    sortedProductByPrice: IProduct[];
}

const imageSizes = {
    banner: "100vw",
    twoCol: "(max-width: 768px) 100vw, 50vw",
    threeCol: "(max-width: 768px) 100vw, 33vw",
};

const Homepage = async ({ luxuryProduct, menProduct, womenProduct, unisexProduct, vintageVibeProduct,
    chanelProduct, diorProduct, byredoProduct, tomFordProduct, sortedProductByPrice }: IProductProps) => {
    const session = await getServerSession(authOptions);
    console.log(session)
    return (
        <>
            <section className="w-full overflow-hidden">
                {/* Banner lớn */}
                <div className="relative w-full h-[800px]">
                    <Image
                        src={`/api/image?filename=${luxuryProduct?.images[0]}`}
                        alt={luxuryProduct?.name}
                        fill
                        className="object-cover"
                        priority
                        sizes={imageSizes.banner}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                        <h2 className="text-4xl md:text-3xl font-semibold">Not a mirage</h2>
                        <Link href={`/product?tier=LUXURY`} className="mt-2 text-sm underline hover:no-underline">
                            Just hot new vacation things
                        </Link>
                    </div>
                </div>

                {/* Headline */}
                <div className="text-center px-4 py-12">
                    <h3 className="text-2xl md:text-xl font-bold">
                        Being naked is the #1 most sustainable option. We’re #2.
                    </h3>
                </div>

                {/* Grid hình ảnh */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4 pb-12">
                    {/* Item 1 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${menProduct?.images[0]}`}
                                alt={menProduct?.name}
                                fill
                                priority
                                className="object-cover"
                                sizes={imageSizes.threeCol}
                            />
                        </div>
                        <Link href={`/product?sex=MEN`} className="mt-3 text-sm hover:no-underline font-extrabold">
                            Best of Ref
                        </Link>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${womenProduct?.images[0]}`}
                                alt={womenProduct?.name}
                                fill
                                priority
                                className="object-cover"
                                sizes={imageSizes.threeCol}
                            />
                        </div>
                        <Link href={`/product?sex=WOMEN`} className="mt-3 text-sm hover:no-underline font-extrabold">
                            Vacation Time
                        </Link>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src={`/api/image?filename=${unisexProduct?.images[0]}`}
                                alt={unisexProduct?.name}
                                fill
                                priority
                                className="object-cover"
                                sizes={imageSizes.threeCol}
                            />
                        </div>
                        <Link href={`/product?sex=UNISEX`} className="mt-3 text-sm hover:no-underline font-extrabold">
                            Weddings and Parties
                        </Link>
                    </div>


                </div>
            </section>
            <section className="w-full">
                {/* Phần 2 hình lớn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative w-full h-[600px]">
                        <Image
                            src={`/api/image?filename=${vintageVibeProduct?.images[0]}`}
                            alt={vintageVibeProduct?.name}
                            fill
                            className="object-cover"
                            sizes={imageSizes.twoCol}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Vintage Vibe</h2>
                            <Link href={`/product?brand=Vintage+Vibe`} className="text-md hover:no-underline">
                                <p className="text-md">→ These perfumes, for one</p>
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full h-[600px]">
                        <Image
                            src={`/api/image?filename=${chanelProduct?.images[0]}`}
                            alt={chanelProduct?.name}
                            fill
                            className="object-cover"
                            sizes={imageSizes.twoCol}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Chanel</h2>
                            <Link href={`/product?brand=Chanel`} className="text-md hover:no-underline">
                                <p className="text-md">→ These perfumes, for one</p>
                            </Link>
                        </div>

                    </div>
                </div>

                {/* Phần 3 hình nhỏ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={`/api/image?filename=${diorProduct?.images[0]}`}
                            alt={diorProduct?.name}
                            fill
                            className="object-cover"
                            sizes={imageSizes.threeCol}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Dior</h2>
                            <Link href={`/product?brand=Dior`} className="text-md hover:no-underline">
                                <p className="text-md">→ These perfumes, for one</p>
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={`/api/image?filename=${byredoProduct?.images[0]}`}
                            alt={byredoProduct?.name}
                            fill
                            className="object-cover"
                            sizes={imageSizes.threeCol}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h3 className="text-2xl font-bold mb-2">Byredo</h3>
                            <Link href={`/product?brand=Byredo`} className="text-md hover:no-underline">
                                <p className="text-md">→ These perfumes, for one</p>
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src={`/api/image?filename=${tomFordProduct?.images[0]}`}
                            alt={tomFordProduct?.name}
                            fill
                            className="object-cover"
                            sizes={imageSizes.threeCol}
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h3 className="text-2xl font-bold mb-2">Tom Ford</h3>
                            <Link href={`/product?brand=Tom+Ford`} className="text-md hover:no-underline">
                                <p className="text-md">→ Reformation x Devon Lee Carlson</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <ProductGrid sortedProductByPrice={sortedProductByPrice} />

        </>
    );
};

export default Homepage;
