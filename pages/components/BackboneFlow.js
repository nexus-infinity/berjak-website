import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'

// Your father's 2007 Strategic Backbone Process
const backboneSteps = [
  {
    id: '1.0',
    title: 'Add & Verify Customer',
    description: 'Check customer details, register new customers, provide trading terms',
    status: 'completed',
    callFileItems: ['Customer Profile', 'Trading Terms', 'Credit Limits', 'Contact Details'],
    documents: ['Customer Database Entry', 'Trading Agreement', 'Credit Application'],
    nextSteps: ['2.0']
  },
  {
    id: '2.0', 
    title: 'Process Trade Lead',
    description: 'Receive specifications, source commodity, match buyers/sellers',
    status: 'active',
    callFileItems: ['Market Prices (LME)', 'Commodity Specs', 'Bid/Offer Book', 'Trade Lead Form'],
    documents: ['Trade Lead Register', 'Market Analysis', 'Supplier Database'],
    nextSteps: ['3.0']
  },
  {
    id: '3.0',
    title: "Determine Agent's Commission",
    description: 'Check trading history, calculate commission, confirm invoicing method',
    status: 'pending',
    callFileItems: ['Trading History', 'Commission Matrix', 'Invoice Settings'],
    documents: ['Commission Agreement', 'Historical Trade Records'],
    nextSteps: ['4.0']
  },
  {
    id: '4.0',
    title: 'Negotiate Bid/Offer Price',
    description: 'Check history, determine market price, make bid within authorized range',
    status: 'pending',
    callFileItems: ['LME Closing Prices', 'Customer Credit Limits', 'Authorization Matrix'],
    documents: ['Price Authorization', 'Market Data Feed', 'Credit Report'],
    nextSteps: ['5.0']
  },
  {
    id: '5.0',
    title: 'Finalise Contract',
    description: 'Issue contract number, confirm price, arrange deposits, issue contract notes',
    status: 'pending',
    callFileItems: ['Contract Number', 'Total Price', 'Deposit Terms', 'Contract Notes'],
    documents: ['Contract Document', 'Payment Schedule', 'Legal Terms'],
    nextSteps: ['6.0']
  },
  {
    id: '6.0',
    title: 'Manage Business Operations',
    description: 'Shipping logistics, credit insurance, invoicing, treasury management',
    status: 'pending',
    callFileItems: ['Movement Orders', 'Insurance Refs', 'Invoice Queue', 'Currency Positions'],
    documents: ['Shipping Manifest', 'Insurance Policy', 'Invoice Register', 'Treasury Report'],
    nextSteps: ['7.0']
  },
  {
    id: '7.0',
    title: 'Customer Claims',
    description: 'Handle claims, review documentation, determine liability, negotiate settlements',
    status: 'pending',
    callFileItems: ['Claims Register', 'Documentation Review', 'Liability Assessment'],
    documents: ['Claim Form', 'Evidence Package', 'Settlement Agreement'],
    nextSteps: []
  }
]

export default function BackboneFlow({ currentStep = '2.0', onStepClick }) {
  const [activeStep, setActiveStep] = useState(currentStep)
  const [glowIntensity, setGlowIntensity] = useState(0)

  // Pulsing glow animation for active elements
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity(prev => (prev + 0.1) % (Math.PI * 2))
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const getStepStatus = (step) => {
    if (step.id === activeStep) return 'active'
    if (step.status === 'completed') return 'completed'
    return 'pending'
  }

  const getGlowStyle = (stepId) => {
    if (stepId === activeStep) {
      const intensity = Math.sin(glowIntensity) * 0.5 + 0.5
      return {
        boxShadow: `0 0 ${20 + intensity * 30}px rgba(19, 156, 137, ${0.6 + intensity * 0.4})`,
        border: `2px solid rgba(19, 156, 137, ${0.8 + intensity * 0.2})`,
      }
    }
    return {}
  }

  const getConnectorStyle = (fromStep, toStep) => {
    if (fromStep === activeStep || toStep === activeStep) {
      const intensity = Math.sin(glowIntensity) * 0.5 + 0.5
      return {
        background: `linear-gradient(90deg, 
          rgba(19, 156, 137, ${0.3 + intensity * 0.7}), 
          rgba(19, 156, 137, ${0.1 + intensity * 0.3})
        )`,
        boxShadow: `0 0 ${10 + intensity * 15}px rgba(19, 156, 137, ${0.4 + intensity * 0.3})`,
      }
    }
    return { background: 'rgba(156, 163, 175, 0.3)' }
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      {/* Legacy Heritage Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-4 mb-6">
          <div className="w-2 h-16 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full"></div>
          <h1 className="text-4xl font-light text-gray-800">
            Strategic Backbone Process
          </h1>
          <div className="w-2 h-16 bg-gradient-to-b from-berjak-primary to-blue-600 rounded-full"></div>
        </div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
          <span className="text-amber-600 font-medium">Legacy (2007):</span> Your father's foundational process with MBA strategic analysis<br/>
          <span className="text-berjak-primary font-medium">Evolution (2025):</span> Modern glowing interface with interactive Call File system
        </p>
      </div>

      {/* The Glowing Flow Chart */}
      <div className="relative">
        {backboneSteps.map((step, index) => {
          const isLast = index === backboneSteps.length - 1
          const status = getStepStatus(step)
          
          return (
            <div key={step.id} className="relative mb-12">
              {/* Flow connector to next step */}
              {!isLast && (
                <div 
                  className="absolute left-1/2 -translate-x-1/2 w-1 h-12 -bottom-12 transition-all duration-500"
                  style={getConnectorStyle(step.id, backboneSteps[index + 1]?.id)}
                />
              )}
              
              <div className="flex items-center gap-8">
                {/* Step Number Circle (Glowing) */}
                <div 
                  className={`flex-shrink-0 w-20 h-20 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 ${
                    status === 'active' ? 'bg-berjak-primary text-white' :
                    status === 'completed' ? 'bg-green-500 text-white' :
                    'bg-gray-300 text-gray-600'
                  }`}
                  style={status === 'active' ? getGlowStyle(step.id) : {}}
                >
                  {step.id}
                </div>

                {/* Main Process Card */}
                <Card 
                  className={`flex-1 transition-all duration-500 cursor-pointer hover:scale-105 ${
                    status === 'active' ? 'bg-gradient-to-r from-berjak-lighter to-white' :
                    status === 'completed' ? 'bg-gradient-to-r from-green-50 to-white' :
                    'bg-white'
                  }`}
                  style={status === 'active' ? getGlowStyle(step.id) : {}}
                  onClick={() => {
                    setActiveStep(step.id)
                    onStepClick?.(step.id)
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-light text-gray-800 mb-2">
                          {step.title}
                        </CardTitle>
                        <p className="text-gray-600 text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                        status === 'active' ? 'bg-berjak-primary text-white animate-pulse' :
                        status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {status === 'active' ? 'ACTIVE' :
                         status === 'completed' ? 'COMPLETED' : 'PENDING'}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {/* Call File Section - Your father's key concept */}
                  {status === 'active' && (
                    <CardContent className="pt-0">
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Active Call File Items */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                          <h4 className="text-lg font-medium text-amber-800 mb-4 flex items-center gap-2">
                            📋 Active Call File
                          </h4>
                          <div className="space-y-2">
                            {step.callFileItems.map((item, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-100">
                                <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                                <span className="text-amber-800">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Supporting Documents */}
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                          <h4 className="text-lg font-medium text-blue-800 mb-4 flex items-center gap-2">
                            📄 Referenced Documents
                          </h4>
                          <div className="space-y-2">
                            {step.documents.map((doc, i) => (
                              <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-100">
                                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                <span className="text-blue-800">{doc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Digital Agent Assignment */}
                      <div className="mt-6 p-6 bg-purple-50 border border-purple-200 rounded-2xl">
                        <h4 className="text-lg font-medium text-purple-800 mb-3 flex items-center gap-2">
                          🤖 Digital Agent Assignment
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                            {step.id.split('.')[0]}
                          </div>
                          <div>
                            <div className="font-medium text-purple-800">
                              {step.id === '2.0' ? 'Digital Mario - Trading Manager' :
                               step.id === '6.0' ? 'Digital Robert - Shipping Manager' :
                               step.id === '3.0' ? 'Digital Siew - Market Analyst' :
                               'Automated Process Handler'}
                            </div>
                            <div className="text-purple-600 text-sm">Processing with 100% accuracy</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Legacy Timeline Footer */}
      <div className="mt-16 text-center p-8 bg-gradient-to-r from-amber-50 via-white to-berjak-lighter/50 rounded-3xl border">
        <div className="flex justify-center items-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
            <span className="text-amber-700 font-medium">2007: MBA Strategic Foundation</span>
          </div>
          <div className="w-16 h-0.5 bg-gradient-to-r from-amber-400 to-berjak-primary"></div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-berjak-primary rounded-full animate-pulse"></div>
            <span className="text-berjak-primary font-medium">2025: Living Digital Evolution</span>
          </div>
        </div>
      </div>
    </div>
  )
}