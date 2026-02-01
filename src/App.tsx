import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentLayout from "./components/layout/StudentLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ProfileOverview from "./pages/student/ProfileOverview";
import AnalysisDashboard from "./pages/student/AnalysisDashboard";
import CareerRecommendations from "./pages/student/CareerRecommendations";
import PathUnlocking from "./pages/student/PathUnlocking";
import LearningRoadmaps from "./pages/student/LearningRoadmaps";
import ResumeAnalyzer from "./pages/student/ResumeAnalyzer";
import CareerReadiness from "./pages/student/CareerReadiness";
import ResumeRatings from "./pages/student/ResumeRatings";
import NearbyOpportunities from "./pages/student/NearbyOpportunities";
import JobMatching from "./pages/student/JobMatching";
import Mentorship from "./pages/student/Mentorship";
import ActionRoadmap from "./pages/student/ActionRoadmap";
import StudentSettings from "./pages/student/Settings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllStudents from "./pages/admin/AllStudents";
import DataUpload from "./pages/admin/DataUpload";
import Analytics from "./pages/admin/Analytics";
import JobRoles from "./pages/admin/JobRoles";
import ResumeSettings from "./pages/admin/ResumeSettings";
import ManageLocations from "./pages/admin/ManageLocations";
import AIConfiguration from "./pages/admin/AIConfiguration";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      if (location.pathname !== "/login") {
        navigate("/login");
      }
      return;
    }

    const isStudentRoute = location.pathname.startsWith("/student");
    const isAdminRoute = location.pathname.startsWith("/admin");

    if (isStudentRoute && user.role !== "user") {
      navigate("/login");
    } else if (isAdminRoute && user.role !== "admin") {
      navigate("/login");
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />

      {/* Student Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<ProfileOverview />} />
        <Route path="analysis" element={<AnalysisDashboard />} />
        <Route path="careers" element={<CareerRecommendations />} />
        <Route path="paths" element={<PathUnlocking />} />
        <Route path="roadmaps" element={<LearningRoadmaps />} />
        <Route path="resume" element={<ResumeAnalyzer />} />
        <Route path="readiness" element={<CareerReadiness />} />
        <Route path="ratings" element={<ResumeRatings />} />
        <Route path="opportunities" element={<NearbyOpportunities />} />
        <Route path="jobs" element={<JobMatching />} />
        <Route path="mentorship" element={<Mentorship />} />
        <Route path="actions" element={<ActionRoadmap />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="students" element={<AllStudents />} />
        <Route path="upload" element={<DataUpload />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="companies" element={<JobRoles />} />
        <Route path="resume-settings" element={<ResumeSettings />} />
        <Route path="locations" element={<ManageLocations />} />
        <Route path="ai-config" element={<AIConfiguration />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
