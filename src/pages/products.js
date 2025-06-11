const products = {
  ferrous: [
    {
      name: "Steel Scrap",
      image: "/images/img_HMSscrap.jpg",
      description: "High-quality HMS 1&2 steel scrap"
    },
    {
      name: "Rail Scrap",
      image: "/images/img_rail.jpg",
      description: "Used rail materials and components"
    }
  ],
  nonFerrous: [
    {
      name: "Aluminum Products",
      image: "/images/img_UBC.jpg",
      description: "Used beverage cans and aluminum scrap"
    },
    {
      name: "Copper Materials",
      image: "/images/img_nf_copper.jpg",
      description: "Various grades of copper scrap and materials"
    }
  ],
  minerals: [
    {
      name: "Mineral Sands",
      image: "/images/img_minsand.jpg",
      description: "High-grade mineral sand products"
    },
    {
      name: "Rutile Sand",
      image: "/images/img_ms_rutile.jpg",
      description: "Premium quality rutile sand"
    }
  ]
}

export default function Products() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-berjak-primary mb-8">
          Our Products
        </h1>

        {/* Ferrous Materials */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-berjak-secondary mb-6">
            Ferrous Materials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.ferrous.map((product) => (
              <div key={product.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-berjak-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-berjak-text">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Non-Ferrous Materials */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-berjak-secondary mb-6">
            Non-Ferrous Materials
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.nonFerrous.map((product) => (
              <div key={product.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-berjak-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-berjak-text">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Minerals */}
        <section>
          <h2 className="text-2xl font-semibold text-berjak-secondary mb-6">
            Minerals
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.minerals.map((product) => (
              <div key={product.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-berjak-primary mb-2">
                    {product.name}
                  </h3>
                  <p className="text-berjak-text">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

