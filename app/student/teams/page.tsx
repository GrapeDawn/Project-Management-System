'use client';
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation"; // Import useRouter from next/router
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserMinus, UserPlus } from "lucide-react";
import Cookies from "js-cookie";

const Teams = () => {
  const [teamMembers, setTeamMembers] = useState([]); // Holds team member data
  const [newMemberEmail, setNewMemberEmail] = useState(""); // Holds new member email input
  const [errorMessage, setErrorMessage] = useState(""); // Handles errors in the UI
  const router = useRouter(); // Router for navigation

  // Fetch team members on component mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const token = Cookies.get("auth-token");

        if (!token) {
          alert("Unauthorized access. Please log in.");
          router.push("/login"); // Navigate to login if no token
          return;
        }

        const response = await fetch("https://o1gk7huir8.execute-api.ap-south-1.amazonaws.com/dev/user/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          alert("Unauthorized access. Please log in.");
          router.push("/login");
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.teamMembers || []); // Set team members in state
        } else {
          setErrorMessage("Failed to fetch team members. Please try again.");
        }
      } catch (error) {
        setErrorMessage("An error occurred while fetching team members.");
        console.error("Error fetching team members:", error);
      }
    };

    fetchTeamMembers();
  }, [router]); // Dependency array includes router to avoid stale closures

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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newMemberEmail }),
      });

      if (response.ok) {
        alert("Member added successfully!");
        setNewMemberEmail(""); // Clear input after success
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
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

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold">Team: Research Pioneers</h1>
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
        </header>

        <section>
          {errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : teamMembers.length > 0 ? (
            <div className="space-y-4">
              {teamMembers.map((member, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <Avatar className="mr-4">
                      <AvatarImage src={`/placeholder-avatar-${i + 1}.jpg`} alt={member.name} />
                      <AvatarFallback>{member.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p>{member.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.email)}>
                    <UserMinus className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p>No team members found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Teams;
