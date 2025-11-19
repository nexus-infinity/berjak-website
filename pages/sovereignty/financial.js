import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'

export default function FinancialInvestigation() {
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/notion/financial')
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          setRecords(data.records)
          setSummary(data.summary)
        } else {
          setError(data.message || 'Failed to load financial data')
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load financial data:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
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
                    💰 Financial Investigation Tracker
                  </h1>
                  <p className="text-xl text-gray-600">
                    MYOB Integration • Accounts Analysis • 432 Hz Frequency
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
                <div className="text-2xl text-gray-600">Loading financial data...</div>
              </Card>
            )}

            {error && (
              <Card className="p-12 bg-red-50 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                <div className="text-xl text-red-600">❌ {error}</div>
              </Card>
            )}

            {!loading && !error && summary && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                    <CardContent className="p-0">
                      <div className="text-sm font-medium text-gray-500 mb-3">Total Records</div>
                      <div className="text-4xl font-light text-berjak-text mb-2">{records.length}</div>
                      <div className="text-sm font-medium text-berjak-primary">Transactions</div>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                    <CardContent className="p-0">
                      <div className="text-sm font-medium text-gray-500 mb-3">Total Amount</div>
                      <div className="text-4xl font-light text-berjak-text mb-2">
                        {formatCurrency(summary.total_amount)}
                      </div>
                      <div className="text-sm font-medium text-green-600">Net Flow</div>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl">
                    <CardContent className="p-0">
                      <div className="text-sm font-medium text-gray-500 mb-3">Categories</div>
                      <div className="text-4xl font-light text-berjak-text mb-2">{summary.categories.length}</div>
                      <div className="text-sm font-medium text-berjak-primary">Active</div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-2xl font-light text-berjak-text">
                      Transaction Records
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-berjak-lighter/50">
                          <tr>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Date</th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Transaction ID</th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Category</th>
                            <th className="px-8 py-4 text-left text-sm font-medium text-gray-600">Account</th>
                            <th className="px-8 py-4 text-right text-sm font-medium text-gray-600">Amount</th>
                            <th className="px-8 py-4 text-center text-sm font-medium text-gray-600">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {records.map((record, index) => (
                            <tr key={index} className="hover:bg-berjak-lighter/20 transition-colors">
                              <td className="px-8 py-4 text-sm text-gray-600">
                                {formatDate(record.date)}
                              </td>
                              <td className="px-8 py-4 text-sm font-medium text-berjak-text">
                                {record.transaction_id}
                              </td>
                              <td className="px-8 py-4 text-sm">
                                <span className="px-3 py-1 bg-berjak-lighter rounded-full text-berjak-primary text-xs font-medium">
                                  {record.category}
                                </span>
                              </td>
                              <td className="px-8 py-4 text-sm text-gray-600">
                                {record.account}
                              </td>
                              <td className="px-8 py-4 text-sm font-medium text-right">
                                <span className={record.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                                  {formatCurrency(record.amount)}
                                </span>
                              </td>
                              <td className="px-8 py-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  record.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  record.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {record.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}
