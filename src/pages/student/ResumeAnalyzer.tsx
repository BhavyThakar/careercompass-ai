import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Code,
  Briefcase,
  Award,
  TrendingUp,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrustBadge } from "@/components/ui/trust-badge";
import { ProgressRing } from "@/components/ui/progress-ring";

const extractedSkills = [
  { name: "JavaScript", level: "Advanced", verified: true },
  { name: "Python", level: "Intermediate", verified: true },
  { name: "React", level: "Advanced", verified: true },
  { name: "Node.js", level: "Intermediate", verified: true },
  { name: "SQL", level: "Intermediate", verified: true },
  { name: "Git", level: "Advanced", verified: true },
  { name: "Docker", level: "Beginner", verified: false },
  { name: "AWS", level: "Beginner", verified: false },
];

const projects = [
  {
    title: "E-Commerce Platform",
    tech: ["React", "Node.js", "MongoDB"],
    impact: "High",
    description: "Full-stack web application with payment integration",
  },
  {
    title: "Task Management App",
    tech: ["React", "Firebase"],
    impact: "Medium",
    description: "Real-time collaborative task tracker",
  },
  {
    title: "Weather Dashboard",
    tech: ["JavaScript", "API Integration"],
    impact: "Low",
    description: "Weather data visualization tool",
  },
];

const qualityMetrics = [
  { label: "Content Quality", value: 78, color: "primary" },
  { label: "Keyword Optimization", value: 65, color: "warning" },
  { label: "Format & Structure", value: 85, color: "success" },
  { label: "ATS Compatibility", value: 72, color: "primary" },
];

const ResumeAnalyzer = () => {
  const [isUploaded, setIsUploaded] = useState(true); // Demo: resume already uploaded

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
            Resume Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered resume analysis and improvement suggestions
          </p>
        </div>
        <TrustBadge level="medium" />
      </motion.div>

      {/* Upload Section */}
      {!isUploaded ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-dashed border-2">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Upload Your Resume
                </h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your resume or click to browse
                </p>
                <Button variant="hero">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  Supported formats: PDF, DOCX (Max 5MB)
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Resume Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                  <ProgressRing value={75} size={160}>
                    <div className="text-center">
                      <span className="text-4xl font-bold font-display text-foreground">75</span>
                      <p className="text-sm text-muted-foreground">/100</p>
                    </div>
                  </ProgressRing>
                  <div className="flex-1 text-center lg:text-left">
                    <Badge className="mb-3 gradient-primary border-0">Resume Score</Badge>
                    <h2 className="text-2xl font-bold font-display text-foreground mb-2">
                      Good Resume, Room for Improvement
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Your resume demonstrates solid technical skills and relevant projects. 
                      Focus on quantifying achievements and optimizing for ATS systems.
                    </p>
                    <Button variant="hero" size="sm">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Get AI Suggestions
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quality Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Resume Quality Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.label} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">
                          {metric.label}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {metric.value}%
                        </span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Skills & Projects */}
          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-5 h-5 text-primary" />
                    Extracted Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {extractedSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          {skill.verified ? (
                            <CheckCircle2 className="w-5 h-5 text-success" />
                          ) : (
                            <AlertCircle className="w-5 h-5 text-warning" />
                          )}
                          <span className="font-medium text-foreground">{skill.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            skill.level === "Advanced" ? "default" :
                            skill.level === "Intermediate" ? "secondary" : "outline"
                          }>
                            {skill.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Extracted Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-border bg-card"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-foreground">{project.title}</h4>
                          <Badge variant={
                            project.impact === "High" ? "default" :
                            project.impact === "Medium" ? "secondary" : "outline"
                          }>
                            {project.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {project.tech.map((tech) => (
                            <Badge key={tech} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Improvement Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-accent" />
                  Improvement Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    {
                      title: "Add Quantifiable Achievements",
                      description: "Include metrics like '40% performance improvement' or 'served 10k users'",
                      priority: "High",
                    },
                    {
                      title: "Optimize Keywords",
                      description: "Add more industry-specific keywords for better ATS matching",
                      priority: "High",
                    },
                    {
                      title: "Expand Project Details",
                      description: "Describe your role and specific contributions in each project",
                      priority: "Medium",
                    },
                    {
                      title: "Add Certifications",
                      description: "Include relevant certifications to validate your skills",
                      priority: "Low",
                    },
                  ].map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-foreground">{suggestion.title}</h4>
                        <Badge variant={
                          suggestion.priority === "High" ? "destructive" :
                          suggestion.priority === "Medium" ? "default" : "secondary"
                        }>
                          {suggestion.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default ResumeAnalyzer;
