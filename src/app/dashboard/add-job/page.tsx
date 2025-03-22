'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { createJob } from '@/utils/api-job'
import { useAppContext } from '@/components/app-context'

const formSchema = z.object({
  jobTitle: z.string().min(2, {
    message: 'Job title must be at least 2 characters.',
  }),
  location: z.string().min(2, {
    message: 'Location must be at least 2 characters.',
  }),
  jobType: z.string({
    required_error: 'Please select a job type.',
  }),
  description: z.string().min(10, {
    message: 'Job description must be at least 10 characters.',
  }),
  requirements: z.string().min(10, {
    message: 'Job requirements must be at least 10 characters.',
  }),
  contactEmail: z.string().email({
    message: 'Please enter a valid email address.',
  }),
})

export default function PostJobPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setRefreshJobs } = useAppContext()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      jobTitle: '',
      location: '',
      jobType: '',
      description: '',
      requirements: '',
      contactEmail: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)

    const response = await createJob({
      job_title: values.jobTitle,
      job_location: values.location,
      job_type: values.jobType,
      job_description: values.description,
      job_requirements: values.requirements,
      job_contact_email: values.contactEmail,
    })

    if (response === 201) {
      form.reset()
      setRefreshJobs(true)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 container py-6 px-4 md:px-6">
        <div className="mx-auto space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Post a New Job
            </h1>
            <p className="text-muted-foreground">
              Fill out the form below to post your job opening. All fields
              marked with * are required.
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
                    <FormField
                      control={form.control}
                      name="jobTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Title *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Senior Software Engineer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid gap-6 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. San Francisco, CA"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="jobType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Type *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select job type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="full-time">
                                  Full-time
                                </SelectItem>
                                <SelectItem value="part-time">
                                  Part-time
                                </SelectItem>
                                <SelectItem value="contract">
                                  Contract
                                </SelectItem>
                                <SelectItem value="internship">
                                  Internship
                                </SelectItem>
                                <SelectItem value="temporary">
                                  Temporary
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Provide a detailed description of the job role, responsibilities, and company culture..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="requirements"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Requirements *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="List the skills, qualifications, and experience required for this position..."
                              className="min-h-[150px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. jobs@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="hover:cursor-pointer"
                    >
                      {isSubmitting ? 'Posting...' : 'Post Job'}
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
