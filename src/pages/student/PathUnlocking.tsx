import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";



const PathUnlocking = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUnlock, setNextUnlock] = useState(null);
  const [skillsToLearn, setSkillsToLearn] = useState(0);

  useEffect(() => {
    const fetchPathUnlocking = async () => {
      try {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) {
          throw new Error('User not logged in');
        }

        const user = JSON.parse(rawUser);

        const response = await fetch('http://localhost:5000/api/user/path-unlocking', {
          headers: {
            "X-USER-ID": String(user.id),
            "X-USER-ROLE": user.role,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch path unlocking data');
        }

        const data = await response.json();
        setCareerPaths(data.career_paths || []);
        setUnlockedCount(data.unlocked_count || 0);
        setTotalCount(data.total_count || 0);
        setNextUnlock(data.next_unlock);
        setSkillsToLearn(data.skills_to_learn || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPathUnlocking();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 pt-12 lg:pt-0">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold font-display text-foreground">
            Path Unlocking
          </h1>
          <p className="text-muted-foreground mt-1">
            Improve skills to unlock new career paths
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
            Path Unlocking
          </h1>
          <p className="text-muted-foreground mt-1">
            Improve skills to unlock new career paths
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
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            Path Unlocking
          </h1>
          <p className="text-muted-foreground mt-1">
            Improve skills to unlock new career paths
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary">
          <Unlock className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">
            {unlockedCount} of {totalCount} paths unlocked
          </span>
        </div>
      </motion.div>

      {/* Motivation Card */}
      {nextUnlock && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    You're close to unlocking {nextUnlock}!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Improve your skills to expand your career options.
                  </p>
                </div>
                <Button variant="hero" size="sm">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Career Paths Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careerPaths.map((path, index) => (
          <motion.div
            key={path.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className={`h-full transition-all ${path.unlocked ? 'border-success/30 bg-success/5' : 'border-border'}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  {path.unlocked ? (
                    <div className="p-2 rounded-full bg-success/10">
                      <Unlock className="w-5 h-5 text-success" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-muted">
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium text-foreground">{path.progress}%</span>
                  </div>
                  <Progress
                    value={path.progress}
                    className={`h-2 ${path.unlocked ? '[&>div]:bg-success' : ''}`}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Required Skills
                </p>
                <div className="space-y-2">
                  {path.skills.map((skill) => (
                    <div
                      key={skill.name}
                      className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                        skill.acquired
                          ? 'bg-success/10 text-success'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {skill.acquired ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 flex-shrink-0" />
                      )}
                      <span className={skill.acquired ? 'text-foreground' : ''}>
                        {skill.name}
                      </span>
                      {!skill.acquired && (
                        <Badge variant="outline" className="ml-auto text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                {!path.unlocked && (
                  <Button variant="outline" className="w-full mt-4">
                    View Learning Path
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                )}
                {path.unlocked && (
                  <div className="flex items-center justify-center gap-2 mt-4 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" />
                    Career Path Unlocked
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card>
          <CardContent className="py-6">
            <div className="grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold font-display text-success">{unlockedCount}</p>
                <p className="text-sm text-muted-foreground">Unlocked Paths</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-warning">{totalCount - unlockedCount}</p>
                <p className="text-sm text-muted-foreground">Locked Paths</p>
              </div>
              <div>
                <p className="text-3xl font-bold font-display text-primary">{skillsToLearn}</p>
                <p className="text-sm text-muted-foreground">Skills to Learn</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PathUnlocking;
