'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Upload, Linkedin, Github, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { getJobDetails, Job } from '@/utils/api-job'
import { applyJobApplication } from '@/utils/api-candidate'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]

const formSchema = z.object({
  fullName: z.string().min(2, {
    message: 'Full name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  phone: z.string().min(10, {
    message: 'Please enter a valid phone number.',
  }),
  currentRole: z.string().min(2, {
    message: 'Current role must be at least 2 characters.',
  }),
  yearsOfExperience: z.string().min(1, {
    message: 'Please enter your years of experience.',
  }),
  linkedinUrl: z.string().url({
    message: 'Please enter a valid LinkedIn URL.',
  }),
  githubUrl: z
    .string()
    .url({
      message: 'Please enter a valid GitHub URL.',
    })
    .optional()
    .or(z.literal('')),
  portfolioUrl: z
    .string()
    .url({
      message: 'Please enter a valid portfolio URL.',
    })
    .optional()
    .or(z.literal('')),
})

export default function JobApplicationPage() {
  const [job, setJob] = useState<Job | null>(null)
  const params = useParams()
  const jobId = params.jobId as string
  const { push } = useRouter()

  const fetchJobDetails = async () => {
    const jobDetails = await getJobDetails(jobId)

    if (jobDetails.status === 200) {
      setJob(jobDetails.data)
    } else {
      push('/dashboard/home')
    }
  }

  useEffect(() => {
    const jobHelper = async () => {
      await fetchJobDetails()
    }
    jobHelper()
  }, [])

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeError, setResumeError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      currentRole: '',
      yearsOfExperience: '',
      linkedinUrl: '',
      githubUrl: '',
      portfolioUrl: '',
    },
  })

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setResumeError(null)

    if (!file) {
      setResumeFile(null)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setResumeError('File size must be less than 5MB')
      setResumeFile(null)
      return
    }

    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setResumeError('File must be a PDF or Word document')
      setResumeFile(null)
      return
    }

    setResumeFile(file)
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!resumeFile) {
      setResumeError('Please upload your resume')
      return
    }

    setIsSubmitting(true)

    applyJobApplication(jobId, {
      candidate_name: values.fullName,
      candidate_email: values.email,
      candidate_phone: values.phone,
      candidate_current_role: values.currentRole,
      candidate_current_yoe: parseInt(values.yearsOfExperience),
      candidate_resume_id: resumeFile.name,
      candidate_linkedin: values.linkedinUrl,
      candidate_github: values.githubUrl,
      candidate_portfolio: values.portfolioUrl,
    })
    setIsSubmitting(false)
    form.reset()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="mx-auto max-w-3xl space-y-4">
          <div className="space-y-2">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Apply for {job?.job_title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {job?.job_location}
              </p>
            </div>

            <p className="text-muted-foreground">
              Complete the form below to apply for this position. Fields marked
              with * are required.
            </p>
          </div>

          <Card className="border shadow-sm">
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">
                        Personal Information
                      </h2>

                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name *</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl>
                                <Input
                                  type="email"
                                  placeholder="you@example.com"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="(555) 123-4567"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">
                        Professional Information
                      </h2>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="currentRole"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Role *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Software Engineer"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="yearsOfExperience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Years of Experience *</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="0"
                                  placeholder="5"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-2">
                        <FormLabel htmlFor="resume">Resume/CV *</FormLabel>
                        <div className="flex items-center gap-4">
                          <div className="relative flex-1">
                            <Input
                              id="resume"
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeChange}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-background text-muted-foreground">
                              <Upload className="h-4 w-4" />
                              <span className="text-sm truncate">
                                {resumeFile
                                  ? resumeFile.name
                                  : 'Upload your resume (PDF or Word)'}
                              </span>
                            </div>
                          </div>
                          {resumeFile && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setResumeFile(null)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        {resumeError && (
                          <p className="text-sm font-medium text-destructive">
                            {resumeError}
                          </p>
                        )}
                        <FormDescription>
                          Maximum file size: 5MB. Accepted formats: PDF, DOC,
                          DOCX.
                        </FormDescription>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold">Online Presence</h2>

                      <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Linkedin className="h-4 w-4" />
                              LinkedIn Profile *
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/yourprofile"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Github className="h-4 w-4" />
                              GitHub Profile
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://github.com/yourusername"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="portfolioUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              Portfolio Website
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://yourportfolio.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="hover:cursor-pointer"
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
