'use client'

import { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppProvider } from '@/components/app-context'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <SidebarProvider>
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <AppSidebar className="border-r border-border" />
          <SidebarInset>
            <div className="flex h-full flex-1 flex-col">
              <div className="flex-1 overflow-auto p-4">
                <main className="min-h-[calc(100vh-2rem)] rounded-xl bg-muted/50">
                  <div className="w-full h-full flex justify-center">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </AppProvider>
  )
}