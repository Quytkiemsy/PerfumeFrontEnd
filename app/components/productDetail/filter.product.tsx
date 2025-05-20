'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useMemo, useTransition } from 'react'

interface FilterProductProps {
    brands?: IBrand[];
}

const VOLUMES_OPTIONS = ['20', '50', '100', '100+']

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

    return (
        <div className="w-full md:w-1/5 pr-4 mb-4 md:mb-0">
            <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">Khóa giá</h3>
                <input
                    type="range"
                    min="0"
                    max="10000000"
                    defaultValue="8000000"
                    className="w-full appearance-none h-2 bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <span className="text-sm text-gray-600 block mt-2">0đ - 80,000,000đ</span>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Thương hiệu</h3>
                <select onChange={e => updateParams('brand', e.target.value)} defaultValue={searchParams.get('brand') || ''} className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option value="">Tất cả</option>
                    {brands?.map((brand, i) => (
                        <option key={i} value={brand.name}>{brand.name}</option>
                    ))}
                </select>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Dung tích (ml)</h3>
                <div className="space-y-2">
                    {
                        VOLUMES_OPTIONS.map((volume, i) => (
                            <label key={i} className="flex items-center text-gray-700">
                                <input
                                    type="checkbox"
                                    className="mr-2 focus:ring-2 focus:ring-gray-500"
                                    onChange={e => updateParams(volume, e.target.checked)}
                                    checked={isChecked(volume)}
                                /> {volume} ml
                            </label>
                        ))
                    }
                </div>
            </div>
            {isPending && <p className="text-sm text-gray-500">Filtering...</p>}
        </div>
    );
}

export default FilterProduct;
