// components/Sidebar.tsx

import { LayoutDashboard, Calendar, Settings, LogOut, Home, Layers, Users, List, BarChart, ClipboardCheck, CheckCircle, Team } from "lucide-react";
import { Button } from "@/components/ui/button"; // Import Button correctly
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

// Define the Sidebar component
const Sidebar = () => {
  const router = useRouter();
  const userRole = Cookies.get("user-role");

  const handleLogout = () => {
    Cookies.remove("auth-token");
    Cookies.remove("user-role");
    alert("Logged out!");
    router.push("/login");
  };

  const renderCommonLinks = () => (
    {/*<nav>
      <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => router.push("/student/dashboard")}>
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start mb-2" onClick={() => router.push("/student/teams")}>
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
    </nav>*/}
  );

  const renderAdminLinks = () => (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/dashboard")}>
        <Home className="mr-2 h-4 w-4" />
        Admin Dashboard
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/projects")}>
        <Layers className="mr-2 h-4 w-4" />
        Projects
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/users")}>
        <Users className="mr-2 h-4 w-4" />
        Users
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/tasks")}>
        <List className="mr-2 h-4 w-4" />
        Tasks
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/analytics")}>
        <BarChart className="mr-2 h-4 w-4" />
        Analytics
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/admin/settings")}>
        <Settings className="mr-2 h-4 w-4" />
        Admin Settings
      </Button>
    </nav>
  );

  const renderGuideLinks = () => (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/guide/teams")}>
        <Team className="mr-2 h-4 w-4" />
        Teams
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/guide/submissions")}>
        <ClipboardCheck className="mr-2 h-4 w-4" />
        Submissions
      </Button>
      <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/guide/approved-submissions")}>
        <CheckCircle className="mr-2 h-4 w-4" />
        Approved Submissions
      </Button>
    </nav>
  );

  if (!userRole) {
    return <div>Loading...</div>;
  }

  return (
    <aside className="w-64 bg-white p-4 shadow-md">
      <div className="flex items-center mb-8">
        <Home className="h-6 w-6 text-blue-600 mr-2" />
        <h1 className="text-xl font-bold">{userRole === "admin" ? "AdminPro" : "GuideFlow"}</h1>
      </div>

      {renderCommonLinks()}

      {userRole === "admin" && renderAdminLinks()}
      {userRole === "guide" && renderGuideLinks()}

      <div>
        <Button variant="destructive" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="mr-2 h-5 w-5" />
          Log Out
        </Button>
      </div>
    </aside>
  );
};

// Export the Sidebar component
export default Sidebar;
