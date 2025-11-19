import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { Button } from '../components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table'
import { Input } from '../components/ui/input'
import BackboneFlow from '../components/BackboneFlow'

// Mock data based on your 2008 CRM system
const mockTrades = [
  {
    id: 'BJ-2025-001',
    customer: 'Pacific Metals Ltd',
    product: 'Copper Scrap',
    quantity: '25.5 MT',
    price: 'AUD $8,450/MT',
    status: 'Active',
    agent: 'Digital Mario',
  },
  {
    id: 'BJ-2025-002', 
    customer: 'Atlas Resources',
    product: 'Aluminum Ingots',
    quantity: '50.0 MT',
    price: 'AUD $2,100/MT',
    status: 'Pending',
    agent: 'Digital Robert',
  },
  {
    id: 'BJ-2025-003',
    customer: 'Southern Trading Co',
    product: 'Steel Wire',
    quantity: '15.2 MT', 
    price: 'AUD $1,850/MT',
    status: 'Shipped',
    agent: 'Digital Siew',
  },
]

const mockMetrics = [
  { title: 'Active Trades', value: '23', change: '+12%', trend: 'up' },
  { title: 'Monthly Revenue', value: 'AUD $2.4M', change: '+8.2%', trend: 'up' },
  { title: 'Digital Agents', value: '3/3', change: '100%', trend: 'stable' },
  { title: 'Avg. Response', value: '< 2min', change: '-45%', trend: 'up' },
]

export default function CRMDashboard() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Layout>
      {/* Spacious header with breathing room */}
      <div className="min-h-screen bg-gradient-to-br from-berjak-lighter via-white to-berjak-lighter/50">
        <div className="px-8 py-12">
          <div className="max-w-7xl mx-auto">
            
            {/* Modern hero section with generous spacing */}
            <div className="mb-16">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                <div>
                  <h1 className="text-5xl font-light text-berjak-text mb-4">
                    Trading Dashboard
                  </h1>
                  <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                    Modern metals trading powered by 70+ years of expertise 
                    and quantum-secured digital intelligence.
                  </p>
                </div>
                
                {/* Big, beautiful action buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    className="px-10 py-6 text-lg bg-berjak-primary hover:bg-berjak-primary/90 rounded-2xl shadow-lg"
                  >
                    📋 New Trade Contract
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-10 py-6 text-lg border-2 border-berjak-primary text-berjak-primary rounded-2xl"
                  >
                    📊 Generate Report
                  </Button>
                  <Link href="/sovereignty">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="px-10 py-6 text-lg border-2 border-purple-600 text-purple-600 rounded-2xl hover:bg-purple-600 hover:text-white"
                    >
                      ⚖️ Sovereignty Defense
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Metrics cards with generous spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-16">
              {mockMetrics.map((metric, index) => (
                <Card key={index} className="p-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="text-sm font-medium text-gray-500 mb-3">
                      {metric.title}
                    </div>
                    <div className="text-3xl font-light text-berjak-text mb-2">
                      {metric.value}
                    </div>
                    <div className={`text-sm font-medium ${
                      metric.trend === 'up' ? 'text-green-600' : 
                      metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {metric.change} from last month
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Trading table with spacious design */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
              <CardHeader className="p-10 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <CardTitle className="text-2xl font-light text-berjak-text">
                    Active Trading Contracts
                  </CardTitle>
                  
                  {/* Spacious search */}
                  <div className="w-full sm:w-80">
                    <Input 
                      placeholder="Search trades, customers, products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-berjak-primary"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-10 pt-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-200">
                        <TableHead className="py-6 text-base font-medium text-gray-700">Contract ID</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Customer</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Product</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Quantity</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Price</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Status</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Agent</TableHead>
                        <TableHead className="py-6 text-base font-medium text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTrades.map((trade) => (
                        <TableRow key={trade.id} className="border-gray-100 hover:bg-berjak-lighter/30 transition-colors">
                          <TableCell className="py-8 font-mono text-berjak-primary font-medium">{trade.id}</TableCell>
                          <TableCell className="py-8 text-base">{trade.customer}</TableCell>
                          <TableCell className="py-8 text-base">{trade.product}</TableCell>
                          <TableCell className="py-8 text-base font-medium">{trade.quantity}</TableCell>
                          <TableCell className="py-8 text-base font-medium text-green-600">{trade.price}</TableCell>
                          <TableCell className="py-8">
                            <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                              trade.status === 'Active' ? 'bg-green-100 text-green-700' :
                              trade.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {trade.status}
                            </span>
                          </TableCell>
                          <TableCell className="py-8 text-base text-purple-600">{trade.agent}</TableCell>
                          <TableCell className="py-8">
                            <div className="flex gap-3">
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="px-6 py-2 text-sm rounded-xl border-berjak-primary text-berjak-primary hover:bg-berjak-primary hover:text-white"
                              >
                                View
                              </Button>
                              <Button 
                                size="sm"
                                className="px-6 py-2 text-sm rounded-xl bg-berjak-primary hover:bg-berjak-primary/90"
                              >
                                Edit
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Strategic Backbone Process Flow - Your father's legacy */}
            <div className="mt-24">
              <BackboneFlow 
                currentStep="2.0"
                onStepClick={(stepId) => console.log('Clicked step:', stepId)}
              />
            </div>

            {/* Digital Agents Status - Your institutional intelligence */}
            <div className="mt-16">
              <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg rounded-3xl">
                <CardHeader className="p-10">
                  <CardTitle className="text-2xl font-light text-berjak-text mb-4">
                    🤖 Digital Employee Status
                  </CardTitle>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Your institutional intelligence agents - all the expertise, none of the complications.
                  </p>
                </CardHeader>
                <CardContent className="p-10 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center p-8 bg-white/60 rounded-2xl">
                      <div className="text-4xl mb-4">🚢</div>
                      <div className="text-xl font-medium text-berjak-text mb-2">Digital Robert</div>
                      <div className="text-gray-600 mb-4">Shipping Manager</div>
                      <div className="text-green-600 font-medium">✅ Active • 100% Reliable</div>
                    </div>
                    <div className="text-center p-8 bg-white/60 rounded-2xl">
                      <div className="text-4xl mb-4">📊</div>
                      <div className="text-xl font-medium text-berjak-text mb-2">Digital Mario</div>
                      <div className="text-gray-600 mb-4">Trading Manager</div>
                      <div className="text-green-600 font-medium">✅ Active • Perfect Execution</div>
                    </div>
                    <div className="text-center p-8 bg-white/60 rounded-2xl">
                      <div className="text-4xl mb-4">🔍</div>
                      <div className="text-xl font-medium text-berjak-text mb-2">Digital Siew</div>
                      <div className="text-gray-600 mb-4">Market Analyst</div>
                      <div className="text-green-600 font-medium">✅ Active • 24/7 Intelligence</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}