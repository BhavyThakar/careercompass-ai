import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Compass,
  TrendingUp,
  CheckCircle2,
  Info,
  ChevronRight,
  Code,
  Database,
  Brain,
  Globe,
  Shield,
  Smartphone,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressRing } from "@/components/ui/progress-ring";

const iconMap = {
  "Software Developer": Code,
  "Data Engineer": Database,
  "Full Stack Developer": Globe,
  "Machine Learning Engineer": Brain,
  "Mobile App Developer": Smartphone,
  "Cybersecurity Analyst": Shield,
};

const CareerRecommendations = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState([]);
  const [topRecommendation, setTopRecommendation] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) {
          throw new Error('User not logged in');
        }

        const user = JSON.parse(rawUser);

        const response = await fetch('http://localhost:5000/api/user/recommendations', {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setTopRecommendation(data.top_recommendation);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Career Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-matched career paths based on your skills and aptitude
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
            Career Recommendations
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-matched career paths based on your skills and aptitude
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
          Career Recommendations
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-matched career paths based on your skills and aptitude
        </p>
      </motion.div>

      {/* Top Match Card */}
      {topRecommendation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <ProgressRing value={topRecommendation.match} size={140}>
                  <div className="text-center">
                    <span className="text-3xl font-bold font-display text-foreground">{topRecommendation.match}%</span>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </ProgressRing>
                <div className="flex-1 text-center lg:text-left">
                  <Badge className="mb-3 gradient-primary border-0">Top Recommendation</Badge>
                  <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                    {topRecommendation.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {topRecommendation.description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {topRecommendation.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <p className="text-sm text-muted-foreground">Expected Salary</p>
                  <p className="text-xl font-bold text-foreground">$80k - $150k</p>
                  <p className="text-sm text-success mt-2">
                    <TrendingUp className="w-4 h-4 inline mr-1" />
                    +25% job growth
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Career List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((career, index) => {
          const IconComponent = iconMap[career.title] || Code;
          return (
            <motion.div
              key={career.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow group cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="p-3 rounded-xl bg-secondary">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <ProgressRing value={career.match} size={56} strokeWidth={4}>
                      <span className="text-sm font-bold text-foreground">{career.match}%</span>
                    </ProgressRing>
                  </div>
                  <CardTitle className="text-lg mt-3">{career.title}</CardTitle>
                  <Badge variant="outline" className="w-fit">{career.category}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Why this fits you
                    </p>
                    {career.reasons.map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Salary Range</span>
                      <span className="font-medium text-foreground">{career.salary}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">Job Growth</span>
                      <span className="font-medium text-success">{career.growth}</span>
                    </div>
                  </div>
                  <Button variant="ghost" className="w-full group-hover:bg-secondary transition-colors">
                    Explore Path
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="bg-secondary/30 border-secondary">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  How are these recommendations calculated?
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Our AI analyzes your academic performance, skills extracted from your resume,
                  aptitude assessments, and learning patterns to match you with careers where
                  you're most likely to succeed.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CareerRecommendations;
