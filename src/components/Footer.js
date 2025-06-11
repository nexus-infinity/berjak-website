import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <div className="relative w-28 h-16">
            <Image
              src="/images/logo02.gif"
              alt="Berjak & Partners"
              width={114}
              height={65}
              className="object-contain"
            />
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <div className="text-berjak-text font-medium space-y-2">
              <p>240 Bay Street, Brighton Australia 3186</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                <p>
                  Phone:{' '}
                  <a 
                    href="tel:+61395966999" 
                    className="hover:text-berjak-primary transition-colors"
                  >
                    61-3-9596 6999
                  </a>
                </p>
                <p>Fax: 61-3-9596 8024</p>
              </div>
              <p>
                Email:{' '}
                <a 
                  href="mailto:trading@berjak.com.au"
                  className="hover:text-berjak-primary transition-colors"
                >
                  trading@berjak.com.au
                </a>
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full max-w-2xl border-t border-gray-200"></div>

          {/* Copyright */}
          <div className="text-center text-sm text-berjak-text">
            <p>
              © {new Date().getFullYear()} Berjak & Partners
            </p>
            <p className="mt-1 text-gray-500">
              Trading in Ferrous/Non Ferrous Metals & Minerals since 1954
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

