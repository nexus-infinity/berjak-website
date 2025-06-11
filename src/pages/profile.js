export default function Profile() {
  return (
    <div className="py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-berjak-primary to-berjak-secondary text-white rounded-lg mb-12">
          <div className="container mx-auto px-6 py-16">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold mb-6">
                  Berjak & Partners
                </h1>
                <p className="text-xl mb-4">
                  Trading in Ferrous/Non Ferrous Metals & Minerals since 1954
                </p>
                <p className="text-lg opacity-90">
                  Over 70 years of expertise in global metals and minerals trading
                </p>
              </div>
              <div className="relative h-80">
                <img
                  src="/images/img_profile.jpg"
                  alt="Berjak & Partners Profile"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company History */}
        <div className="mb-16">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-berjak-primary mb-6">
                  Our Heritage
                </h2>
                <div className="prose prose-lg text-berjak-text">
                  <p className="mb-4">
                    Berjak was founded in Melbourne, Australia in 1954, originally trading as 
                    Berjak Australia Pty Ltd, and now operates as Berjak & Partners.
                  </p>
                  <p className="mb-4">
                    We are active traders in Minerals, Steel, Semis, Reusables, Non Ferrous, 
                    Semis, Drosses and Scrap across multiple regions including Australasia, 
                    Oceania, South and South East Asia, Middle East, Europe and South Africa.
                  </p>
                </div>
              </div>
              
              <div className="bg-berjak-light p-8 rounded-lg">
                <h3 className="text-2xl font-semibold text-berjak-primary mb-6">
                  Professional Memberships
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-berjak-primary rounded-full mt-2 mr-4"></div>
                    <p className="text-berjak-text">
                      Victorian Chamber of Commerce and Industry
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-berjak-primary rounded-full mt-2 mr-4"></div>
                    <p className="text-berjak-text">
                      French Chamber of Commerce
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Reach */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-berjak-primary mb-12">
              Global Trading Network
            </h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[
                'Australasia',
                'Oceania', 
                'South Asia',
                'Southeast Asia',
                'Middle East',
                'Europe',
                'South Africa'
              ].map((region) => (
                <div key={region} className="bg-berjak-lighter p-6 rounded-lg text-center">
                  <h3 className="font-semibold text-berjak-primary">{region}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trading Specialties */}
        <div className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-berjak-primary mb-12">
              Trading Specialties
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Minerals', desc: 'High-quality mineral trading across global markets' },
                { title: 'Steel & Semis', desc: 'Steel products and semi-finished materials' },
                { title: 'Non Ferrous Metals', desc: 'Aluminum, copper, and other non-ferrous materials' },
                { title: 'Reusables', desc: 'Sustainable recycled materials and products' },
                { title: 'Drosses', desc: 'Metal recovery and processing materials' },
                { title: 'Scrap Materials', desc: 'Quality scrap metal processing and trading' }
              ].map((specialty) => (
                <div key={specialty.title} className="bg-white p-6 rounded-lg shadow-lg border border-berjak-light">
                  <h3 className="text-xl font-semibold text-berjak-primary mb-3">
                    {specialty.title}
                  </h3>
                  <p className="text-berjak-text">{specialty.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-berjak-primary text-white py-16">
          <div className="container mx-auto px-6 text-center">
            <div className="mb-8">
              <img
                src="/images/logo02.gif"
                alt="Berjak Logo"
                width={114}
                height={65}
                className="mx-auto mb-6"
              />
            </div>
            <div className="space-y-2 text-lg">
              <p>240 Bay Street, Brighton Australia 3186</p>
              <p>Phone: +61-3-9596 6999 | Fax: +61-3-9596 8024</p>
              <p>
                Email: <a href="mailto:trading@berjak.com.au" className="underline hover:text-berjak-light">
                  trading@berjak.com.au
                </a>
              </p>
            </div>
          </div>
        </div>
    </div>
  )
}
