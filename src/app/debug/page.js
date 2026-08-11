'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [apiData, setApiData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        const response = await fetch('/api/test-connection')
        const data = await response.json()
        setApiData(data)
      } catch (error) {
        setApiData({ error: error.message })
      } finally {
        setLoading(false)
      }
    }
    fetchDebugData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm font-mono">
            <div>Project ID: {process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'NOT SET'}</div>
            <div>Dataset: {process.env.NEXT_PUBLIC_SANITY_DATASET || 'NOT SET'}</div>
            <div>API Version: {process.env.NEXT_PUBLIC_SANITY_API_VERSION || 'NOT SET'}</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-4">API Test Results</h2>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <pre className="text-sm bg-gray-100 p-4 rounded overflow-x-auto">
              {JSON.stringify(apiData, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}