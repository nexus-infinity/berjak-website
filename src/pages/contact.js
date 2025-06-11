export default function Contact() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-berjak-light rounded-lg overflow-hidden">
            <img
              src="/images/img_contact.jpg"
              alt="Contact Berjak & Partners"
              className="w-full h-64 object-cover"
            />
            <div className="p-8">
              <h1 className="text-3xl font-bold text-berjak-primary mb-6">
                Contact Us
              </h1>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold text-berjak-secondary mb-4">
                    Office Location
                  </h2>
                  <div className="text-berjak-text">
                    <p className="mb-2">240 Bay Street</p>
                    <p className="mb-2">Brighton, Victoria 3186</p>
                    <p className="mb-2">Australia</p>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-berjak-secondary mb-4">
                    Contact Details
                  </h2>
                  <div className="text-berjak-text">
                    <p className="mb-2">
                      <strong>Phone:</strong>{" "}
                      <a
                        href="tel:+61395966999"
                        className="hover:text-berjak-primary"
                      >
                        61-3-9596 6999
                      </a>
                    </p>
                    <p className="mb-2">
                      <strong>Fax:</strong> 61-3-9596 8024
                    </p>
                    <p className="mb-2">
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:trading@berjak.com.au"
                        className="hover:text-berjak-primary"
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
    </div>
  )
}

