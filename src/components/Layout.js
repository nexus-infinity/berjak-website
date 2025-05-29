import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Layout({ children, title = 'Berjak' }) {
  const router = useRouter()
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Berjak - Professional Services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-4 py-4">
          {/* Add navigation items here */}
        </nav>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} Berjak. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

