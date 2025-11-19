import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

/**
 * Project X - Historical Reconstruction Interface
 *
 * Purpose: Build evidence matrix from family company books to prove corruption
 * Goal: GET MY FARM BACK through legal justice
 *
 * Geometric Node: ▼TATA (285 Hz - Validation/Law/Justice)
 */
export default function ProjectX() {
  const [activeTab, setActiveTab] = useState('import')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [status, setStatus] = useState(null)

  // Form states for NLIS import
  const [nlisForm, setNlisForm] = useState({
    nlis_id: '',
    transaction_date: '',
    livestock_type: 'cattle',
    movement_type: 'sale',
    from_pic: '',
    to_pic: '',
    quantity: 1,
    metadata: {}
  })

  // Form states for financial import
  const [financialForm, setFinancialForm] = useState({
    transaction_date: '',
    account: '',
    description: '',
    debit: 0,
    credit: 0,
    reference: '',
    metadata: {}
  })

  // Load status on mount
  useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    try {
      const res = await fetch('/api/sovereignty/project-x')
      const data = await res.json()
      setStatus(data.reconstruction_status)
    } catch (err) {
      console.error('Failed to load Project X status:', err)
    }
  }

  const importNLIS = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/sovereignty/project-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import_nlis',
          data: nlisForm
        })
      })

      const data = await res.json()
      setResult(data)

      // Reset form on success
      if (data.status === 'success') {
        setNlisForm({
          nlis_id: '',
          transaction_date: '',
          livestock_type: 'cattle',
          movement_type: 'sale',
          from_pic: '',
          to_pic: '',
          quantity: 1,
          metadata: {}
        })
      }
    } catch (err) {
      setResult({ status: 'error', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const importFinancial = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/sovereignty/project-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'import_financial',
          data: financialForm
        })
      })

      const data = await res.json()
      setResult(data)

      // Reset form on success
      if (data.status === 'success') {
        setFinancialForm({
          transaction_date: '',
          account: '',
          description: '',
          debit: 0,
          credit: 0,
          reference: '',
          metadata: {}
        })
      }
    } catch (err) {
      setResult({ status: 'error', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  const runAnalysis = async (action) => {
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/sovereignty/project-x', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      const data = await res.json()
      setResult(data)
    } catch (err) {
      setResult({ status: 'error', error: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">

            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl">🔴</span>
                    <div>
                      <h1 className="text-5xl font-light text-gray-900">
                        Project X: Historical Reconstruction
                      </h1>
                      <p className="text-lg text-red-600 font-medium mt-2">
                        ▼TATA • 285 Hz • Validation/Law/Justice
                      </p>
                    </div>
                  </div>
                  <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
                    Build comprehensive evidence matrix from family company books to prove corruption and pursue justice.
                  </p>
                  <p className="text-2xl font-bold text-red-700 mt-4">
                    Goal: GET MY FARM BACK
                  </p>
                </div>

                <Link href="/sovereignty">
                  <Button
                    size="lg"
                    variant="outline"
                    className="px-10 py-6 text-lg border-2 border-red-600 text-red-600 rounded-2xl"
                  >
                    ← Back to Sovereignty
                  </Button>
                </Link>
              </div>
            </div>

            {/* Status Cards */}
            {status && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <Card className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-2">NLIS Records</div>
                    <div className="text-3xl font-light text-gray-900">{status.nlis_records || 0}</div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-2">Financial Transactions</div>
                    <div className="text-3xl font-light text-gray-900">{status.financial_records || 0}</div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-2">Corruption Score</div>
                    <div className="text-3xl font-light text-red-600">{status.corruption_score || 0}%</div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-white border-2 border-gray-200 rounded-2xl">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-2">Evidence Strength</div>
                    <div className="text-3xl font-light text-green-600">{status.evidence_strength || 'N/A'}</div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Tabs */}
            <div className="mb-8">
              <div className="flex gap-4 border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveTab('import')}
                  className={`px-6 py-3 text-lg font-medium ${
                    activeTab === 'import'
                      ? 'border-b-4 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Import Data
                </button>
                <button
                  onClick={() => setActiveTab('analyze')}
                  className={`px-6 py-3 text-lg font-medium ${
                    activeTab === 'analyze'
                      ? 'border-b-4 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Analysis
                </button>
                <button
                  onClick={() => setActiveTab('evidence')}
                  className={`px-6 py-3 text-lg font-medium ${
                    activeTab === 'evidence'
                      ? 'border-b-4 border-red-600 text-red-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Evidence Package
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="grid md:grid-cols-2 gap-8">

              {/* Import Tab */}
              {activeTab === 'import' && (
                <>
                  {/* NLIS Import */}
                  <Card className="p-8 bg-white rounded-2xl border-2 border-gray-200">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-light">Import NLIS Record</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">From family company books - livestock movement data</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <form onSubmit={importNLIS} className="space-y-4">
                        <div>
                          <Label>NLIS ID</Label>
                          <Input
                            value={nlisForm.nlis_id}
                            onChange={(e) => setNlisForm({...nlisForm, nlis_id: e.target.value})}
                            placeholder="AU123456789"
                            required
                          />
                        </div>

                        <div>
                          <Label>Transaction Date</Label>
                          <Input
                            type="date"
                            value={nlisForm.transaction_date}
                            onChange={(e) => setNlisForm({...nlisForm, transaction_date: e.target.value})}
                            required
                          />
                        </div>

                        <div>
                          <Label>Livestock Type</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={nlisForm.livestock_type}
                            onChange={(e) => setNlisForm({...nlisForm, livestock_type: e.target.value})}
                          >
                            <option value="cattle">Cattle</option>
                            <option value="sheep">Sheep</option>
                            <option value="goat">Goat</option>
                          </select>
                        </div>

                        <div>
                          <Label>Movement Type</Label>
                          <select
                            className="w-full p-2 border rounded"
                            value={nlisForm.movement_type}
                            onChange={(e) => setNlisForm({...nlisForm, movement_type: e.target.value})}
                          >
                            <option value="purchase">Purchase</option>
                            <option value="sale">Sale</option>
                            <option value="transfer">Transfer</option>
                            <option value="death">Death/Loss</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>From PIC</Label>
                            <Input
                              value={nlisForm.from_pic}
                              onChange={(e) => setNlisForm({...nlisForm, from_pic: e.target.value})}
                              placeholder="PIC123"
                            />
                          </div>
                          <div>
                            <Label>To PIC</Label>
                            <Input
                              value={nlisForm.to_pic}
                              onChange={(e) => setNlisForm({...nlisForm, to_pic: e.target.value})}
                              placeholder="PIC456"
                            />
                          </div>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white">
                          {loading ? 'Importing...' : 'Import NLIS Record'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Financial Import */}
                  <Card className="p-8 bg-white rounded-2xl border-2 border-gray-200">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-light">Import Financial Transaction</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">From management accounts - financial records</p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <form onSubmit={importFinancial} className="space-y-4">
                        <div>
                          <Label>Transaction Date</Label>
                          <Input
                            type="date"
                            value={financialForm.transaction_date}
                            onChange={(e) => setFinancialForm({...financialForm, transaction_date: e.target.value})}
                            required
                          />
                        </div>

                        <div>
                          <Label>Account</Label>
                          <Input
                            value={financialForm.account}
                            onChange={(e) => setFinancialForm({...financialForm, account: e.target.value})}
                            placeholder="Livestock Sales"
                            required
                          />
                        </div>

                        <div>
                          <Label>Description</Label>
                          <Input
                            value={financialForm.description}
                            onChange={(e) => setFinancialForm({...financialForm, description: e.target.value})}
                            placeholder="Sale of 1x Angus - NLIS AU123456789"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Debit ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={financialForm.debit}
                              onChange={(e) => setFinancialForm({...financialForm, debit: parseFloat(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label>Credit ($)</Label>
                            <Input
                              type="number"
                              step="0.01"
                              value={financialForm.credit}
                              onChange={(e) => setFinancialForm({...financialForm, credit: parseFloat(e.target.value)})}
                            />
                          </div>
                        </div>

                        <div>
                          <Label>Reference/Invoice</Label>
                          <Input
                            value={financialForm.reference}
                            onChange={(e) => setFinancialForm({...financialForm, reference: e.target.value})}
                            placeholder="INV-2020-045"
                          />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full bg-red-600 text-white">
                          {loading ? 'Importing...' : 'Import Financial Transaction'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Analysis Tab */}
              {activeTab === 'analyze' && (
                <>
                  <Card className="p-8 bg-white rounded-2xl border-2 border-gray-200">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-light">Cross-Reference Analysis</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">Find discrepancies between livestock and financial records</p>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <Button
                        onClick={() => runAnalysis('analyze_discrepancies')}
                        disabled={loading}
                        className="w-full bg-blue-600 text-white"
                      >
                        {loading ? 'Analyzing...' : 'Run Discrepancy Analysis'}
                      </Button>
                      <p className="text-sm text-gray-600">
                        Identifies unmatched records, value discrepancies, and calculates corruption score
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-white rounded-2xl border-2 border-gray-200">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-light">Corruption Pattern Detection</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">Detect systematic fraud patterns across timeline</p>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <Button
                        onClick={() => runAnalysis('detect_patterns')}
                        disabled={loading}
                        className="w-full bg-purple-600 text-white"
                      >
                        {loading ? 'Detecting...' : 'Detect Corruption Patterns'}
                      </Button>
                      <p className="text-sm text-gray-600">
                        Finds missing financial records, location mismatches, rapid turnover, suspicious activity
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="p-8 bg-white rounded-2xl border-2 border-gray-200 md:col-span-2">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="text-2xl font-light">Timeline Reconstruction</CardTitle>
                      <p className="text-sm text-gray-500 mt-2">Build complete chronological picture of events</p>
                    </CardHeader>
                    <CardContent className="p-0 space-y-4">
                      <Button
                        onClick={() => runAnalysis('reconstruct_timeline')}
                        disabled={loading}
                        className="w-full bg-green-600 text-white"
                      >
                        {loading ? 'Reconstructing...' : 'Reconstruct Complete Timeline'}
                      </Button>
                      <p className="text-sm text-gray-600">
                        Creates comprehensive timeline with all events, critical periods, and evidence strength ratings
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Evidence Package Tab */}
              {activeTab === 'evidence' && (
                <Card className="p-8 bg-white rounded-2xl border-2 border-red-300 md:col-span-2">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-3xl font-light text-red-700">Generate Legal Evidence Package</CardTitle>
                    <p className="text-lg text-gray-600 mt-2">
                      Prepare comprehensive evidence for legal action and justice pursuit
                    </p>
                  </CardHeader>
                  <CardContent className="p-0 space-y-6">
                    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                      <h3 className="text-xl font-medium text-red-900 mb-4">Evidence Package Includes:</h3>
                      <ul className="space-y-2 text-gray-700">
                        <li>✓ Comprehensive timeline with all events</li>
                        <li>✓ Discrepancy report (unmatched records, irregularities)</li>
                        <li>✓ Corruption pattern analysis</li>
                        <li>✓ Blockchain verification (immutable proof)</li>
                        <li>✓ Visual timeline and charts</li>
                        <li>✓ Evidence strength calculation</li>
                      </ul>
                    </div>

                    <Button
                      onClick={() => runAnalysis('generate_evidence_package')}
                      disabled={loading}
                      className="w-full bg-red-700 text-white text-lg py-6"
                    >
                      {loading ? 'Generating Evidence Package...' : 'Generate Evidence Package for Legal Action'}
                    </Button>

                    <div className="text-center text-sm text-gray-500">
                      <p>Once generated, consult with legal counsel to pursue justice</p>
                      <p className="font-bold text-red-600 mt-2">Goal: GET MY FARM BACK</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Results Display */}
            {result && (
              <Card className={`mt-8 p-8 rounded-2xl border-2 ${
                result.status === 'success' ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'
              }`}>
                <CardHeader className="p-0 mb-4">
                  <CardTitle className="text-2xl">
                    {result.status === 'success' ? '✅ Success' : '❌ Error'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <pre className="bg-white p-4 rounded overflow-auto max-h-96 text-sm">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}
