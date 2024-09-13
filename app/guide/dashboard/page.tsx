'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Check, X, FileText, Users, BookOpen } from 'lucide-react'

// Mock data - replace with actual API calls in a real application
const studentGroups = [
  { id: 1, name: 'Group A', members: ['John Doe', 'Jane Smith'], progress: 75 },
  { id: 2, name: 'Group B', members: ['Alice Johnson', 'Bob Williams'], progress: 60 },
  { id: 3, name: 'Group C', members: ['Charlie Brown', 'Diana Davis'], progress: 90 },
]

const submissions = [
  { id: 1, groupId: 1, title: 'Project Proposal', status: 'Pending', date: '2023-06-01' },
  { id: 2, groupId: 2, title: 'Midterm Report', status: 'Approved', date: '2023-06-15' },
  { id: 3, groupId: 3, title: 'Final Presentation', status: 'Pending', date: '2023-06-30' },
]

const examResults = [
  { id: 1, groupId: 1, examTitle: 'Midterm Exam', marks: 85, remarks: 'Good performance, needs improvement in methodology' },
  { id: 2, groupId: 2, examTitle: 'Final Exam', marks: 92, remarks: 'Excellent work, well-structured presentation' },
  { id: 3, groupId: 3, examTitle: 'Project Defense', marks: 88, remarks: 'Strong concept, could improve on time management' },
]

export default function GuideDashboard() {
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredGroups = studentGroups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.members.some(member => member.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const groupSubmissions = submissions.filter(submission => submission.groupId === selectedGroup)
  const groupExams = examResults.filter(exam => exam.groupId === selectedGroup)

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Guide Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Groups</CardTitle>
            <CardDescription>Number of groups you're mentoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{studentGroups.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Submissions</CardTitle>
            <CardDescription>Submissions awaiting approval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{submissions.filter(s => s.status === 'Pending').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Progress</CardTitle>
            <CardDescription>Overall progress of all groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">
              {Math.round(studentGroups.reduce((acc, group) => acc + group.progress, 0) / studentGroups.length)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Select Student Group</CardTitle>
          <CardDescription>Choose a group to view details and manage submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-grow">
              <Input
                placeholder="Search groups or students"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select onValueChange={(value: string) => setSelectedGroup(Number(value))}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {filteredGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id.toString()}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((group) => (
                <TableRow key={group.id} className="cursor-pointer" onClick={() => setSelectedGroup(group.id)}>
                  <TableCell>{group.name}</TableCell>
                  <TableCell>{group.members.join(', ')}</TableCell>
                  <TableCell>
                    <Progress value={group.progress} className="w-[60%]" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedGroup && (
        <Card>
          <CardHeader>
            <CardTitle>{studentGroups.find(g => g.id === selectedGroup)?.name} Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="submissions">
              <TabsList>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="exams">Exam Results</TabsTrigger>
              </TabsList>
              <TabsContent value="submissions">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{submission.title}</TableCell>
                        <TableCell>{submission.date}</TableCell>
                        <TableCell>{submission.status}</TableCell>
                        <TableCell>
                          {submission.status === 'Pending' && (
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => alert('Submission approved')}>
                                <Check className="w-4 h-4 mr-1" /> Approve
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => alert('Submission rejected')}>
                                <X className="w-4 h-4 mr-1" /> Reject
                              </Button>
                            </div>
                          )}
                          {submission.status === 'Approved' && (
                            <Button size="sm" variant="outline" onClick={() => alert('Viewing submission')}>
                              <FileText className="w-4 h-4 mr-1" /> View
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="exams">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Exam Title</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Remarks</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.examTitle}</TableCell>
                        <TableCell>{exam.marks}</TableCell>
                        <TableCell>{exam.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}