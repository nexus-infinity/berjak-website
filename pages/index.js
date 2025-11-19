import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from './components/Layout'
import { Button } from './components/ui/button'

export default function Home() {
  const router = useRouter()

  const goToCRM = () => {
    router.push('/crm/dashboard')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-berjak-lighter via-white to-berjak-lighter/50 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-8">
          <h1 className="text-6xl font-light text-berjak-text mb-8">
            Welcome to Berjak
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Modern metals trading powered by 70+ years of expertise
          </p>
          
          <div className="space-y-6">
            <Button 
              onClick={goToCRM}
              size="lg"
              className="px-12 py-6 text-xl bg-berjak-primary hover:bg-berjak-primary/90 rounded-2xl shadow-lg"
            >
              🚀 Enter CRM Trading Dashboard
            </Button>
            
            <div className="text-sm text-gray-500">
              <p>Or navigate directly to:</p>
              <code className="bg-gray-100 px-3 py-1 rounded text-berjak-primary">
                /crm/dashboard
              </code>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}