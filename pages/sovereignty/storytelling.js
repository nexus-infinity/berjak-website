import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

export default function StorytellingEngine() {
  const [narratives, setNarratives] = useState([])
  const [selectedNarrative, setSelectedNarrative] = useState(null)
  const [content, setContent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchNarratives()
  }, [])

  const fetchNarratives = () => {
    setLoading(true)
    fetch('/api/sovereignty/narratives')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setNarratives(data.narratives)
        } else {
          setError(data.error || 'Failed to load narratives')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load narratives:', err)
        setError(err.message)
        setLoading(false)
      })
  }

  const loadNarrative = (filename) => {
    fetch(`/api/sovereignty/narratives?file=${encodeURIComponent(filename)}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setSelectedNarrative(filename)
          setContent(data.content)
        } else {
          setError(data.error || 'Failed to load narrative content')
        }
      })
      .catch(err => {
        console.error('Failed to load narrative:', err)
        setError(err.message)
      })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-berjak-lighter via-white to-berjak-lighter/50">
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <h1 className="text-5xl font-light text-berjak-text mb-4">
                    📖 Storytelling Engine
                  </h1>
                  <p className="text-xl text-gray-600">
                    Narrative Generation • Timeline Analysis • 432 Hz Frequency
                  </p>
                </div>
                
                <Link href="/sovereignty">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-10 py-6 text-lg border-2 border-berjak-primary text-berjak-primary rounded-2xl"
                  >
                    ← Back to Sovereignty
                  </Button>
                </Link>
              </div>
            </div>

            {loading && (
              <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl text-center">
                <div className="text-2xl text-gray-600">Loading narratives...</div>
              </Card>
            )}

            {error && (
              <Card className="p-12 bg-red-50 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                <div className="text-xl text-red-600">❌ {error}</div>
              </Card>
            )}

            {!loading && !error && (
              <div className="grid md:grid-cols-3 gap-8">
                {/* Narrative List */}
                <div className="md:col-span-1">
                  <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-100">
                      <CardTitle className="text-2xl font-light text-berjak-text">
                        Generated Narratives ({narratives.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="max-h-[600px] overflow-y-auto">
                        {narratives.map((narrative, index) => (
                          <button
                            key={index}
                            onClick={() => loadNarrative(narrative.filename)}
                            className={`w-full p-6 text-left border-b border-gray-100 hover:bg-berjak-lighter/20 transition-colors ${
                              selectedNarrative === narrative.filename ? 'bg-berjak-lighter/30' : ''
                            }`}
                          >
                            <div className="font-medium text-berjak-text mb-2 truncate">
                              {narrative.filename}
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatFileSize(narrative.size)} • {formatDate(narrative.modified)}
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Narrative Content */}
                <div className="md:col-span-2">
                  {content ? (
                    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
                      <CardHeader className="p-8 border-b border-gray-100">
                        <CardTitle className="text-2xl font-light text-berjak-text">
                          {selectedNarrative}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="prose prose-lg max-w-none">
                          <pre className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed">
                            {content}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="p-12 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl text-center">
                      <div className="text-6xl mb-6">📖</div>
                      <div className="text-2xl text-gray-600">
                        Select a narrative to view its content
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}
