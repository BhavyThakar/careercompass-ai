import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  BookOpen,
  Target,
  Loader2,
  Activity,
  Award,
  CheckCircle2,
  AlertCircle,
  FileText,
  Eye,
  EyeOff,
  Download,
  RefreshCw,
  BarChart3,
  LineChart
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

// TypeScript interfaces for analysis data
interface SkillData {
  subject: string;
  score: number;
}

interface SubjectPerformance {
  subject: string;
  score: number;
  status: 'strength' | 'average' | 'gap';
}

interface LearningStyles {
  [key: string]: number;
}

interface AIInsight {
  type?: 'strength' | 'improvement' | 'warning';
  title?: string;
  description?: string;
}

interface AnalysisData {
  skills_data: SkillData[];
  subject_performance: SubjectPerformance[];
  learning_styles: LearningStyles;
  strengths: string[];
  weaknesses: string[];
  gaps: string[];
  ai_insights: AIInsight[];
  total_assessments: number;
  latest_assessment_date: string | null;
  performance_trend?: 'improving' | 'declining' | 'stable';
  overall_score?: number;
  percentile_rank?: number;
  improvement_suggestions?: string[];
}

const AnalysisDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'overview' | 'skills' | 'performance' | 'insights'>('overview');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [showDetails, setShowDetails] = useState(false);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    skills_data: [],
    subject_performance: [],
    learning_styles: {},
    strengths: [],
    weaknesses: [],
    gaps: [],
    ai_insights: [],
    total_assessments: 0,
    latest_assessment_date: null,
    performance_trend: 'stable',
    overall_score: 0,
    percentile_rank: 0,
    improvement_suggestions: []
  });

  useEffect(() => {
    const fetchAnalysisData = async () => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const user = JSON.parse(rawUser);

      try {
        // Try with Authorization header first
        let response = await fetch('http://localhost:5000/api/user/analysis', {
          headers: {
            "Authorization": `Bearer ${user.token || user.id}`,
            "Content-Type": "application/json"
          },
        });

        // If that fails, try with custom headers
        if (!response.ok && response.status === 401) {
          response = await fetch('http://localhost:5000/api/user/analysis', {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role || 'student',
            },
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch analysis data (${response.status})`);
          return;
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
      {/* Enhanced Header with Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Student Analysis Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              AI-powered insights into your academic performance and skills
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {analysisData.overall_score || 0}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-success">
                Top {100 - (analysisData.percentile_rank || 0)}%
              </div>
              <p className="text-sm text-muted-foreground">Percentile</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-warning">
                {analysisData.total_assessments}
              </div>
              <p className="text-sm text-muted-foreground">Assessments</p>
            </div>
          </div>
        </div>

        {/* Interactive Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-border">
          {['overview', 'skills', 'performance', 'insights'].map((view) => (
            <button
              key={view}
              onClick={() => setSelectedView(view as any)}
              className={`px-4 py-2 font-medium capitalize transition-all border-b-2 ${
                selectedView === view
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              {view}
            </button>
          ))}
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Time Range:</span>
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Conditional Content Based on Selected View */}
      {selectedView === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Performance Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Overall Score',
                value: `${analysisData.overall_score || 0}%`,
                icon: Activity,
                color: 'primary',
                trend: analysisData.performance_trend
              },
              {
                title: 'Percentile Rank',
                value: `Top ${100 - (analysisData.percentile_rank || 0)}%`,
                icon: Award,
                color: 'accent'
              },
              {
                title: 'Total Assessments',
                value: analysisData.total_assessments,
                icon: FileText,
                color: 'success'
              },
              {
                title: 'Skills Mastered',
                value: analysisData.strengths?.length || 0,
                icon: CheckCircle2,
                color: 'warning'
              }
            ].map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                <Card className={`border-${stat.color}/20 bg-${stat.color}/5 hover:shadow-lg transition-all`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <stat.icon className="w-4 h-4" />
                      {stat.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold text-${stat.color}`}>
                      {stat.value}
                    </div>
                    {stat.trend && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.trend === 'improving' && (
                          <span className="text-success flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Improving
                          </span>
                        )}
                        {stat.trend === 'declining' && (
                          <span className="text-warning flex items-center gap-1">
                            <TrendingDown className="w-3 h-3" /> Needs Attention
                          </span>
                        )}
                        {stat.trend === 'stable' && (
                          <span className="text-muted-foreground">Stable</span>
                        )}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.strengths?.slice(0, 3).map((strength, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-sm">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="border-warning/20 bg-warning/5">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Areas to Improve
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.weaknesses?.slice(0, 3).map((weakness, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warning rounded-full"></div>
                        <span className="text-sm">{weakness}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
            >
              <Card className="border-destructive/20 bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Target className="w-5 h-5 text-destructive" />
                    Skill Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.gaps?.slice(0, 3).map((gap, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-destructive rounded-full"></div>
                        <span className="text-sm">{gap}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Skills View */}
      {selectedView === 'skills' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Skills Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    Skills Assessment
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDetails(!showDetails)}
                    >
                      {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={analysisData.skills_data}>
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="score"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.6}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                {showDetails && (
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {analysisData.skills_data?.map((skill, index) => (
                      <motion.div
                        key={skill.subject}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary transition-colors">
                          <span className="font-medium">{skill.subject}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={skill.score} className="w-20 h-2" />
                            <span className="text-sm font-bold">{skill.score}%</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Styles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Learning Styles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(analysisData.learning_styles || {}).map(([style, percentage], index) => (
                    <motion.div
                      key={style}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer"
                    >
                      <div className="p-4 rounded-lg bg-card border border-border hover:border-accent transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{style.replace('_', ' ')}</span>
                          <span className="text-sm font-bold text-accent">{percentage}%</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Performance View */}
      {selectedView === 'performance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Subject Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-warning/20 bg-warning/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-warning" />
                    Subject Performance
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analysisData.subject_performance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Bar dataKey="score" fill="#f59e0b" />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-info/20 bg-info/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-info" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Trend</span>
                    <Badge variant={analysisData.performance_trend === 'improving' ? 'default' : analysisData.performance_trend === 'declining' ? 'destructive' : 'secondary'}>
                      {analysisData.performance_trend || 'stable'}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {analysisData.performance_trend === 'improving' && "Great progress! Keep up the excellent work."}
                    {analysisData.performance_trend === 'declining' && "Consider reviewing your study strategies."}
                    {analysisData.performance_trend === 'stable' && "Consistent performance. Try new challenges!"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {/* Insights View */}
      {selectedView === 'insights' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* AI Insights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-primary" />
                    AI-Powered Insights
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysisData.ai_insights?.length > 0 ? (
                    analysisData.ai_insights.map((insight, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-lg bg-card border border-border hover:border-primary transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          {insight.type && (
                            <div className={`p-2 rounded-full ${
                              insight.type === 'strength' ? 'bg-success/10' :
                              insight.type === 'improvement' ? 'bg-warning/10' :
                              'bg-info/10'
                            }`}>
                              {insight.type === 'strength' && <CheckCircle2 className="w-4 h-4 text-success" />}
                              {insight.type === 'improvement' && <AlertCircle className="w-4 h-4 text-warning" />}
                              {insight.type === 'warning' && <AlertTriangle className="w-4 h-4 text-info" />}
                            </div>
                          )}
                          <div className="flex-1">
                            {insight.title && (
                              <h4 className="font-medium text-foreground mb-1">
                                {insight.title}
                              </h4>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-muted-foreground">No AI insights available yet</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Improvement Suggestions */}
          {analysisData.improvement_suggestions && analysisData.improvement_suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-success/20 bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-success" />
                    Improvement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysisData.improvement_suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border hover:border-success transition-colors">
                        <div className="w-2 h-2 bg-success rounded-full flex-shrink-0"></div>
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AnalysisDashboard;
