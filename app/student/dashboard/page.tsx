"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Calendar, ChevronRight, LayoutDashboard, LogOut, Settings, Users, UserPlus, UserMinus } from "lucide-react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Component() {
  const [isTeamLeader, setIsTeamLeader] = useState(true);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState([]); // Ensure initialized as an empty array
  const [errorMessage, setErrorMessage] = useState('');
  const [soloMode, setSoloMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = Cookies.get("auth-token");

        if (!token) {
          alert("Unauthorized access. Please log in.");
          router.push("/login");
          return;
        }

        const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          alert("Unauthorized access. Please log in.");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          if (!data.teamMembers) {
            throw new Error("No team associated with your account.");
          }
          setTeamMembers(data.teamMembers || []); // Ensure non-null array
        } else {
          alert("Failed to fetch team members. Please try again.");
        }
      } catch (error) {
        setErrorMessage(error.message);
        // Log and handle the error as needed
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [router]);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = Cookies.get("auth-token");

      if (!token) {
        alert("Unauthorized access. Please log in.");
        router.push("/login");
        return;
      }

      const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newMemberEmail }),
      });

      if (response.ok) {
        alert("Member added successfully!");
        setNewMemberEmail("");
        setTeamMembers([...teamMembers, { name: "New Member", email: newMemberEmail }]);
      } else {
        alert("Failed to add member. Please try again.");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleRemoveMember = async (email: string) => {
    try {
      const token = Cookies.get("auth-token");

      if (!token) {
        alert("Unauthorized access. Please log in.");
        router.push("/login");
        return;
      }

      const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/remove-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        setTeamMembers(teamMembers.filter((member) => member.email !== email));
        alert(`Member ${email} removed successfully!`);
      } else {
        alert("Failed to remove member. Please try again.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const token = Cookies.get("auth-token");

      if (!token) {
        alert("Unauthorized access. Please log in.");
        router.push("/login");
        return;
      }

      const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/leave-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: "your-user-id" }), // Replace 'your-user-id' with the actual user ID
      });

      if (response.ok) {
        alert("You have left the group successfully!");
        // Here you might want to redirect the user or update the UI
        // For example: router.push("/dashboard");
      } else {
        alert("Failed to leave the group. Please try again.");
      }
    } catch (error) {
      console.error("Error leaving group:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleGoSolo = async () => {
    try {
      const token = Cookies.get("auth-token");
      const userEmail = Cookies.get("user-email");

      if (!token) {
        alert("Unauthorized access. Please log in.");
        router.push("/login");
        return;
      }

      const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/add-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ memberEmail: userEmail }), // Send user email
      }).catch(error => {
        console.error("Error going solo:", error);
        alert("An error occurred. Please try again.");
      });

      if (response.ok) {
        alert("You are now working solo.");
        setSoloMode(true);
        setTeamMembers([]); // Clear the team members
      } else {
        alert("Failed to switch to solo mode. Please try again.");
      }
    } catch (error) {
      console.error("Error in the try block:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white p-4 shadow-md">
        <div className="flex items-center mb-8">
          <LayoutDashboard className="h-6 w-6 text-primary mr-2" />
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

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Team: Research Pioneers</h2>
          {isTeamLeader && !soloMode ? (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                  <DialogDescription>
                    Enter the email address of the new team member you want to add.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddMember} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter member's email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    required
                  />
                  
                  <Button type="submit">Add Member</Button>
                </form>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Button variant="destructive" onClick={handleLeaveGroup}>
                <LogOut className="mr-2 h-4 w-4" />
                Leave Group
              </Button>
              <Button variant="default" onClick={handleGoSolo}>
                <UserMinus className="mr-2 h-4 w-4" />
                Go Solo
              </Button>
            </>
          )}
        </div>

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

        <div className="space-y-6">
          {errorMessage ? (
            <div className="space-y-4">
              <p className="text-red-500">{errorMessage}</p>
              <Button variant="default" onClick={handleGoSolo}>
                Go Solo
              </Button>
            </div>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>Your tasks for this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Research for Literature Review", "Prepare Presentation Slides", "Code Review for Team Project", "Submit Progress Report"].map(
                    (task, i) => (
                      <div key={i} className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full mr-2" />
                        <span className="flex-grow">{task}</span>
                        <Button variant="ghost" size="sm">
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {teamMembers && teamMembers.length > 0 && !soloMode ? (
            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>People you're working with</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamMembers.map((member, i) => (
                    <Card key={i}>
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-4">
                            <AvatarImage src={`/placeholder-avatar-${i + 1}.jpg`} alt={member.name} />
                            <AvatarFallback>{member.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        {isTeamLeader && !soloMode && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.email)}
                            aria-label={`Remove ${member.name}`}
                          >
                            <UserMinus className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : !errorMessage && (
            <p>No team members found.</p>
          )}
        </div>
      </main>
    </div>
  );
}