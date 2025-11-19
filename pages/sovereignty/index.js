import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

export default function SovereigntyDefense() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/sovereignty/redis')
      .then(res => res.json())
      .then(data => {
        setStatus(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load status:', err)
        setLoading(false)
      })
  }, [])

  const modules = [
    {
      title: 'Project X: Historical Reconstruction',
      icon: '🔴',
      description: 'Build evidence matrix from historical records to prove corruption. NLIS + financial cross-reference.',
      href: '/sovereignty/project-x',
      featured: true
    },
    {
      title: 'Evidence Management',
      icon: '📁',
      description: 'Surface and process legal evidence through the FRE field orchestra.',
      href: '/sovereignty/evidence'
    },
    {
      title: 'Financial Investigation',
      icon: '💰',
      description: 'Track and analyze financial transactions from MYOB and accounts data.',
      href: '/sovereignty/financial'
    },
    {
      title: 'Storytelling Engine',
      icon: '📖',
      description: 'Generate narrative analysis with timeline narratives and contradiction analysis.',
      href: '/sovereignty/storytelling'
    },
    {
      title: 'Matters Tracking',
      icon: '⚖️',
      description: 'Track legal matters with evidence compilation and court correspondence.',
      href: '/sovereignty/matters'
    }
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-berjak-lighter via-white to-berjak-lighter/50">
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-16">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <h1 className="text-5xl font-light text-berjak-text mb-4">
                    Walkerville Advocacy Platform
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    AI-Powered Legal Claims • Government Corruption • Duty of Care Breaches
                  </p>
                  <p className="text-lg text-red-600 font-medium mt-4">
                    ▼TATA • 285 Hz • Validation/Law/Justice
                  </p>
                </div>
                
                <Link href="/crm/dashboard">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-10 py-6 text-lg border-2 border-berjak-primary text-berjak-primary rounded-2xl"
                  >
                    ← Back to Dashboard
                  </Button>
                </Link>
              </div>
            </div>

            {!loading && status && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-3">Redis Database</div>
                    <div className="text-3xl font-light text-berjak-text mb-2">db/{status.database}</div>
                    <div className="text-sm font-medium text-berjak-primary">Free Field Active</div>
                  </CardContent>
                </Card>

                <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-3">Field Keys</div>
                    <div className="text-3xl font-light text-berjak-text mb-2">{status.key_count || 0}</div>
                    <div className="text-sm font-medium text-green-600">Synchronized</div>
                  </CardContent>
                </Card>

                <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-3">System Status</div>
                    <div className="text-3xl font-light text-berjak-text mb-2">✅ Active</div>
                    <div className="text-sm font-medium text-berjak-primary">432 Hz Aligned</div>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-8">
              {modules.map((module, index) => (
                <Link key={index} href={module.href}>
                  <Card className={`h-full bg-white/80 backdrop-blur-sm shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300 cursor-pointer ${
                    module.featured ? 'border-4 border-red-400 md:col-span-2' : 'border-0'
                  }`}>
                    <CardHeader className="p-10">
                      <div className="text-5xl mb-6">{module.icon}</div>
                      <CardTitle className={`text-2xl font-light mb-4 ${
                        module.featured ? 'text-red-700' : 'text-berjak-text'
                      }`}>
                        {module.title}
                        {module.featured && <span className="ml-4 text-sm bg-red-600 text-white px-3 py-1 rounded-full">NEW</span>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 pt-0">
                      <p className={`text-lg leading-relaxed ${
                        module.featured ? 'text-gray-700 font-medium' : 'text-gray-600'
                      }`}>
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

          </div>
        </div>
      </div>
    </Layout>
  )
}