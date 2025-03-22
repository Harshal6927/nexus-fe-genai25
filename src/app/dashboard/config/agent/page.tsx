'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Plus, Trash, Loader2, RefreshCcw } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { createAgent, updateAgent, deleteAgent } from '@/utils/api-agent'
import { useAppContext } from '@/components/app-context'

export default function Page() {
  const [selectedAgent, setSelectedAgent] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newAgentName, setNewAgentName] = useState('')
  const [editAgentName, setEditAgentName] = useState('')
  const [agentInstructions, setAgentInstructions] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingInstructions, setIsSavingInstructions] = useState(false)

  const { agents, setRefreshAgents } = useAppContext()

  const handleCreateAgent = async () => {
    if (!newAgentName.trim()) return

    setIsLoading(true)
    try {
      await createAgent({ agent_name: newAgentName, agent_instructions: null })
      setRefreshAgents(true)
      setNewAgentName('')
      setIsCreateDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateAgent = async () => {
    if (!editAgentName.trim() || !selectedAgent) return

    setIsLoading(true)
    try {
      await updateAgent(
        { agent_name: editAgentName, agent_instructions: agentInstructions },
        selectedAgent,
      )
      setRefreshAgents(true)
      setEditAgentName('')
      setIsEditDialogOpen(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAgent = async () => {
    if (!selectedAgent) return

    setIsLoading(true)
    try {
      await deleteAgent(selectedAgent)
      setRefreshAgents(true)
      setSelectedAgent('')
      setAgentInstructions('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveInstructions = async () => {
    if (!selectedAgent) return

    setIsSavingInstructions(true)
    try {
      const agentToUpdate = agents.find(
        (a) => a.id.toString() === selectedAgent,
      )
      if (agentToUpdate) {
        await updateAgent(
          {
            agent_name: agentToUpdate.agent_name,
            agent_instructions: agentInstructions,
          },
          selectedAgent,
        )
        setRefreshAgents(true)
      }
    } finally {
      setIsSavingInstructions(false)
    }
  }

  // Helper function to get the name of the selected agent
  const getSelectedAgentName = () => {
    const agent = agents.find((a) => a.id.toString() === selectedAgent)
    return agent ? agent.agent_name : ''
  }

  const handleAgentChange = (value: string) => {
    setSelectedAgent(value)
    const selectedAgent = agents.find((a) => a.id.toString() === value)
    if (selectedAgent) {
      setEditAgentName(selectedAgent.agent_name || '')
      setAgentInstructions(selectedAgent.agent_instructions || '')
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/dashboard/config">
        <Button variant="ghost" className="mb-4 hover:cursor-pointer">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Configuration
        </Button>
      </Link>
      <h2 className="text-2xl font-bold mb-6">Agent Management</h2>
      <div>
        <Card className="w-full max-w-3xl mx-auto p-4 mb-8">
          <div className="space-y-6 mx-auto w-full">
            <div className="space-y-2">
              <Label htmlFor="agent-select">Select Agent</Label>
              <Select value={selectedAgent} onValueChange={handleAgentChange}>
                <SelectTrigger id="agent-select" className="w-full">
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {agents.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id.toString()}>
                      {agent.agent_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-4">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    className="flex items-center gap-2 hover:cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Create Agent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Agent</DialogTitle>
                    <DialogDescription>
                      Add a new AI agent to your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="new-agent-name">Agent Name</Label>
                    <Input
                      id="new-agent-name"
                      value={newAgentName}
                      onChange={(e) => setNewAgentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isLoading}
                      className="hover:cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateAgent}
                      disabled={isLoading}
                      className="hover:cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Create
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={!selectedAgent || isLoading}
                    onClick={() => {
                      setEditAgentName(getSelectedAgentName())
                      setIsEditDialogOpen(true)
                    }}
                    className="hover:cursor-pointer"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    Update Agent
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Agent</DialogTitle>
                    <DialogDescription>
                      Edit the selected agent&apos;s name.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="edit-agent-name">Agent Name</Label>
                    <Input
                      id="edit-agent-name"
                      value={editAgentName}
                      onChange={(e) => setEditAgentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isLoading}
                      className="hover:cursor-pointer"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateAgent}
                      disabled={isLoading}
                      className="hover:cursor-pointer"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Update
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button
                variant="destructive"
                disabled={!selectedAgent || isLoading}
                onClick={handleDeleteAgent}
                className="flex items-center gap-2 hover:cursor-pointer"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                Delete Agent
              </Button>
            </div>

            {selectedAgent ? (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Agent Instructions </Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveInstructions}
                    disabled={isSavingInstructions}
                    className="hover:cursor-pointer"
                  >
                    {isSavingInstructions ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : null}
                    Save
                  </Button>
                </div>
                <Textarea
                  placeholder="Provide detailed instructions of the agent's role, responsibilities, and capabilities."
                  className="min-h-[150px]"
                  value={agentInstructions}
                  onChange={(e) => setAgentInstructions(e.target.value)}
                />
              </div>
            ) : null}
          </div>
        </Card>
      </div>
    </div>
  )
}
