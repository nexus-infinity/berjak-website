import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from './Header'
import Footer from './Footer'

export default function Layout({ children, title = 'Berjak & Partners' }) {
  const router = useRouter()
  const defaultDescription = 'Trading in Ferrous/Non Ferrous Metals & Minerals since 1954'
  
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{`${title} - ${defaultDescription}`}</title>
        <meta name="description" content={defaultDescription} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className="flex-grow bg-white">
        <div className="container mx-auto px-4">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  )
}

