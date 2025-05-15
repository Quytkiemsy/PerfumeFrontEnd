const FilterProduct = () => {
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
                <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500">
                    <option value="">Tất cả</option>
                    <option value="urban-trends">Urban Trends</option>
                    <option value="eco-chic">Eco Chic</option>
                </select>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">Dung tích (ml)</h3>
                <div className="space-y-2">
                    <label className="flex items-center text-gray-700">
                        <input type="checkbox" className="mr-2 focus:ring-2 focus:ring-gray-500" /> 50ml
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input type="checkbox" className="mr-2 focus:ring-2 focus:ring-gray-500" /> 75ml
                    </label>
                    <label className="flex items-center text-gray-700">
                        <input type="checkbox" className="mr-2 focus:ring-2 focus:ring-gray-500" /> 100ml
                    </label>
                </div>
            </div>
        </div>
    );
}

export default FilterProduct;
