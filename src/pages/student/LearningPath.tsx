import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Target,
  CheckCircle2,
  Circle,
  Clock,
  Award,
  Play,
  Download,
  RefreshCw,
  Unlock,
  BookOpen,
  FileText,
  BarChart3,
  CheckSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

interface LocationState {
  careerPath: CareerPath;
  requiredSkills: Skill[];
  progress: number;
}

const LearningPath = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showNotes, setShowNotes] = useState(false);
  const [timeSpent] = useState(0);
  const [showProgress, setShowProgress] = useState(true);

  if (!state) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Learning Path Not Found</h2>
          <Button onClick={() => navigate('/path-unlocking')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Path Unlocking
          </Button>
        </div>
      </div>
    );
  }

  const { careerPath, requiredSkills } = state;

  const handleStepComplete = (stepIndex: number) => {
    setCompletedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepIndex)) {
        newSet.delete(stepIndex);
      } else {
        newSet.add(stepIndex);
      }
      return newSet;
    });
  };

  const learningSteps = [
    {
      title: "Introduction to " + careerPath.title,
      description: "Get started with the basics of this career path",
      duration: "2 hours",
      type: "video"
    },
    {
      title: "Core Skills Development",
      description: "Master the essential skills required for this career",
      duration: "4 hours",
      type: "interactive"
    },
    {
      title: "Practical Projects",
      description: "Apply your knowledge through hands-on projects",
      duration: "6 hours",
      type: "project"
    },
    {
      title: "Advanced Topics",
      description: "Explore advanced concepts and specialized areas",
      duration: "3 hours",
      type: "reading"
    },
    {
      title: "Career Preparation",
      description: "Prepare for job applications and interviews",
      duration: "2 hours",
      type: "workshop"
    }
  ];

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 rounded-2xl p-8 mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate('/path-unlocking')}
              className="bg-background/80 hover:bg-background"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Paths
            </Button>
            <div className="p-3 rounded-xl bg-background/80">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold font-display text-foreground">
                Learning Path: {careerPath.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                Master the skills needed to unlock this career path
              </p>
              <div className="flex items-center gap-4 mt-3">
                <Badge variant="secondary" className="text-sm">
                  <Target className="w-3 h-3 mr-1" />
                  {careerPath.unlocked ? 'Unlocked' : 'Locked'}
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {careerPath.progress}% Complete
                </Badge>
                <Badge variant="outline" className="text-sm">
                  {requiredSkills.length} Skills Required
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowProgress(!showProgress)}
              className="bg-background/80 hover:bg-background"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showProgress ? 'Hide' : 'Show'} Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
              className="bg-background/80 hover:bg-background"
            >
              <FileText className="w-4 h-4 mr-2" />
              {showNotes ? 'Hide' : 'Show'} Notes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Export learning path
              }}
              className="bg-background/80 hover:bg-background"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Progress Overview */}
      {showProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Your Progress
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {completedSteps.size} of {learningSteps.length} completed
                  </span>
                  <Badge variant="secondary">
                    {Math.round((completedSteps.size / learningSteps.length) * 100)}%
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="font-medium">{Math.round((completedSteps.size / learningSteps.length) * 100)}%</span>
                  </div>
                  <Progress
                    value={(completedSteps.size / learningSteps.length) * 100}
                    className="h-3"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-primary">
                      {completedSteps.size}
                    </div>
                    <p className="text-sm text-muted-foreground">Completed Steps</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-warning">
                      {learningSteps.length - completedSteps.size}
                    </div>
                    <p className="text-sm text-muted-foreground">Remaining Steps</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-background/50">
                    <div className="text-2xl font-bold text-success">
                      {timeSpent}h
                    </div>
                    <p className="text-sm text-muted-foreground">Time Spent</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Enhanced Required Skills */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-warning" />
                Required Skills to Complete
              </div>
              <Badge variant="outline" className="text-sm">
                {requiredSkills.filter(skill => skill.acquired).length}/{requiredSkills.length} Completed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Skills Overview</span>
                  <span className="text-sm text-muted-foreground">
                    {requiredSkills.filter(skill => skill.acquired).length} of {requiredSkills.length} completed
                  </span>
                </div>
                <Progress
                  value={(requiredSkills.filter(skill => skill.acquired).length / requiredSkills.length) * 100}
                  className="h-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {requiredSkills.map((skill) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + requiredSkills.indexOf(skill) * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => {
                      // Handle skill click for more details
                    }}
                  >
                    <div
                      className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                        skill.acquired
                          ? 'border-success/30 bg-success/5 hover:border-success/50'
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {skill.acquired ? (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{skill.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {skill.acquired ? 'Completed' : 'In Progress'}
                        </div>
                        {!skill.acquired && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Start learning this skill
                              }}
                            >
                              <Play className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                        {skill.acquired && (
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Review skill
                              }}
                            >
                              <CheckSquare className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold">Learning Modules</h2>
        {learningSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className={`transition-all cursor-pointer ${
              completedSteps.has(index)
                ? 'border-success/30 bg-success/5'
                : 'border-border hover:border-primary/30'
            }`}
            onClick={() => handleStepComplete(index)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${
                    completedSteps.has(index)
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {completedSteps.has(index) ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {step.description}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        {step.duration}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {step.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant={completedSteps.has(index) ? "secondary" : "default"}
                  size="sm"
                >
                  {completedSteps.has(index) ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Start
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        ))}
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4"
      >
        <Button
          variant="outline"
          onClick={() => {
            // Export learning path
          }}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Path
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            // Reset progress
            setCompletedSteps(new Set());
          }}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Reset Progress
        </Button>
        {completedSteps.size === learningSteps.length && (
          <Button
            variant="default"
            onClick={() => {
              // Mark career path as unlocked
              navigate('/path-unlocking');
            }}
          >
            <Unlock className="w-4 h-4 mr-2" />
            Complete Path
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default LearningPath;
