import axios from 'axios'
import { API_URL } from '@/lib/constants'
import { toast } from 'sonner'

interface CreateJobData {
  job_title: string
  job_location: string
  job_type: string
  job_description: string
  job_requirements: string
  job_contact_email: string
}

export interface Job {
  id: number
  job_title: string
  job_description: string
  job_location: string
  job_type: string
  job_requirements: string
  job_contact_email: string
  created_at: string
  updated_at: string
}

export const getJobs = async () => {
  return axios
    .get(`${API_URL}/jobs`)
    .then((response) => {
      return response.data.items
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}

export const createJob = async (data: CreateJobData) => {
  return axios
    .post(`${API_URL}/jobs`, data)
    .then((response) => {
      toast.success('Job Posted Successfully', {
        description: 'Your job has been posted and is now live.',
      })
      return response.data
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}

export const getJobDetails = async (jobId: string) => {
  return axios
    .get(`${API_URL}/jobs/${jobId}`)
    .then((response) => {
      return { status: response.status, data: response.data }
    })
    .catch((error) => {
      toast.error(error.response.data.message)
      return { status: error.response.status, data: null }
    })
}

export const deleteJob = async (jobId: string) => {
  return axios
    .post(`${API_URL}/jobs/${jobId}`)
    .then((response) => {
      toast.success('Job Deleted Successfully', {
        description: 'Your job has been deleted successfully.',
      })
      return response.data
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}
