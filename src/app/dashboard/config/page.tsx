'use client'

import Link from 'next/link'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'

export default function Page() {
  const configs = [
    {
      id: 'department-category',
      title: 'Department Management',
      description: 'Add, edit, and delete departments.',
      href: '/dashboard/config/department',
    },
    {
      id: 'agent-category',
      title: 'Agent Management',
      description: 'Add, edit, and delete agents.',
      href: '/dashboard/config/agent',
    },
  ]

  return (
    <div className="container mx-auto py-10 space-y-8">
      <h1 className="text-3xl font-bold">Configuration</h1>
      <div className="grid gap-8">
        {configs.map((config) => (
          <Link href={config.href} key={config.id}>
            <Card className="transition-all duration-200 cursor-pointer hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>{config.title}</CardTitle>
                  <CardDescription>{config.description}</CardDescription>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
