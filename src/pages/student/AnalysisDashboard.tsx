import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Lightbulb,
  BookOpen,
  Target,
  Sparkles,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const AnalysisDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState({
    skills_data: [],
    subject_performance: [],
    learning_styles: {},
    strengths: [],
    weaknesses: [],
    gaps: [],
    ai_insights: [],
    total_assessments: 0,
    latest_assessment_date: null
  });

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) {
          throw new Error('User not logged in');
        }

        const user = JSON.parse(rawUser);

        const response = await fetch('http://localhost:5000/api/user/analysis', {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch analysis data');
        }

        const data = await response.json();
        setAnalysisData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Student Analysis Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights into your academic performance and skills
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
            Student Analysis Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered insights into your academic performance and skills
          </p>
        </motion.div>
        <div className="text-center text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Student Analysis Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-powered insights into your academic performance and skills
        </p>
      </motion.div>

      {/* Strengths, Weaknesses, Gaps Cards */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-success/20 bg-success/5 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <TrendingUp className="w-5 h-5" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.strengths && analysisData.strengths.length > 0 ? (
                analysisData.strengths.map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-success" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No strengths identified yet</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-warning/20 bg-warning/5 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <TrendingDown className="w-5 h-5" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.weaknesses && analysisData.weaknesses.length > 0 ? (
                analysisData.weaknesses.map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No areas to improve identified</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-destructive/20 bg-destructive/5 h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Learning Gaps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {analysisData.gaps && analysisData.gaps.length > 0 ? (
                analysisData.gaps.map((item: string) => (
                  <div key={item} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No learning gaps identified</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Skills Radar & Subject Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Skills Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={analysisData.skills_data}>
                    <PolarGrid className="stroke-border" />
                    <PolarAngleAxis
                      dataKey="subject"
                      className="text-sm text-muted-foreground"
                      tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      className="text-muted-foreground"
                    />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analysisData.subject_performance} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis
                      type="category"
                      dataKey="subject"
                      width={120}
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--primary))"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Learning Style & AI Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-accent" />
                Learning Style Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {analysisData.learning_styles && Object.keys(analysisData.learning_styles).length > 0 ? (
                Object.entries(analysisData.learning_styles).map(([style, value]: [string, any]) => (
                  <div key={style}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{style}</span>
                      <span className="text-sm text-muted-foreground">{value}%</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">Learning style analysis not available</div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                AI-Generated Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData.ai_insights && analysisData.ai_insights.length > 0 ? (
                analysisData.ai_insights.map((insight: any, index: number) => (
                  <div key={index} className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        insight.type === 'strength' ? 'bg-primary/10' :
                        insight.type === 'improvement' ? 'bg-warning/10' :
                        'bg-accent/10'
                      }`}>
                        {insight.type === 'strength' ? (
                          <Lightbulb className="w-4 h-4 text-primary" />
                        ) : insight.type === 'improvement' ? (
                          <AlertTriangle className="w-4 h-4 text-warning" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-accent" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">
                          {insight.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted-foreground">No AI insights available yet</div>
              )}
              <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="secondary">Personalized Analysis</Badge>
                <Badge variant="secondary">AI-Powered</Badge>
                <Badge variant="secondary">Career Insights</Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
