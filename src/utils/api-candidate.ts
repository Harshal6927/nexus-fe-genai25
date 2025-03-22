import axios from 'axios'
import { API_URL } from '@/lib/constants'
import { toast } from 'sonner'

export const getJobApplications = async (jobId: string) => {
  return axios
    .get(`${API_URL}/job-applications/${jobId}`)
    .then((response) => {
      return response.data.job_applications
    })
    .catch((error) => {
      toast.error(error.response.data.message)
      return []
    })
}

export const deleteJobApplication = async (applicationId: number) => {
  return axios
    .delete(`${API_URL}/job-applications/${applicationId}`)
    .then((response) => {
      toast.success('Job application deleted successfully')
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}

interface CreateJobApplicationData {
  candidate_name: string
  candidate_email: string
  candidate_phone: string
  candidate_current_role: string
  candidate_current_yoe: number
  candidate_resume_id: string
  candidate_linkedin: string
  candidate_github: string | undefined
  candidate_portfolio: string | undefined
}

export const applyJobApplication = async (
  jobId: string,
  data: CreateJobApplicationData,
) => {
  return axios
    .post(`${API_URL}/job-applications/apply/${jobId}`, data)
    .then((response) => {
      toast.success(response.data.message)
    })
    .catch((error) => {
      toast.error(error.response.data.message)
    })
}
