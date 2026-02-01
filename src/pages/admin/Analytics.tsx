import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  Briefcase,
  Calendar,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  Legend,
} from "recharts";

interface MonthlyData {
  month: string;
  students: number;
  analyzed: number;
  matches: number;
  uploads: number;
}

interface WeeklyData {
  week: string;
  registrations: number;
  analyses: number;
  matches: number;
}

interface CareerData {
  name: string;
  value: number;
  growth: number;
  color: string;
}

interface SkillDemandData {
  skill: string;
  demand: number;
  current: number;
}

interface PerformanceMetric {
  metric: string;
  value: number;
  change: number;
  trend: string;
}

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [careerData, setCareerData] = useState<CareerData[]>([]);
  const [skillDemandData, setSkillDemandData] = useState<SkillDemandData[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalAssessments, setTotalAssessments] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) {
          throw new Error('User not logged in');
        }

        const user = JSON.parse(rawUser);

        const response = await fetch('http://localhost:5000/api/admin/analytics', {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }

        const data = await response.json();

        // Set the data from API
        setMonthlyData(data.monthly_data || []);
        setWeeklyData(data.weekly_data || []);
        setCareerData(data.career_distribution || []);
        setSkillDemandData(data.skill_demand_data || []);
        setPerformanceMetrics(data.performance_metrics || []);

        // Calculate totals from monthly data
        const totalStudentsCalc = data.monthly_data?.reduce((sum: number, item: MonthlyData) => sum + item.students, 0) || 0;
        const totalAssessmentsCalc = data.monthly_data?.reduce((sum: number, item: MonthlyData) => sum + item.analyzed, 0) || 0;
        const totalMatchesCalc = data.monthly_data?.reduce((sum: number, item: MonthlyData) => sum + item.matches, 0) || 0;

        setTotalStudents(totalStudentsCalc);
        setTotalAssessments(totalAssessmentsCalc);
        setTotalMatches(totalMatchesCalc);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into student data and system performance
          </p>
        </motion.div>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive insights into student data and system performance
          </p>
        </motion.div>
        <div className="text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  const matchRate = totalAssessments > 0 ? ((totalMatches / totalAssessments) * 100).toFixed(1) : '0.0';
  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Analytics Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights into student data and system performance
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Last 30 Days
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={totalStudents.toLocaleString()}
          icon={Users}
          variant="primary"
          trend={{ value: 12, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Profiles Analyzed"
          value={totalAssessments.toLocaleString()}
          icon={FileText}
          variant="success"
          trend={{ value: 8, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Job Matches"
          value={totalMatches.toLocaleString()}
          icon={Briefcase}
          variant="primary"
          trend={{ value: 15, label: "vs last month", positive: true }}
        />
        <StatCard
          title="Match Rate"
          value={`${matchRate}%`}
          icon={TrendingUp}
          variant="success"
          trend={{ value: 3.2, label: "vs last month", positive: true }}
        />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="careers">Careers</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Monthly Trends */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Monthly Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "0.5rem"
                          }}
                        />
                        <Legend />
                        <Bar dataKey="students" fill="hsl(var(--primary))" name="New Students" />
                        <Line
                          type="monotone"
                          dataKey="matches"
                          stroke="hsl(var(--success))"
                          strokeWidth={3}
                          name="Job Matches"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Career Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Career Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={careerData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {careerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-4">
                    {careerData.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-muted-foreground">{item.name}</span>
                        <Badge variant="outline" className="text-xs">
                          +{item.growth}%
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Weekly Activity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyData}>
                      <defs>
                        <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="registrations"
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorRegistrations)"
                        name="New Registrations"
                      />
                      <Area
                        type="monotone"
                        dataKey="analyses"
                        stroke="hsl(var(--success))"
                        fillOpacity={1}
                        fill="url(#colorAnalyses)"
                        name="Profile Analyses"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Student Growth Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Student Registration Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="students"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Analysis vs Registrations */}
            <Card>
              <CardHeader>
                <CardTitle>Analysis Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Bar dataKey="analyzed" fill="hsl(var(--success))" name="Analyzed" />
                      <Bar dataKey="students" fill="hsl(var(--primary))" name="Registered" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="careers" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Career Popularity */}
            <Card>
              <CardHeader>
                <CardTitle>Career Field Popularity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={careerData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Bar dataKey="value" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Skill Demand vs Current */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Demand Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={skillDemandData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "0.5rem"
                        }}
                      />
                      <Legend />
                      <Bar dataKey="demand" fill="hsl(var(--warning))" name="Market Demand" />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        name="Current Students"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={metric.metric}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.metric}
                        </p>
                        <p className="text-2xl font-bold">{metric.value}%</p>
                      </div>
                      <Badge
                        variant={metric.trend === "up" ? "default" : "secondary"}
                        className="flex items-center gap-1"
                      >
                        <TrendingUp className={`w-3 h-3 ${metric.trend === "down" ? "rotate-180" : ""}`} />
                        {metric.change > 0 ? "+" : ""}{metric.change}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* System Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem"
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="uploads"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Resume Uploads"
                    />
                    <Line
                      type="monotone"
                      dataKey="matches"
                      stroke="hsl(var(--success))"
                      strokeWidth={3}
                      name="Successful Matches"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
