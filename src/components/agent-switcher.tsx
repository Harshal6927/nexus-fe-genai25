'use client'

import { useEffect } from 'react'
import { ChevronRight, Plus, UserRound } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/components/app-context'

export function AgentSwitcher() {
  const { isMobile } = useSidebar()
  const { push } = useRouter()

  const { agents, activeAgent, setActiveAgent } = useAppContext()

  useEffect(() => {
    if (agents.length > 0) {
      setActiveAgent(agents[0])
    }
  }, [agents])

  const handleAgentUpdate = (agentId: number) => {
    const selectedAgent = agents.find((a) => a.id === agentId)
    if (selectedAgent) {
      setActiveAgent(selectedAgent)
    }
  }

  return (
    <SidebarMenu className="px-2 pt-2">
      <Label className="text-xs text-muted-foreground ml-2">Agent</Label>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {activeAgent ? (
                  <span className="truncate font-semibold h-5">
                    {activeAgent.agent_name}
                  </span>
                ) : (
                  <span className="truncate font-semibold">Select Agent</span>
                )}
              </div>
              <ChevronRight className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Switch Agent
            </DropdownMenuLabel>

            {agents.map((data, index) => (
              <DropdownMenuItem
                key={index}
                onClick={() => handleAgentUpdate(data.id)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <UserRound className="size-4 shrink-0" />
                </div>
                {data.id === activeAgent?.id ? (
                  <span className="bg-gradient-to-r from-orange-700 via-blue-500 to-green-400 text-transparent bg-clip-text animate-gradient font-semibold">
                    {data.agent_name}
                  </span>
                ) : (
                  data.agent_name
                )}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 p-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
              onClick={() => push('/dashboard/config/agent')}
            >
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <div className="font-medium text-muted-foreground">Add Agent</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
