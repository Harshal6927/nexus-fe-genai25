'use client'

import { useState, useEffect } from 'react'
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
import { toast } from 'sonner'

interface Department {
  id: number
  department_name: string
}

export default function Page() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [newDepartmentName, setNewDepartmentName] = useState('')
  const [editDepartmentName, setEditDepartmentName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Load initial departments when component mounts
  useEffect(() => {
    handleGetDepartments()
  }, [])

  // Function to initialize departments (mock data for now)
  const handleGetDepartments = () => {
    setIsLoading(true)

    // Mock data - replace with actual API call later
    const mockDepartments: Department[] = [
      { id: 1, department_name: 'HR' },
      { id: 2, department_name: 'Finance' },
      { id: 3, department_name: 'Engineering' },
      { id: 4, department_name: 'Marketing' },
    ]

    setTimeout(() => {
      setDepartments(mockDepartments)
      setIsLoading(false)
    }, 500) // Simulating API delay
  }

  // Function to create a new department
  const handleCreateDepartment = async () => {
    if (!newDepartmentName.trim()) return

    setIsLoading(true)
    try {
      // Mock create operation
      const newDepartment: Department = {
        id:
          departments.length > 0
            ? Math.max(...departments.map((d) => d.id)) + 1
            : 1,
        department_name: newDepartmentName,
      }

      // Update state
      setDepartments([...departments, newDepartment])
      toast.success('Department created successfully')

      // Reset form
      setNewDepartmentName('')
      setIsCreateDialogOpen(false)
    } catch (error) {
      toast.error('Failed to create department')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to update an existing department
  const handleUpdateDepartment = async () => {
    if (!editDepartmentName.trim() || !selectedDepartment) return

    setIsLoading(true)
    try {
      // Update department in state
      const updatedDepartments = departments.map((dept) =>
        dept.id.toString() === selectedDepartment
          ? { ...dept, department_name: editDepartmentName }
          : dept,
      )

      setDepartments(updatedDepartments)
      toast.success('Department updated successfully')

      // Reset form
      setEditDepartmentName('')
      setIsEditDialogOpen(false)
    } catch (error) {
      toast.error('Failed to update department')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Function to delete a department
  const handleDeleteDepartment = async () => {
    if (!selectedDepartment) return

    setIsLoading(true)
    try {
      // Delete department from state
      const filteredDepartments = departments.filter(
        (dept) => dept.id.toString() !== selectedDepartment,
      )

      setDepartments(filteredDepartments)
      setSelectedDepartment('')
      toast.success('Department deleted successfully')
    } catch (error) {
      toast.error('Failed to delete department')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to get the name of the selected department
  const getSelectedDepartmentName = () => {
    const department = departments.find(
      (d) => d.id.toString() === selectedDepartment,
    )
    return department ? department.department_name : ''
  }

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value)
    setEditDepartmentName(
      departments.find((d) => d.id.toString() === value)?.department_name || '',
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/dashboard/config">
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Configuration
        </Button>
      </Link>
      <h2 className="text-2xl font-bold mb-6">Department Management</h2>
      <div>
        <Card className="w-full max-w-3xl mx-auto p-4 mb-8">
          <div className="space-y-6 mx-auto">
            <div className="space-y-2">
              <Label htmlFor="department-select">Select Department</Label>
              <Select
                value={selectedDepartment}
                onValueChange={handleDepartmentChange}
              >
                <SelectTrigger id="department-select" className="w-full">
                  <SelectValue placeholder="Select a department" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  {departments.map((department) => (
                    <SelectItem
                      key={department.id}
                      value={department.id.toString()}
                    >
                      {department.department_name}
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
                    className="flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Create Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Department</DialogTitle>
                    <DialogDescription>
                      Add a new department to your organization.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="new-department-name">Department Name</Label>
                    <Input
                      id="new-department-name"
                      value={newDepartmentName}
                      onChange={(e) => setNewDepartmentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateDepartment}
                      disabled={isLoading}
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
                    disabled={!selectedDepartment || isLoading}
                    onClick={() => {
                      setEditDepartmentName(getSelectedDepartmentName())
                      setIsEditDialogOpen(true)
                    }}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCcw className="h-4 w-4" />
                    )}
                    Update Department
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update Department</DialogTitle>
                    <DialogDescription>
                      Edit the selected department&apos;s name.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <Label htmlFor="edit-department-name">
                      Department Name
                    </Label>
                    <Input
                      id="edit-department-name"
                      value={editDepartmentName}
                      onChange={(e) => setEditDepartmentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateDepartment}
                      disabled={isLoading}
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
                disabled={!selectedDepartment || isLoading}
                onClick={handleDeleteDepartment}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
                Delete Department
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
