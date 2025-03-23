'use client'

import React, { createContext, useState, ReactNode, useEffect } from 'react'
import { getAgents } from '@/utils/api-agent'
import { getJobs } from '@/utils/api-job'

export interface Agent {
  id: number
  agent_name: string
  agent_instructions: string | null
}

export interface LLM {
  name: string
  displayName: string
  provider: string
  isLatest?: boolean
}

export interface Job {
  id: number
  job_title: string
  job_location: string
  job_type: string
  job_description: string
  job_requirements: string
  job_contact_email: string
  created_at: string
  updated_at: string
}

const LLMS: LLM[] = [
  {
    name: 'gemini-2.0-flash-001',
    displayName: 'Gemini 2.0 Flash',
    provider: 'Google',
    isLatest: true,
  },
  {
    name: 'gemini-1.5-flash',
    displayName: 'Gemini 1.5 Flash',
    provider: 'Google',
  },
  {
    name: 'gemini-1.5-flash-8b',
    displayName: 'Gemini 1.5 Flash 8B',
    provider: 'Google',
  },
  {
    name: 'command-r-plus-08-2024',
    displayName: 'COMMAND R PLUS',
    provider: 'Cohere',
    isLatest: true,
  },
]

interface AppContextType {
  agents: Agent[]
  activeAgent: Agent | null
  LLMS: LLM[]
  activeLLM: LLM
  jobs: Job[]
  refreshJobs: boolean
  refreshAgents: boolean
  setAgents: React.Dispatch<React.SetStateAction<Agent[]>>
  setActiveAgent: React.Dispatch<React.SetStateAction<Agent | null>>
  setActiveLLM: React.Dispatch<React.SetStateAction<LLM>>
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>
  setRefreshJobs: React.Dispatch<React.SetStateAction<boolean>>
  setRefreshAgents: React.Dispatch<React.SetStateAction<boolean>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)
  const [activeLLM, setActiveLLM] = useState<LLM>(LLMS[0])
  const [jobs, setJobs] = useState<Job[]>([])
  const [refreshJobs, setRefreshJobs] = useState(true)
  const [refreshAgents, setRefreshAgents] = useState(true)

  const handleGetAgents = async () => {
    const response = await getAgents()
    setAgents(response)
    setRefreshAgents(false)
  }

  useEffect(() => {
    if (refreshAgents) {
      handleGetAgents()
    }
  }, [refreshAgents])

  const handleGetJobs = async () => {
    const response = await getJobs()
    setJobs(response)
    setRefreshJobs(false)
  }

  useEffect(() => {
    if (refreshJobs) {
      handleGetJobs()
    }
  }, [refreshJobs])

  const value = {
    agents,
    activeAgent,
    LLMS,
    activeLLM,
    jobs,
    refreshJobs,
    refreshAgents,
    setAgents,
    setActiveAgent,
    setActiveLLM,
    setJobs,
    setRefreshJobs,
    setRefreshAgents,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = React.useContext(AppContext)

  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}
