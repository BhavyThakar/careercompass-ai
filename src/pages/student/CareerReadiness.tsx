import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Gauge,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Briefcase,
  Award
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ProgressRing } from "@/components/ui/progress-ring";



const CareerReadiness = () => {
  const [careerData, setCareerData] = useState({
    readyScore: 72,
    technicalReady: 85,
    softSkills: 68,
    industryReady: 55,
    skillCategories: [
      {
        name: "Technical Skills",
        coverage: 82,
        skills: [
          { name: "Programming", level: 90 },
          { name: "Databases", level: 85 },
          { name: "System Design", level: 70 },
          { name: "DevOps", level: 65 },
        ],
      },
      {
        name: "Soft Skills",
        coverage: 68,
        skills: [
          { name: "Communication", level: 65 },
          { name: "Teamwork", level: 75 },
          { name: "Leadership", level: 55 },
          { name: "Problem Solving", level: 88 },
        ],
      },
      {
        name: "Industry Knowledge",
        coverage: 55,
        skills: [
          { name: "Business Acumen", level: 45 },
          { name: "Industry Trends", level: 60 },
          { name: "Professional Networks", level: 40 },
          { name: "Work Experience", level: 70 },
        ],
      },
    ],
  });

  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/student/career-readiness", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            // Transform backend data to match frontend structure
            setCareerData({
              readyScore: data.overall_readiness_score,
              technicalReady: data.skills_readiness,
              softSkills: data.network_readiness,
              industryReady: data.mindset_readiness,
              skillCategories: [
                {
                  name: "Technical Skills",
                  coverage: data.skills_readiness,
                  skills: [
                    { name: "Programming", level: data.skills_readiness },
                    { name: "Databases", level: data.skills_readiness - 5 },
                    { name: "System Design", level: data.skills_readiness - 10 },
                    { name: "DevOps", level: data.skills_readiness - 15 },
                  ],
                },
                {
                  name: "Soft Skills",
                  coverage: data.network_readiness,
                  skills: [
                    { name: "Communication", level: data.network_readiness },
                    { name: "Teamwork", level: data.network_readiness + 5 },
                    { name: "Leadership", level: data.network_readiness - 10 },
                    { name: "Problem Solving", level: data.network_readiness + 10 },
                  ],
                },
                {
                  name: "Industry Knowledge",
                  coverage: data.mindset_readiness,
                  skills: [
                    { name: "Business Acumen", level: data.mindset_readiness - 10 },
                    { name: "Industry Trends", level: data.mindset_readiness },
                    { name: "Professional Networks", level: data.mindset_readiness - 15 },
                    { name: "Work Experience", level: data.mindset_readiness + 5 },
                  ],
                },
              ],
            });
          }
        }
      } catch (error) {
        console.error("Failed to fetch career data:", error);
      }
    };

    fetchCareerData();
  }, []);

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Career Readiness Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Your job readiness score based on verified data
        </p>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ProgressRing value={careerData.readyScore} size={180}>
                <div className="text-center">
                  <span className="text-5xl font-bold font-display text-foreground">{careerData.readyScore}</span>
                  <p className="text-sm text-muted-foreground">Ready Score</p>
                </div>
              </ProgressRing>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-4">
                  <Badge className="gradient-primary border-0">Good Progress</Badge>
                  <Badge variant="outline">Entry Level Ready</Badge>
                </div>
                <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                  You're Almost Job-Ready!
                </h2>
                <p className="text-muted-foreground mb-4">
                  Based on your academic performance, skills, and resume analysis, you're well-prepared 
                  for entry-level software development positions. Focus on improving soft skills and 
                  gaining industry exposure to boost your score.
                </p>
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{careerData.technicalReady}%</p>
                    <p className="text-xs text-muted-foreground">Technical Ready</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-warning">{careerData.softSkills}%</p>
                    <p className="text-xs text-muted-foreground">Soft Skills</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{careerData.industryReady}%</p>
                    <p className="text-xs text-muted-foreground">Industry Ready</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skill Coverage */}
      <div className="grid lg:grid-cols-3 gap-6">
        {careerData.skillCategories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{category.name}</CardTitle>
                  <Badge variant={category.coverage >= 75 ? "default" : "secondary"}>
                    {category.coverage}%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.skills.map((skill) => (
                  <div key={skill.name} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{skill.name}</span>
                      <span className="text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Readiness Checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Readiness Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Technical Skills", status: "complete", icon: CheckCircle2 },
                { title: "Resume Updated", status: "complete", icon: CheckCircle2 },
                { title: "Portfolio Projects", status: "complete", icon: CheckCircle2 },
                { title: "Interview Prep", status: "pending", icon: AlertCircle },
                { title: "LinkedIn Profile", status: "pending", icon: AlertCircle },
                { title: "Mock Interviews", status: "pending", icon: AlertCircle },
                { title: "Industry Connections", status: "pending", icon: AlertCircle },
                { title: "Certifications", status: "optional", icon: Award },
              ].map((item) => (
                <div
                  key={item.title}
                  className={`
                    p-4 rounded-lg border flex items-center gap-3
                    ${item.status === 'complete' ? 'bg-success/10 border-success/20' : 
                      item.status === 'pending' ? 'bg-warning/10 border-warning/20' : 
                      'bg-muted border-border'}
                  `}
                >
                  <item.icon className={`w-5 h-5 ${
                    item.status === 'complete' ? 'text-success' :
                    item.status === 'pending' ? 'text-warning' :
                    'text-muted-foreground'
                  }`} />
                  <span className="text-sm font-medium text-foreground">{item.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CareerReadiness;
