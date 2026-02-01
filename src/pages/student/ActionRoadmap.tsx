import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Route,
  CheckCircle2,
  Circle,
  Clock,
  Code,
  BookOpen,
  Briefcase,
  Award,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ActionRoadmap = () => {
  const [actionRoadmap, setActionRoadmap] = useState([]);

  useEffect(() => {
    const fetchActionRoadmap = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/student/learning-roadmaps", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            // Transform backend data to match frontend structure
            const transformedData = Object.values(data).flatMap((roadmap: any) => {
              return roadmap.phases.map((phase: any, index: number) => ({
                id: phase.id,
                month: phase.title,
                phase: phase.title,
                progress: phase.status === 'completed' ? 100 : phase.status === 'active' ? 50 : 0,
                tasks: phase.milestones.map((milestone: any) => ({
                  title: milestone.title,
                  completed: milestone.completed,
                  type: 'learn' // Default type, could be enhanced based on milestone content
                }))
              }));
            });
            setActionRoadmap(transformedData);
          }
        }
      } catch (error) {
        console.error("Failed to fetch action roadmap:", error);
      }
    };

    fetchActionRoadmap();
  }, []);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "learn":
        return BookOpen;
      case "project":
        return Code;
      case "career":
        return Briefcase;
      default:
        return Circle;
    }
  };

  const totalTasks = actionRoadmap.flatMap(m => m.tasks).length;
  const completedTasks = actionRoadmap.flatMap(m => m.tasks).filter(t => t.completed).length;
  const overallProgress = Math.round((completedTasks / totalTasks) * 100);

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
            Career Action Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personalized step-by-step plan to land your dream job
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10">
          <Award className="w-5 h-5 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">{overallProgress}% Complete</p>
            <p className="text-xs text-muted-foreground">{completedTasks} of {totalTasks} tasks</p>
          </div>
        </div>
      </motion.div>

      {/* Overall Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="py-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Journey to Your First Tech Job
                </h3>
                <p className="text-muted-foreground mb-4">
                  Based on your current skills and target roles, here's your personalized 
                  4-month action plan to become job-ready.
                </p>
                <div className="flex items-center gap-4">
                  <Progress value={overallProgress} className="flex-1 h-3" />
                  <span className="text-lg font-bold text-primary">{overallProgress}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Target: April 2026
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline */}
      <div className="space-y-6">
        {actionRoadmap.map((month, index) => (
          <motion.div
            key={month.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="relative"
          >
            {/* Timeline connector */}
            {index < actionRoadmap.length - 1 && (
              <div className="absolute left-8 top-24 w-0.5 h-full bg-border" />
            )}

            <Card className={month.progress > 0 ? "border-primary/20" : ""}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-4">
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center
                    ${month.progress === 100 ? 'bg-success text-success-foreground' :
                      month.progress > 0 ? 'gradient-primary text-primary-foreground' :
                      'bg-muted text-muted-foreground'}
                  `}>
                    {month.progress === 100 ? (
                      <CheckCircle2 className="w-8 h-8" />
                    ) : (
                      <Route className="w-8 h-8" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{month.month}</CardTitle>
                      {month.progress > 0 && month.progress < 100 && (
                        <Badge className="gradient-primary border-0">In Progress</Badge>
                      )}
                      {month.progress === 100 && (
                        <Badge variant="outline" className="border-success text-success">
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground">{month.phase}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold font-display text-foreground">
                      {month.progress}%
                    </p>
                    <p className="text-xs text-muted-foreground">Progress</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-3">
                  {month.tasks.map((task, taskIndex) => {
                    const TypeIcon = getTypeIcon(task.type);
                    return (
                      <div
                        key={taskIndex}
                        className={`
                          flex items-center gap-3 p-3 rounded-lg border
                          ${task.completed 
                            ? 'bg-success/10 border-success/20' 
                            : 'bg-card border-border hover:border-primary/30'}
                          transition-colors cursor-pointer
                        `}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={`text-sm flex-1 ${task.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                          {task.title}
                        </span>
                        <TypeIcon className="w-4 h-4 text-muted-foreground" />
                      </div>
                    );
                  })}
                </div>
                {month.progress > 0 && month.progress < 100 && (
                  <Button variant="outline" className="mt-4">
                    Continue This Phase
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-6 justify-center">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Learning</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4 text-success" />
                <span className="text-muted-foreground">Projects</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">Career Actions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ActionRoadmap;
