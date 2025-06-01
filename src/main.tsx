import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'regenerator-runtime/runtime'
import App from './App.tsx'
import './index.css'

const FloorPlan = lazy(() => import('@/components/FloorPlans'))
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div>need UUID</div>} />
          <Route path="/:uuid" element={<App />} />
          <Route path="/floorplan/:id" element={
              <Suspense fallback={<div>Loading...</div>}>
                <FloorPlan />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
)
