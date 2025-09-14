import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Home, BookOpen, Users, Settings } from "lucide-react";

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/"); // Logout ke baad homepage par bhej do
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex bg-muted/20">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r shadow-sm">
        <div className="p-6 text-2xl font-bold text-primary">EduSite</div>
        <nav className="flex-1 px-4 space-y-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 w-full text-left">
            <Home className="h-4 w-4" /> Overview
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 w-full text-left">
            <BookOpen className="h-4 w-4" /> Batches
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 w-full text-left">
            <Users className="h-4 w-4" /> Students
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 w-full text-left">
            <Settings className="h-4 w-4" /> Settings
          </button>
        </nav>
        <div className="p-4 border-t">
          <Button
            onClick={handleSignOut}
            variant="destructive"
            className="w-full flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <div className="flex items-center gap-3">
            <div className="text-sm text-muted-foreground">
              {user.fullName || user.email}
            </div>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
              {user.fullName
                ? user.fullName.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-6 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome Back, {user.fullName || user.email} 👋
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You are successfully logged in to your educational dashboard.
                </p>
                <p className="text-sm text-muted-foreground">
                  Use the sidebar to navigate through batches, students, and
                  settings.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
