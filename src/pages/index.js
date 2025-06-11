import Link from 'next/link'

export default function Home() {
  return (
    <div className="py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-berjak-primary to-berjak-secondary text-white rounded-lg overflow-hidden mb-16">
          <div className="px-6 py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl font-bold mb-6">
                  Berjak & Partners
                </h1>
                <p className="text-xl mb-4 opacity-95">
                  Trading in Ferrous/Non Ferrous Metals & Minerals since 1954
                </p>
                <p className="text-lg mb-8 opacity-85">
                  Over 70 years of expertise in global metals and minerals trading
                </p>
                <div className="space-x-4">
                  <Link
                    href="/products"
                    className="inline-block bg-white text-berjak-primary px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    View Products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-block border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-berjak-primary transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="relative h-96">
                <img
                  src="/images/img_home.gif"
                  alt="Berjak & Partners Trading"
                  className="w-full h-full object-cover rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-berjak-primary mb-4">Expertise</h3>
              <p className="text-berjak-text text-lg">
                Over 70 years of experience in trading ferrous and non-ferrous metals across global markets
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-berjak-primary mb-4">Global Reach</h3>
              <p className="text-berjak-text text-lg">
                International trading network spanning Australasia, Asia, Middle East, Europe and South Africa
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-berjak-primary mb-4">Quality Service</h3>
              <p className="text-berjak-text text-lg">
                Committed to providing exceptional service and premium quality materials to our global partners
              </p>
            </div>
          </div>
        </div>

        {/* Products Preview */}
        <div className="bg-gray-50 py-16 rounded-xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-berjak-primary mb-4">
              Our Trading Specialties
            </h2>
            <p className="text-xl text-berjak-text">
              Comprehensive range of metals and minerals
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-berjak-primary mb-2">Ferrous Metals</h3>
              <p className="text-berjak-text">Steel, iron, and alloys</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-berjak-primary mb-2">Non-Ferrous</h3>
              <p className="text-berjak-text">Aluminum, copper, brass</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-berjak-primary mb-2">Mineral Sands</h3>
              <p className="text-berjak-text">Rutile, ilmenite, zircon</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-lg font-semibold text-berjak-primary mb-2">Specialty Materials</h3>
              <p className="text-berjak-text">High-temp alloys, drosses</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="inline-block bg-berjak-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-berjak-secondary transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
    </div>
  )
}
