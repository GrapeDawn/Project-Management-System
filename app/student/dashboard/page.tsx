import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Bell, Calendar, ChevronRight, LayoutDashboard, LogOut, Settings, Users } from "lucide-react"
import Link from "next/link"

export default function Component() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white p-4 shadow-md">
        <div className="flex items-center mb-8">
          <LayoutDashboard className="h-6 w-6 text-blue-500 mr-2" />
          <h1 className="text-xl font-bold">StudyFlow</h1>
        </div>
        <nav>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Users className="mr-2 h-4 w-4" />
            Teams
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button variant="ghost" className="w-full justify-start mb-2">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Welcome back, Alex!</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="Alex" />
              <AvatarFallback>AS</AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Project Overview */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 completed this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">3 due today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <Progress value={68} className="mt-2" />
            </CardContent>
          </Card>
        </section>

        {/* Tasks and Team Members */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Tasks */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>Your tasks for this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Research for Literature Review', 'Prepare Presentation Slides', 'Code Review for Team Project', 'Submit Progress Report'].map((task, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                    <span className="flex-grow">{task}</span>
                    <Button variant="ghost" size="sm">
                      View
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>People you're working with</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {['John D.', 'Sarah M.', 'Mike R.', 'Emily L.'].map((member, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarImage src={`/placeholder-avatar-${i + 1}.jpg`} alt={member} />
                      <AvatarFallback>{member.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span>{member}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}