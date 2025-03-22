'use client'

import { ChevronRight, Cpu } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Label } from '@/components/ui/label'
import { useAppContext } from '@/components/app-context'

export function LLMSwitcher() {
  const { isMobile } = useSidebar()

  const { LLMS, activeLLM, setActiveLLM } = useAppContext()

  const handleLLMUpdate = (llmName: string) => {
    const selectedLLM = LLMS.find((m) => m.name === llmName)
    if (selectedLLM) {
      setActiveLLM(selectedLLM)
    }
  }

  return (
    <SidebarMenu className="px-2 pt-2">
      <Label className="text-xs text-muted-foreground ml-2">LLM</Label>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="sm"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                {activeLLM ? (
                  <span className="truncate font-semibold h-5">
                    {activeLLM.displayName}
                  </span>
                ) : (
                  <span className="truncate font-semibold">Select Model</span>
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
              Switch LLM Model
            </DropdownMenuLabel>

            {LLMS.map((model) => (
              <DropdownMenuItem
                key={model.name}
                onClick={() => handleLLMUpdate(model.name)}
                className="gap-2 p-2 cursor-pointer"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  <Cpu className="size-4 shrink-0" />
                </div>
                <div className="flex flex-col">
                  {model.name === activeLLM?.name ? (
                    <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-400 text-transparent bg-clip-text animate-gradient font-semibold">
                      {model.displayName}
                    </span>
                  ) : (
                    <span>{model.displayName}</span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {model.provider}
                  </span>
                </div>
                {model.isLatest && (
                  <span className="ml-auto text-xs px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
                    Latest
                  </span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
