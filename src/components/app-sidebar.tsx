'use client'

import { ComponentProps } from 'react'
import { NotebookText, GalleryVerticalEnd } from 'lucide-react'
import { NavMain } from '@/components/nav-main'
import { NavUser } from '@/components/nav-user'
import { TeamSwitcher } from '@/components/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { AgentSwitcher } from '@/components/agent-switcher'
import { LLMSwitcher } from '@/components/llm-switcher'
import { cn } from '@/lib/utils'

const data = {
  user: {
    name: 'Harshal',
    email: 'harshal@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
  ],
  navMain: [
    {
      title: 'Job Board',
      url: '/dashboard/home',
      icon: NotebookText,
    },
  ],
}

export function AppSidebar({ className, ...props }: ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="icon" 
      className={cn("h-screen bg-background", className)} 
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <div className="border-t border-border" />
      <SidebarContent>
        <LLMSwitcher />
        <div className="flex justify-center w-full px-2">
          <div className="border-t border-border w-[94%]" />
        </div>
        <AgentSwitcher />
        <div className="flex justify-center w-full px-2">
          <div className="border-t border-border w-[94%]" />
        </div>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail className="border-r border-border" />
    </Sidebar>
  )
}