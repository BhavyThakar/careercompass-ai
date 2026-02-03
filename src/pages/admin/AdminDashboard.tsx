import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Users,
  FileText,
  Briefcase,
  TrendingUp,
  Upload,
  BarChart3,
  GraduationCap,
  Building2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type CareerItem = {
  name: string;
  value: number;
};

type MonthlyData = {
  month: string;
  students: number;
};

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_users: 0,
    total_assessments: 0,
    total_resumes: 0,
    total_matches: 0,
    career_distribution: [] as CareerItem[],
  });
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return;

        const user = JSON.parse(rawUser);

        // Fetch stats
        const statsRes = await fetch("http://localhost:5000/api/admin/stats", {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!statsRes.ok) {
          console.error("Admin access denied");
          return;
        }

        const statsData = await statsRes.json();

        setStats({
          total_users: statsData.total_users ?? 0,
          total_assessments: statsData.total_assessments ?? 0,
          total_resumes: statsData.total_resumes ?? 0,
          total_matches: statsData.total_matches ?? 0,
          career_distribution: statsData.career_distribution ?? [],
        });

        // Fetch analytics for monthly data
        const analyticsRes = await fetch("http://localhost:5000/api/admin/analytics", {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (analyticsRes.ok) {
          const analyticsData = await analyticsRes.json();
          const formattedMonthlyData = analyticsData.monthly_data?.map((item: { month: string; students: number }) => ({
            month: item.month,
            students: item.students,
          })) ?? [];
          setMonthlyData(formattedMonthlyData);
        }
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading dashboard…</div>;
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of student analysis and career matching system
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={String(stats.total_users)} icon={Users} />
        <StatCard title="Profiles Analyzed" value={String(stats.total_assessments)} icon={GraduationCap} />
        <StatCard title="Resumes Uploaded" value={String(stats.total_resumes)} icon={FileText} />
        <StatCard title="Job Matches" value={String(stats.total_matches)} icon={Briefcase} />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Student Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="students" stroke="#6366f1" fill="#6366f1" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Career Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.career_distribution} dataKey="value" innerRadius={60} outerRadius={80}>
                  {stats.career_distribution.map((_, i) => (
                    <Cell key={i} fill="#6366f1" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/upload"><Button variant="outline">Upload Student Data</Button></Link>
          <Link to="/admin/students"><Button variant="outline">View All Students</Button></Link>
          <Link to="/admin/companies"><Button variant="outline">Manage Companies</Button></Link>
          <Link to="/admin/analytics"><Button variant="outline">View Analytics</Button></Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
