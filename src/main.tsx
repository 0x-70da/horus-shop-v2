import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { queryClient } from '@/lib/query-client'
import { router } from './router'
import { Toaster} from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position='top-center'/>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
