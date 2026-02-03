import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Unlock,
  TrendingUp,
  CheckCircle2,
  Circle,
  ArrowRight,
  Sparkles,
  Loader2,
  Search,
  Filter,
  Grid,
  List,
  BookOpen,
  X,
  Download,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

// TypeScript interfaces for path unlocking
interface Skill {
  name: string;
  acquired: boolean;
}

interface CareerPath {
  id: number;
  title: string;
  unlocked: boolean;
  progress: number;
  skills: Skill[];
}

interface NextUnlock {
  title: string;
  skills_needed: number;
  current_progress: number;
  estimated_time?: string;
  milestone_rewards?: string[];
}

const PathUnlocking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [nextUnlock, setNextUnlock] = useState<NextUnlock | null>(null);
  const [skillsToLearn, setSkillsToLearn] = useState(0);
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'progress' | 'skills' | 'timeline' | 'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPathUnlocking = async () => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const user = JSON.parse(rawUser);

      try {
        // Try with Authorization header first
        let response = await fetch('http://localhost:5000/api/user/path-unlocking', {
          headers: {
            "Authorization": `Bearer ${user.token || user.id}`,
            "Content-Type": "application/json"
          },
        });

        // If that fails, try with custom headers
        if (!response.ok && response.status === 401) {
          response = await fetch('http://localhost:5000/api/user/path-unlocking', {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role || 'student',
            },
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch path unlocking data (${response.status})`);
          return;
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
      {/* Enhanced Header with Controls */}
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
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary">
            <Unlock className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">
              {unlockedCount} of {totalCount} paths unlocked
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Search and Filters */}
      {(showFilters || searchTerm) && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search career paths..."
                      value={searchTerm}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({totalCount})
                  </Button>
                  <Button
                    variant={filterStatus === 'unlocked' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('unlocked')}
                  >
                    Unlocked ({unlockedCount})
                  </Button>
                  <Button
                    variant={filterStatus === 'locked' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus('locked')}
                  >
                    Locked ({totalCount - unlockedCount})
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-accent/20 bg-accent/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" />
              Your Progress Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {Math.round((unlockedCount / totalCount) * 100)}%
                </div>
                <p className="text-sm text-muted-foreground">Paths Unlocked</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  {unlockedCount}
                </div>
                <p className="text-sm text-muted-foreground">Paths Unlocked</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">
                  {totalCount - unlockedCount}
                </div>
                <p className="text-sm text-muted-foreground">Locked Paths</p>
              </div>
            </div>
            <Progress value={(unlockedCount / totalCount) * 100} className="h-3" />
          </CardContent>
        </Card>
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
                    You're close to unlocking {nextUnlock.title}!
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

      {/* Career Paths Grid/List */}
      <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {careerPaths
          .filter(path => {
            const matchesSearch = path.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filterStatus === 'all' || 
              (filterStatus === 'unlocked' && path.unlocked) ||
              (filterStatus === 'locked' && !path.unlocked);
            return matchesSearch && matchesFilter;
          })
          .map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer"
              onClick={() => {
                setSelectedPath(path);
                setShowDetails(true);
              }}
            >
              <Card className={`h-full transition-all hover:shadow-lg ${
                path.unlocked 
                  ? 'border-success/30 bg-success/5 hover:border-success/50' 
                  : 'border-border hover:border-primary/30'
              }`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{path.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      {path.unlocked ? (
                        <div className="p-2 rounded-full bg-success/10">
                          <Unlock className="w-5 h-5 text-success" />
                        </div>
                      ) : (
                        <div className="p-2 rounded-full bg-muted">
                          <Lock className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPath(path);
                          setShowDetails(true);
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
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
                    {path.skills.slice(0, viewMode === 'list' ? 10 : 4).map((skill) => (
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
                    {path.skills.length > (viewMode === 'list' ? 10 : 4) && (
                      <div className="text-xs text-muted-foreground text-center pt-2">
                        +{path.skills.length - (viewMode === 'list' ? 10 : 4)} more skills
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-4">
                    {!path.unlocked && (
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to learning path with the selected career path data
                          navigate(`/learning-path/${path.id}`, {
                            state: {
                              careerPath: path,
                              requiredSkills: path.skills.filter(skill => !skill.acquired),
                              progress: path.progress
                            }
                          });
                        }}
                      >
                        View Learning Path
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                    {path.unlocked && (
                      <Button 
                        variant="default" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to career details with the selected career path data
                          navigate(`/career-details/${path.id}`, {
                            state: {
                              careerPath: path,
                              allSkills: path.skills,
                              isUnlocked: true
                            }
                          });
                        }}
                      >
                        Explore Career
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
      </div>

      {/* Career Details Modal */}
      {showDetails && selectedPath && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-background rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    selectedPath.unlocked 
                      ? 'bg-success/10 text-success' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {selectedPath.unlocked ? (
                      <Unlock className="w-6 h-6" />
                    ) : (
                      <Lock className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {selectedPath.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {selectedPath.unlocked ? 'Career Path Unlocked' : 'Career Path Locked'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDetails(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Progress Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Overall Progress</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completion</span>
                      <span className="font-medium">{selectedPath.progress}%</span>
                    </div>
                    <Progress value={selectedPath.progress} className="h-3" />
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPath.skills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`flex items-center gap-3 p-3 rounded-lg border ${
                          skill.acquired
                            ? 'border-success/30 bg-success/5'
                            : 'border-border bg-muted/30'
                        }`}
                      >
                        {skill.acquired ? (
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium">{skill.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {skill.acquired ? 'Skill acquired' : 'Skill required'}
                          </div>
                        </div>
                        {skill.acquired && (
                          <Badge variant="secondary" className="text-xs">
                            Completed
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {!selectedPath.unlocked && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        navigate(`/learning-path/${selectedPath.id}`, {
                          state: {
                            careerPath: selectedPath,
                            requiredSkills: selectedPath.skills.filter(skill => !skill.acquired),
                            progress: selectedPath.progress
                          }
                        });
                      }}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Start Learning Path
                    </Button>
                  )}
                  {selectedPath.unlocked && (
                    <Button
                      variant="default"
                      className="flex-1"
                      onClick={() => {
                        navigate(`/career-details/${selectedPath.id}`, {
                          state: {
                            careerPath: selectedPath,
                            allSkills: selectedPath.skills,
                            isUnlocked: true
                          }
                        });
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Explore Career Opportunities
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      // Download career path details
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

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
