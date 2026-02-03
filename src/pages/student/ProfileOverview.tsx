import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  Calendar,
  Award,
  TrendingUp,
  BookOpen,
  Clock,
  Loader2
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { TrustBadge } from "@/components/ui/trust-badge";
import { ProgressRing } from "@/components/ui/progress-ring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserProfile {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    joined_date: string;
  };
  stats: {
    total_assessments: number;
    total_recommendations: number;
    overall_cgpa: number;
    improvement_score: number;
    last_assessment_date: string;
  };
  performance_data: Array<{ month: string; score: number }>;
  attendance_data: Array<{ month: string; rate: number }>;
}

const ProfileOverview = () => {
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
        } else {
          setError("Failed to fetch profile data");
        }
      } catch (err) {
        setError("Network error. Please check if the backend is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading profile data...</span>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <Alert className="border-destructive/50 text-destructive">
          <AlertDescription>
            {error || "Failed to load profile data"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Profile Overview
          </h1>
          <p className="text-muted-foreground mt-1">
            Your academic summary generated from verified data
          </p>
        </div>
        <TrustBadge level="high" />
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden">
          <div className="h-24 gradient-primary" />
          <CardContent className="relative pt-0">
            <div className="flex flex-col lg:flex-row lg:items-end gap-6 -mt-12">
              <div className="w-24 h-24 rounded-2xl bg-card border-4 border-card shadow-lg flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>
              <div className="flex-1 pb-2">
                <h2 className="text-2xl font-bold font-display text-foreground">
                  {profileData.user.name}
                </h2>
                <p className="text-muted-foreground">{profileData.user.email}</p>
              </div>
              <div className="flex flex-wrap gap-3 pb-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {new Date(profileData.user.joined_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Overall CGPA"
          value={profileData.stats.overall_cgpa.toFixed(1)}
          subtitle="Out of 10.0"
          icon={Award}
          variant="primary"
          trend={{ value: profileData.stats.improvement_score, label: "vs last assessment", positive: profileData.stats.improvement_score > 0 }}
        />
        <StatCard
          title="Total Assessments"
          value={profileData.stats.total_assessments.toString()}
          subtitle="Completed"
          icon={Clock}
          variant="success"
        />
        <StatCard
          title="Career Recommendations"
          value={profileData.stats.total_recommendations.toString()}
          subtitle="Generated"
          icon={BookOpen}
        />
        <StatCard
          title="Improvement Score"
          value={`${profileData.stats.improvement_score > 0 ? '+' : ''}${profileData.stats.improvement_score}%`}
          subtitle="Performance trend"
          icon={TrendingUp}
          variant={profileData.stats.improvement_score > 0 ? "success" : "warning"}
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profileData.performance_data}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis domain={[60, 100]} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorScore)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                Assessment Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profileData.attendance_data}>
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-muted-foreground" />
                    <YAxis domain={[0, 100]} className="text-muted-foreground" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAttendance)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Data Sources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Data Sources & Trust Levels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { source: "Academic Records", trust: "high" as const, desc: "Admin-uploaded marks & grades" },
                { source: "Attendance Data", trust: "high" as const, desc: "System-tracked attendance" },
                { source: "Resume Analysis", trust: "medium" as const, desc: "AI-extracted skills & projects" },
                { source: "Self-Declared Interests", trust: "low" as const, desc: "Student-provided preferences" },
              ].map((item) => (
                <div
                  key={item.source}
                  className="p-4 rounded-xl border border-border bg-card"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{item.source}</span>
                    <TrustBadge level={item.trust} showLabel={false} />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ProfileOverview;
