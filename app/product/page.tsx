

export default function Product() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <header className="py-10 text-center">
        <h1 className="text-5xl font-extrabold">Explore Our Amazing Products</h1>
        <p className="mt-4 text-lg">Discover the best products tailored just for you</p>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 py-10">
        {[1, 2, 3, 4, 5, 6].map((product) => (
          <div
            key={product}
            className="bg-white text-black rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={`/public/product-${product}.jpg`}
              alt={`Product ${product}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-bold">Product {product}</h2>
              <p className="mt-2 text-sm text-gray-600">
                This is a brief description of product {product}. It is amazing and worth exploring.
              </p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Learn More
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}