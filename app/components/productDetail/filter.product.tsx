'use client'
import { SEX_OPTIONS, TIERS_OPTIONS, VOLUMES_OPTIONS } from '@/app/util/api';
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState, useTransition } from 'react'

interface FilterProductProps {
    brands?: IBrand[];
}

const FilterProduct = ({ brands }: FilterProductProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    // Lấy các giá trị brand từ URL
    const selectedVolumes = useMemo(() => {
        return searchParams.getAll('volume')
    }, [searchParams])

    const isChecked = (volume: string) => selectedVolumes.includes(volume)


    const updateParams = (key: string, value: string | boolean | null | undefined) => {
        const params = new URLSearchParams(searchParams.toString())

        if (typeof value === 'boolean') {

            // Xoá tất cả brand cũ để rebuild
            params.delete('volume');

            let updatedVolumes = [...selectedVolumes]

            if (value && typeof value === 'boolean') {
                updatedVolumes.push(key)
            } else {
                updatedVolumes = updatedVolumes.filter((b) => b !== key)
            }

            // Thêm lại tất cả brand
            updatedVolumes.forEach((b) => params.append('volume', b))
        } else {
            if (value === undefined || value === '' || value === null) {
                params.delete(key)     // Xóa nếu rỗng hoặc null
            } else {
                params.set(key, String(value)) // Thêm hoặc update, đảm bảo là string
            }
        }

        startTransition(() => {
            router.push(`?${params.toString()}`)
        })
    }

    // Giá trị mặc định và giới hạn cho khoảng giá
    const minPrice = 0;
    const maxPrice = 5000000;
    // Lấy giá trị từ URL, nếu không có thì dùng mặc định
    const getPriceFromParams = () => {
        const from = Number(searchParams.get('priceFrom'));
        return isNaN(from) || from == 0 ? minPrice : from;
    };
    const getPriceToParams = () => {
        const to = Number(searchParams.get('priceTo'));
        return isNaN(to) || to == 0 ? maxPrice : to;
    };
    // State tạm để tránh lag khi kéo
    const [localPrice, setLocalPrice] = useState<{ from: number, to: number }>({
        from: getPriceFromParams(),
        to: getPriceToParams(),
    });
    // Sync state khi URL thay đổi
    useEffect(() => {
        const from = getPriceFromParams();
        const to = getPriceToParams();
        setLocalPrice({ from, to });
    }, [searchParams]);


    const commitRange = () => {
        // Gộp cả hai giá trị vào URL trong một lần push duy nhất
        let from = localPrice.from;
        let to = localPrice.to;
        if (from > to) from = to;
        if (to < from) to = from;
        const params = new URLSearchParams(searchParams.toString());
        params.set('priceFrom', String(from));
        params.set('priceTo', String(to));
        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <aside className="w-full md:w-1/5 pr-4 mb-4 md:mb-0">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col gap-6">
                {/* Price Filter */}
                <section>
                    <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide uppercase">Khoảng giá</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 mb-2">
                            <input
                                type="text"
                                inputMode="numeric"
                                min={minPrice}
                                max={maxPrice}
                                step="100000"
                                value={localPrice.from.toLocaleString('vi-VN')}
                                onChange={e => {
                                    let val = Number(e.target.value.replace(/[^\d]/g, ''));
                                    if (isNaN(val)) val = minPrice;
                                    setLocalPrice(l => ({ ...l, from: Math.min(val, l.to) }));
                                }}
                                onBlur={commitRange}
                                className="w-3/7 text-center border border-gray-300 rounded-lg p-1 bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                                placeholder="Từ"
                            />
                            <span className="text-gray-400">—</span>
                            <input
                                type="text"
                                inputMode="numeric"
                                min={minPrice}
                                max={maxPrice}
                                step="100000"
                                value={localPrice.to.toLocaleString('vi-VN')}
                                onChange={e => {
                                    let val = Number(e.target.value.replace(/[^\d]/g, ''));
                                    if (isNaN(val)) val = maxPrice;
                                    setLocalPrice(l => ({ ...l, to: Math.max(val, l.from) }));
                                }}
                                onBlur={commitRange}
                                className="w-3/7 text-center border border-gray-300 rounded-lg p-1 bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm"
                                placeholder="Đến"
                            />
                        </div>
                        <button
                            className="w-full py-1 rounded bg-gray-800 text-white font-semibold hover:bg-gray-900 transition text-sm"
                            onClick={commitRange}
                            type="button"
                        >
                            Lọc giá
                        </button>
                    </div>
                </section>

                {/* Brand Filter */}
                <section>
                    <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide uppercase">Thương hiệu</h3>
                    <select
                        onChange={e => updateParams('brand', e.target.value)}
                        value={searchParams.get('brand') || ''}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-50 text-gray-700"
                    >
                        <option value="">Tất cả</option>
                        {brands?.map((brand, i) => (
                            <option key={i} value={brand.name}>{brand.name}</option>
                        ))}
                    </select>
                </section>

                {/* Volume Filter */}
                <section>
                    <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide uppercase">Dung tích (ml)</h3>
                    <div className="flex flex-wrap gap-3">
                        {VOLUMES_OPTIONS.map((volume, i) => (
                            <label key={i} className="flex items-center gap-2 text-gray-700 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer select-none transition hover:bg-gray-200">
                                <input
                                    type="checkbox"
                                    className="accent-gray-700 focus:ring-2 focus:ring-gray-500"
                                    onChange={e => updateParams(volume, e.target.checked)}
                                    checked={isChecked(volume)}
                                />
                                <span>{volume} ml</span>
                            </label>
                        ))}
                    </div>
                </section>
                {/* Sex Filter */}
                <section>
                    <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide uppercase">Giới tính</h3>
                    <div className="flex flex-col gap-2">
                        {SEX_OPTIONS.map((sex, i) => (
                            <label key={i} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="sex"
                                    value={sex}
                                    checked={searchParams.get('sex') === sex}
                                    onChange={e => updateParams('sex', e.target.value)}
                                    className="accent-gray-700"
                                />
                                <span className=''>{sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}</span>
                            </label>
                        ))}
                        {/* Radio all */}
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="sex"
                                value=""
                                checked={!searchParams.get('sex')}
                                onChange={() => updateParams('sex', undefined)}
                                className="accent-gray-700"
                            />
                            <span className=''>Tất cả</span>
                        </label>
                    </div>
                </section>
                {/* Tier Filter */}
                <section>
                    <h3 className="text-base font-bold mb-3 text-gray-800 tracking-wide uppercase">PHÂN KHÚC</h3>
                    <div className="flex flex-col gap-2">
                        {TIERS_OPTIONS.map((tier, i) => (
                            <label key={i} className="flex items-center gap-2 text-gray-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tier"
                                    value={tier}
                                    checked={searchParams.get('tier') === tier}
                                    onChange={e => updateParams('tier', e.target.value)}
                                    className="accent-gray-700"
                                />
                                <span className=''>{tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}</span>
                            </label>
                        ))}
                        {/* Radio all */}
                        <label className="flex items-center gap-2 text-gray-700 cursor-pointer">
                            <input
                                type="radio"
                                name="tier"
                                value=""
                                checked={!searchParams.get('tier')}
                                onChange={() => updateParams('tier', undefined)}
                                className="accent-gray-700"
                            />
                            <span className=''>Tất cả</span>
                        </label>
                    </div>
                </section>
            </div>
        </aside>
    );
}

export default FilterProduct;
