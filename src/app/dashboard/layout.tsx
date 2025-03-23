'use client'

import { ReactNode, useEffect } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppProvider } from '@/components/app-context'
import { useAuth } from '@/components/auth-context'
import { redirect } from 'next/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth()

  useEffect(() => {
    setTimeout(() => {
      if (!user) {
        redirect('/login')
      }
    }, 500)
  }, [user])

  return (
    <AppProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
              <div className="w-full h-full flex justify-center">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AppProvider>
  )
}
