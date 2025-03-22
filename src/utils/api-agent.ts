import axios from 'axios'
import { API_URL } from '@/lib/constants'
import { toast } from 'sonner'

interface CreateAgentData {
  agent_name: string
  agent_instructions: string | null
}

export const getAgents = async () => {
  return axios
    .get(`${API_URL}/agents`)
    .then((response) => {
      return response.data.items
    })
    .catch((error) => {
      toast.error(error.response.data.message)
      return []
    })
}

export const createAgent = async (data: CreateAgentData) => {
  return axios
    .post(`${API_URL}/agents`, data)
    .then((response) => {
      toast.success('Agent created successfully')
      return response.data
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}

export const updateAgent = async (data: CreateAgentData, agentId: string) => {
  return axios
    .put(`${API_URL}/agents/${agentId}`, data)
    .then((response) => {
      toast.success('Agent updated successfully')
      return response.data
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}

export const deleteAgent = async (agentId: string) => {
  return axios
    .delete(`${API_URL}/agents/${agentId}`)
    .then((response) => {
      toast.success('Agent deleted successfully')
      return response.data
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}
