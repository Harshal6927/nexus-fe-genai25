'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  Mail,
  User,
  FileText,
  Trash2,
  Phone,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getJobDetails, deleteJob, Job } from '@/utils/api-job'
import { getJobApplications, deleteJobApplication } from '@/utils/api-candidate'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useAppContext } from '@/components/app-context'
import { toast } from 'sonner'

interface CircularProgressProps {
  percentage: number
  size?: number
  strokeWidth?: number
}

interface Candidate {
  id: number
  candidate_name: string
  candidate_email: string
  candidate_phone: string
  candidate_current_yoe: number
  candidate_current_role: string
  candidate_resume: string
  applied_date: string
  data_processed: boolean
  progress: number
  summary: string | null
  avatar: string | null
  skills: string[]
}

function CircularProgress({
  percentage,
  size = 40,
  strokeWidth = 4,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#e2e8f0" // Light gray background
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="#10b981" // Green progress
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute text-xs font-medium">{percentage}%</div>
    </div>
  )
}

export default function JobDetailPage() {
  const [job, setJob] = useState<Job | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isDeletingApplication, setIsDeletingApplication] = useState<
    number | null
  >(null)
  const { setRefreshJobs, activeAgent, activeLLM } = useAppContext()
  const { push } = useRouter()
  const params = useParams()
  const jobId = params.jobId as string

  const fetchJobDetails = async () => {
    const jobDetails = await getJobDetails(jobId)

    if (jobDetails.status === 200) {
      setJob(jobDetails.data)
    } else {
      push('/dashboard/home')
    }
  }

  const fetchJobApplications = async () => {
    if (!activeAgent) {
      return
    }

    const jobApplications = await getJobApplications(
      jobId,
      activeAgent.id,
      activeLLM.name,
    )
    setCandidates(jobApplications)
  }

  useEffect(() => {
    const jobHelper = async () => {
      await fetchJobDetails()
      await fetchJobApplications()
    }
    jobHelper()
  }, [jobId, activeAgent, activeLLM])

  const handleDeleteJob = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteJob(jobId)
      if (response === 200) {
        setRefreshJobs(true)
        push('/dashboard/home')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteApplication = async (applicationId: number) => {
    setIsDeletingApplication(applicationId)
    try {
      await deleteJobApplication(applicationId)
      await fetchJobApplications()
    } finally {
      setIsDeletingApplication(null)
    }
  }

  return (
    <div className="flex flex-col w-full items-center">
      <main className="flex-1 container py-10 px-4 md:px-6 w-full">
        <div className="space-y-10 w-full">
          {/* Job Details Section */}
          <div className="rounded-xl border shadow-sm overflow-hidden w-full">
            {!job ? (
              <div className="p-6 md:p-8 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground">
                    Loading job details...
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8 space-y-6 w-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{job.job_type}</Badge>
                      <Badge variant="secondary">ID: {job.id}</Badge>
                    </div>
                    <h1 className="text-3xl font-bold">{job.job_title}</h1>
                    <p className="text-lg text-muted-foreground">
                      Contact: {job.job_contact_email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1 h-4 w-4" />
                      Posted {new Date(job.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className="hover:cursor-pointer"
                        onClick={() => push(`/dashboard/apply/${job.id}`)}
                      >
                        Apply Now
                      </Badge>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Badge
                            variant="destructive"
                            className="hover:cursor-pointer"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete Job
                          </Badge>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the job posting and remove all
                              related data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="hover:cursor-pointer">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDeleteJob}
                              className="hover:cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              disabled={isDeleting}
                            >
                              {isDeleting ? 'Deleting...' : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>

                <div className="flex items-center text-muted-foreground">
                  <MapPin className="mr-1 h-5 w-5" />
                  {job.job_location}
                </div>

                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger
                      value="description"
                      className="hover:cursor-pointer"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="requirements"
                      className="hover:cursor-pointer"
                    >
                      Requirements
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="pt-4 space-y-4">
                    <p className="text-muted-foreground">
                      {job.job_description}
                    </p>
                  </TabsContent>
                  <TabsContent value="requirements" className="pt-4 space-y-4">
                    <p className="text-muted-foreground">
                      {job.job_requirements}
                    </p>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          {/* Candidates Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold">
                Candidates ({candidates.length})
              </h2>
            </div>

            {candidates.length === 0 ? (
              <div className="text-center border rounded-lg">
                <p className="text-muted-foreground p-8">
                  No applications have been submitted for this job yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {candidates.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12 border">
                            {candidate.avatar ? (
                              <AvatarImage
                                src={candidate.avatar}
                                alt={candidate.candidate_name}
                              />
                            ) : (
                              <AvatarFallback>
                                <User className="h-6 w-6" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">
                              {candidate.candidate_name}
                            </CardTitle>
                            <CardDescription>
                              {candidate.candidate_current_role}
                            </CardDescription>
                          </div>
                        </div>
                        <CircularProgress percentage={candidate.progress} />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2 space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center text-muted-foreground">
                          <Briefcase className="mr-1 h-4 w-4" />
                          {candidate.candidate_current_yoe} years exp
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="mr-1 h-4 w-4" />
                          {new Date(
                            candidate.applied_date,
                          ).toLocaleDateString()}
                        </div>
                        <div
                          className="flex items-center text-muted-foreground hover:cursor-pointer hover:underline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              candidate.candidate_email,
                            )
                            toast('Email copied to clipboard')
                          }}
                        >
                          <Mail className="mr-1 h-4 w-4" />
                          {candidate.candidate_email}
                        </div>
                        <div
                          className="flex items-center text-muted-foreground hover:cursor-pointer hover:underline"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              candidate.candidate_phone,
                            )
                            toast('Phone number copied to clipboard')
                          }}
                        >
                          <Phone className="mr-1 h-4 w-4" />
                          {candidate.candidate_phone}
                        </div>
                      </div>

                      {candidate.skills && candidate.skills.length > 0 ? (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {candidate.skills
                              .slice(0, 4)
                              .map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {candidate.skills.length > 4 && (
                              <Badge variant="outline" className="text-xs">
                                +{candidate.skills.length - 4} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {candidate.summary && (
                        <div className="space-y-1">
                          <h4 className="text-sm font-medium">Summary</h4>
                          <p className="text-sm text-muted-foreground">
                            {candidate.summary}
                          </p>
                        </div>
                      )}

                      {!candidate.data_processed && (
                        <div className="mt-2">
                          <Badge
                            variant="outline"
                            className="bg-amber-100 text-amber-800 border-amber-200"
                          >
                            Processing Application...
                          </Badge>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() =>
                            // window.open(candidate.candidate_resume, '_blank')
                            console.log('Viewing candidate details...')
                          }
                          disabled={!candidate.candidate_resume}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Resume
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 border-red-200 hover:bg-red-50 hover:text-red-600 hover:cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1 text-red-500" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove application?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently remove{' '}
                                {candidate.candidate_name}&apos;s application
                                from this job. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteApplication(candidate.id)
                                }
                                className="hover:cursor-pointer bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={
                                  isDeletingApplication === candidate.id
                                }
                              >
                                {isDeletingApplication === candidate.id
                                  ? 'Removing...'
                                  : 'Remove'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
