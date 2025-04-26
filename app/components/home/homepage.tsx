import ProductGrid from "@/app/components/home/product.home";
import Image from "next/image";

const Homepage = () => {
    return (
        <>
            <section className="w-full overflow-hidden">
                {/* Banner lớn */}
                <div className="relative w-full h-[800px]">
                    <Image
                        src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4110dddc-8ef6-45b0-812d-4463699578f2?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1" // <-- đổi path ảnh nè
                        alt="Banner"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                        <h2 className="text-4xl md:text-3xl font-semibold">Not a mirage</h2>
                        <a href="#" className="mt-2 text-sm underline hover:no-underline">
                            Just hot new vacation things
                        </a>
                    </div>
                </div>

                {/* Headline */}
                <div className="text-center px-4 py-12">
                    <h3 className="text-2xl md:text-xl font-bold">
                        Being naked is the #1 most sustainable option. We’re #2.
                    </h3>
                </div>

                {/* Grid hình ảnh */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 pb-12">
                    {/* Item 1 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4110dddc-8ef6-45b0-812d-4463699578f2?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1"
                                alt="Best of Ref"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 font-bold ">Best of Ref</p>
                    </div>

                    {/* Item 2 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4110dddc-8ef6-45b0-812d-4463699578f2?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1"
                                alt="Vacation Time"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 font-bold">Vacation Time</p>
                    </div>

                    {/* Item 3 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4110dddc-8ef6-45b0-812d-4463699578f2?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1"
                                alt="Weddings and Parties"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 font-bold">Weddings and Parties</p>
                    </div>

                    {/* Item 4 */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-full aspect-[3/4]">
                            <Image
                                src="https://www.ft.com/__origami/service/image/v2/images/raw/ftcms%3A4110dddc-8ef6-45b0-812d-4463699578f2?source=next-article&fit=scale-down&quality=highest&width=1440&dpr=1"
                                alt="Romance Yourself"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-2 font-bold">Romance Yourself</p>
                    </div>
                </div>
            </section>
            <section className="w-full">
                {/* Phần 2 hình lớn */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    <div className="relative w-full h-[600px]">
                        <Image
                            src="https://www.mcaffeine.com/cdn/shop/files/Card_3_8d072214-a28b-4505-8cb1-ebcd4829508a.jpg?v=1727359934&width=1445"
                            alt="Responsible 1"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h2 className="text-3xl font-bold mb-2">Who's responsible</h2>
                            <p className="text-md">→ These clothes, for one</p>
                        </div>
                    </div>
                    <div className="relative w-full h-[600px]">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbz5YhZE3ZW9__AjFNJpxoAKfxLS_Zh0If9A&s"
                            alt="Responsible 2"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>

                {/* Phần 3 hình nhỏ */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_9nUEWVMAowzwH03nYpKTVTO8NUtgPBZVpg&s"
                            alt="Shoes"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h3 className="text-2xl font-bold mb-2">We want to touch your feet</h3>
                            <p className="text-md">→ Shoes</p>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu2ObcZHj6_pip0bCXtfvydxQdOEfLPeAYDA&s"
                            alt="Sustainability Report"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h3 className="text-2xl font-bold mb-2">The Sustainability Report</h3>
                            <p className="text-md">→ Read our 2024 Year-in-Review</p>
                        </div>
                    </div>
                    <div className="relative w-full h-[400px]">
                        <Image
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCFPw99rrSLnToKtd65WkU5PN116w9_Ybe8Q&s"
                            alt="Girl's best friend"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                            <h3 className="text-2xl font-bold mb-2">A girl's best friend</h3>
                            <p className="text-md">→ Reformation x Devon Lee Carlson</p>
                        </div>
                    </div>
                </div>
            </section>
            <ProductGrid />
        </>
    );
};

export default Homepage;
