import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

// Component Imports
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Page Imports
import Index from "./pages/Index";
import About from "./pages/About";
import Batches from "./pages/Batches";
import Notes from "./pages/Notes";
import PYQ from "./pages/PYQ";
import Attendance from "./pages/Attendance";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Donate from "./pages/Donate";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ForgetPassword from "./pages/forgetpass";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/batches" element={<Batches />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/pyq" element={<PYQ />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/donate" element={<Donate />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* --- YEH ROUTE MISSING THA --- */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="*" element={<NotFound />} />
            <Route path="/forgetpassword" element={<ForgetPassword/>} />
          </Routes>
          <Footer />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;