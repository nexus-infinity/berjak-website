export default function Offers() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-berjak-light rounded-lg overflow-hidden">
            <div className="p-8">
              <h1 className="text-3xl font-bold text-berjak-primary mb-6">
                Current Offers
              </h1>
              
              <div className="prose max-w-none text-berjak-text">
                <p className="mb-6">
                  Welcome to our current offers page. Please contact us directly for the
                  most up-to-date pricing and availability of materials.
                </p>
                
                <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-berjak-primary mb-4">
                    How to Request Current Offers
                  </h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Contact our trading desk via phone or email</li>
                    <li>Specify the materials you're interested in</li>
                    <li>Provide your required quantities</li>
                    <li>Ask about current market conditions and pricing</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-berjak-primary mb-4">
                    Contact Information
                  </h2>
                  <p className="mb-2">
                    Phone:{" "}
                    <a
                      href="tel:+61395966999"
                      className="text-berjak-primary hover:underline"
                    >
                      61-3-9596 6999
                    </a>
                  </p>
                  <p>
                    Email:{" "}
                    <a
                      href="mailto:trading@berjak.com.au"
                      className="text-berjak-primary hover:underline"
                    >
                      trading@berjak.com.au
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

