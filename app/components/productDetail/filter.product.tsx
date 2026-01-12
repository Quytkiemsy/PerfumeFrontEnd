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
        <aside className="w-full lg:w-80 shrink-0">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        🔍 Filters
                    </h2>
                </div>

                <div className="p-6 flex flex-col gap-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
                    {/* Price Filter */}
                    <section className="pb-6 border-b border-gray-100">
                        <h3 className="text-xs font-bold mb-4 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            💰 Price Range
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-2 gap-2">
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
                                    className="text-center border-2 border-gray-200 rounded-lg py-2 px-2 bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-xs transition-all"
                                    placeholder="From"
                                />
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
                                    className="text-center border-2 border-gray-200 rounded-lg py-2 px-2 bg-gray-50 text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 text-xs transition-all"
                                    placeholder="To"
                                />
                            </div>
                            <button
                                className="w-full py-2.5 rounded-lg bg-gradient-to-r from-gray-800 to-gray-900 text-white font-bold hover:from-gray-900 hover:to-black transition-all duration-300 text-xs shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                                onClick={commitRange}
                                type="button"
                            >
                                Apply Filter
                            </button>
                        </div>
                    </section>

                    {/* Brand Filter */}
                    <section className="pb-6 border-b border-gray-100">
                        <h3 className="text-xs font-bold mb-4 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            🏷️ Brand
                        </h3>
                        <select
                            onChange={e => updateParams('brand', e.target.value)}
                            value={searchParams.get('brand') || ''}
                            className="w-full p-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 bg-gray-50 text-gray-700 font-semibold transition-all cursor-pointer hover:border-gray-300 text-sm"
                        >
                            <option value="">All Brands</option>
                            {brands?.map((brand, i) => (
                                <option key={i} value={brand.name}>{brand.name}</option>
                            ))}
                        </select>
                    </section>

                    {/* Volume Filter */}
                    <section className="pb-6 border-b border-gray-100">
                        <h3 className="text-xs font-bold mb-4 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            💧 Volume (ml)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {VOLUMES_OPTIONS.map((volume, i) => (
                                <label 
                                    key={i} 
                                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer select-none transition-all duration-300 border-2 font-bold text-xs
                                        ${isChecked(volume)
                                            ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-900 shadow-lg'
                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        onChange={e => updateParams(volume, e.target.checked)}
                                        checked={isChecked(volume)}
                                    />
                                    <span>{volume}ml</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Sex Filter */}
                    <section className="pb-6 border-b border-gray-100">
                        <h3 className="text-xs font-bold mb-4 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            👥 Gender
                        </h3>
                        <div className="flex flex-col gap-2">
                            {SEX_OPTIONS.map((sex, i) => {
                                const isSelected = searchParams.get('sex') === sex;
                                const icon = sex === 'MALE' ? '👨' : sex === 'FEMALE' ? '👩' : '👥';
                                return (
                                    <label 
                                        key={i} 
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 border-2 font-semibold text-sm
                                            ${isSelected
                                                ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-900 shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="sex"
                                            value={sex}
                                            checked={isSelected}
                                            onChange={e => updateParams('sex', e.target.value)}
                                            className="hidden"
                                        />
                                        <span>{icon}</span>
                                        <span className="text-xs">{sex.charAt(0).toUpperCase() + sex.slice(1).toLowerCase()}</span>
                                    </label>
                                );
                            })}
                            {/* Radio all */}
                            <label className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 border-2 font-semibold text-sm
                                ${!searchParams.get('sex')
                                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="sex"
                                    value=""
                                    checked={!searchParams.get('sex')}
                                    onChange={() => updateParams('sex', undefined)}
                                    className="hidden"
                                />
                                <span>🌟</span>
                                <span className="text-xs">All</span>
                            </label>
                        </div>
                    </section>

                    {/* Tier Filter */}
                    <section>
                        <h3 className="text-xs font-bold mb-4 text-gray-800 uppercase tracking-wider flex items-center gap-2">
                            ⭐ Tier
                        </h3>
                        <div className="flex flex-col gap-2">
                            {TIERS_OPTIONS.map((tier, i) => {
                                const isSelected = searchParams.get('tier') === tier;
                                return (
                                    <label 
                                        key={i} 
                                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 border-2 font-semibold text-sm
                                            ${isSelected
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white border-orange-500 shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                    >
                                        <input
                                            type="radio"
                                            name="tier"
                                            value={tier}
                                            checked={isSelected}
                                            onChange={e => updateParams('tier', e.target.value)}
                                            className="hidden"
                                        />
                                        <span>⭐</span>
                                        <span className="text-xs">{tier.charAt(0).toUpperCase() + tier.slice(1).toLowerCase()}</span>
                                    </label>
                                );
                            })}
                            {/* Radio all */}
                            <label className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 border-2 font-semibold text-sm
                                ${!searchParams.get('tier')
                                    ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white border-gray-900 shadow-md'
                                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="tier"
                                    value=""
                                    checked={!searchParams.get('tier')}
                                    onChange={() => updateParams('tier', undefined)}
                                    className="hidden"
                                />
                                <span>🌟</span>
                                <span className="text-xs">All</span>
                            </label>
                        </div>
                    </section>
                </div>
            </div>
        </aside>
    );
}

export default FilterProduct;
