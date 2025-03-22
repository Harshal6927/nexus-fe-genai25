'use client'

import { ChevronRight, FilePlus2, type LucideIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { useRouter } from 'next/navigation'
import { useAppContext } from '@/components/app-context'

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
  }[]
}) {
  const { push } = useRouter()

  const { jobs: subMenuItems } = useAppContext()

  return (
    <SidebarGroup className="p-0 px-2">
      <SidebarGroupLabel>
        <div className="flex w-full justify-between items-center">
          <div className="hover:cursor-default">Platform</div>
          <div
            className="hover:cursor-pointer hover:bg-accent hover:text-accent-foreground p-1 rounded-md"
            onClick={() => push('/dashboard/home')}
          >
            Home
          </div>
        </div>
      </SidebarGroupLabel>
      <div className="flex justify-center w-full mb-1">
        <div className="border w-[94%]" />
      </div>
      <SidebarMenu>
        <SidebarMenuItem className="hover:bg-accent hover:text-accent-foreground rounded-md">
          <SidebarMenuButton
            onClick={() => push('/dashboard/add-job')}
            className="hover:cursor-pointer"
          >
            <FilePlus2 />
            <span>Add job</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  tooltip={item.title}
                  className="hover:cursor-pointer"
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {subMenuItems.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.id}>
                      <SidebarMenuSubButton
                        asChild
                        onClick={() => push(`/dashboard/home/${subItem.id}`)}
                        className={'hover:cursor-pointer'}
                      >
                        <span>{subItem.job_title}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
