import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Profile', href: '/profile' },
  { name: 'Products', href: '/products' },
  { name: 'Contact', href: '/contact' },
  { name: 'Offers', href: '/offers' }
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <header className="relative">
      {/* Top bar with logo */}
      <div className="bg-berjak-primary">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="block w-fit">
            <Image
              src="/images/logo01.gif"
              alt="Berjak & Partners"
              width={180}
              height={98}
              priority
              className="h-16 w-auto"
            />
          </Link>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-berjak-secondary">
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            {navigation.map((item) => {
              const isActive = router.pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    px-6 py-4 text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-berjak-primary text-white' 
                      : 'text-gray-200 hover:bg-berjak-primary hover:text-white'
                    }
                  `}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="p-4 text-gray-200 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = router.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      block px-3 py-2 rounded-md text-base font-medium
                      ${isActive 
                        ? 'bg-berjak-primary text-white' 
                        : 'text-gray-200 hover:bg-berjak-primary hover:text-white'
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

