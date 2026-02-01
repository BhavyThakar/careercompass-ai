import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Map,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Code,
  Briefcase,
  Award,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const strengthRoadmap = [
  {
    id: 1,
    phase: "Current",
    title: "Master Core Skills",
    duration: "Ongoing",
    status: "active",
    milestones: [
      { title: "Advanced Data Structures", completed: true, icon: Code },
      { title: "System Design Fundamentals", completed: true, icon: BookOpen },
      { title: "Algorithm Optimization", completed: false, icon: Code },
    ],
  },
  {
    id: 2,
    phase: "Month 1-2",
    title: "Build Portfolio Projects",
    duration: "8 weeks",
    status: "upcoming",
    milestones: [
      { title: "Full-Stack Web Application", completed: false, icon: Code },
      { title: "Open Source Contribution", completed: false, icon: Briefcase },
      { title: "Technical Blog Posts", completed: false, icon: BookOpen },
    ],
  },
  {
    id: 3,
    phase: "Month 3-4",
    title: "Industry Preparation",
    duration: "8 weeks",
    status: "upcoming",
    milestones: [
      { title: "Interview Preparation", completed: false, icon: Briefcase },
      { title: "Networking Events", completed: false, icon: Briefcase },
      { title: "Mock Interviews", completed: false, icon: Award },
    ],
  },
  {
    id: 4,
    phase: "Month 5+",
    title: "Career Launch",
    duration: "Ongoing",
    status: "future",
    milestones: [
      { title: "Apply to Target Companies", completed: false, icon: Briefcase },
      { title: "Negotiate Offers", completed: false, icon: Award },
      { title: "Start New Role", completed: false, icon: Award },
    ],
  },
];

const improvementRoadmap = [
  {
    id: 1,
    phase: "Week 1-4",
    title: "Foundation Building",
    duration: "4 weeks",
    status: "active",
    milestones: [
      { title: "Machine Learning Basics", completed: false, icon: BookOpen },
      { title: "Python for ML Libraries", completed: false, icon: Code },
      { title: "Statistics Refresher", completed: false, icon: BookOpen },
    ],
  },
  {
    id: 2,
    phase: "Week 5-8",
    title: "Hands-On Practice",
    duration: "4 weeks",
    status: "upcoming",
    milestones: [
      { title: "Kaggle Competitions", completed: false, icon: Code },
      { title: "Mini ML Projects", completed: false, icon: Briefcase },
      { title: "Model Evaluation", completed: false, icon: BookOpen },
    ],
  },
  {
    id: 3,
    phase: "Week 9-12",
    title: "Advanced Topics",
    duration: "4 weeks",
    status: "upcoming",
    milestones: [
      { title: "Deep Learning Intro", completed: false, icon: Code },
      { title: "Neural Networks", completed: false, icon: BookOpen },
      { title: "End-to-End Project", completed: false, icon: Briefcase },
    ],
  },
  {
    id: 4,
    phase: "Week 13+",
    title: "Specialization",
    duration: "Ongoing",
    status: "future",
    milestones: [
      { title: "Choose ML Specialty", completed: false, icon: Award },
      { title: "Advanced Certifications", completed: false, icon: Award },
      { title: "Industry Projects", completed: false, icon: Briefcase },
    ],
  },
];

const LearningRoadmaps = () => {
  const [activeTab, setActiveTab] = useState("strength");

  const RoadmapTimeline = ({ roadmap }: { roadmap: typeof strengthRoadmap }) => (
    <div className="space-y-6">
      {roadmap.map((phase, index) => (
        <motion.div
          key={phase.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Timeline connector */}
          {index < roadmap.length - 1 && (
            <div className="absolute left-6 top-16 w-0.5 h-full bg-border" />
          )}
          
          <Card className={`
            ${phase.status === 'active' ? 'border-primary/30 bg-primary/5' : ''}
            ${phase.status === 'future' ? 'opacity-60' : ''}
          `}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  ${phase.status === 'active' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}
                `}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={phase.status === 'active' ? 'default' : 'outline'}>
                      {phase.phase}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {phase.duration}
                    </div>
                  </div>
                  <CardTitle className="text-lg mt-1">{phase.title}</CardTitle>
                </div>
                {phase.status === 'active' && (
                  <Badge className="gradient-primary border-0">In Progress</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-3">
                {phase.milestones.map((milestone, mIndex) => (
                  <div
                    key={mIndex}
                    className={`
                      p-3 rounded-lg border flex items-center gap-3
                      ${milestone.completed ? 'bg-success/10 border-success/20' : 'bg-card border-border'}
                    `}
                  >
                    {milestone.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground">{milestone.title}</span>
                  </div>
                ))}
              </div>
              {phase.status === 'active' && (
                <Button className="mt-4 w-full sm:w-auto" variant="outline">
                  Continue Learning
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Personalized Learning Roadmaps
        </h1>
        <p className="text-muted-foreground mt-1">
          Step-by-step paths to achieve your career goals
        </p>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="strength" className="flex items-center gap-2">
            <Award className="w-4 h-4" />
            Strength-Based
          </TabsTrigger>
          <TabsTrigger value="improvement" className="flex items-center gap-2">
            <Map className="w-4 h-4" />
            Improvement-Based
          </TabsTrigger>
        </TabsList>

        <TabsContent value="strength" className="space-y-6">
          <Card className="bg-gradient-to-r from-success/10 to-primary/10 border-success/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-success" />
                <div>
                  <p className="font-medium text-foreground">
                    Leverage Your Strengths
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This roadmap builds on your existing skills in programming and problem-solving 
                    to fast-track your path to becoming a Software Developer.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <RoadmapTimeline roadmap={strengthRoadmap} />
        </TabsContent>

        <TabsContent value="improvement" className="space-y-6">
          <Card className="bg-gradient-to-r from-warning/10 to-accent/10 border-warning/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Map className="w-6 h-6 text-warning" />
                <div>
                  <p className="font-medium text-foreground">
                    Close Your Learning Gaps
                  </p>
                  <p className="text-sm text-muted-foreground">
                    This roadmap focuses on developing your Machine Learning skills 
                    to unlock AI/ML career paths that complement your programming background.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <RoadmapTimeline roadmap={improvementRoadmap} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningRoadmaps;
