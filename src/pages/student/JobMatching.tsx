import { motion } from "framer-motion";
import { 
  Briefcase,
  Building2,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const jobMatches = [
  {
    id: 1,
    company: "TechCorp Solutions",
    role: "Software Developer",
    match: 92,
    salary: "$85,000 - $110,000",
    deadline: "5 days left",
    requiredSkills: [
      { name: "JavaScript", has: true },
      { name: "React", has: true },
      { name: "Node.js", has: true },
      { name: "TypeScript", has: true },
      { name: "GraphQL", has: false },
    ],
    type: "Full-time",
    location: "Remote",
  },
  {
    id: 2,
    company: "DataFlow Analytics",
    role: "Data Engineer",
    match: 87,
    salary: "$90,000 - $120,000",
    deadline: "2 weeks left",
    requiredSkills: [
      { name: "Python", has: true },
      { name: "SQL", has: true },
      { name: "Apache Spark", has: false },
      { name: "AWS", has: false },
      { name: "ETL", has: true },
    ],
    type: "Full-time",
    location: "Hybrid",
  },
  {
    id: 3,
    company: "WebWorks Studio",
    role: "Full Stack Developer",
    match: 85,
    salary: "$80,000 - $100,000",
    deadline: "1 week left",
    requiredSkills: [
      { name: "React", has: true },
      { name: "Node.js", has: true },
      { name: "MongoDB", has: true },
      { name: "Docker", has: false },
      { name: "CI/CD", has: false },
    ],
    type: "Full-time",
    location: "On-site",
  },
  {
    id: 4,
    company: "StartupHub",
    role: "Frontend Engineer",
    match: 90,
    salary: "$75,000 - $95,000",
    deadline: "3 days left",
    requiredSkills: [
      { name: "React", has: true },
      { name: "TypeScript", has: true },
      { name: "CSS/Tailwind", has: true },
      { name: "Testing", has: true },
      { name: "Next.js", has: false },
    ],
    type: "Full-time",
    location: "Remote",
  },
];

const JobMatching = () => {
  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Company & Role Matching
        </h1>
        <p className="text-muted-foreground mt-1">
          Jobs matched to your skills with detailed skill gap analysis
        </p>
      </motion.div>

      {/* Job Cards */}
      <div className="space-y-6">
        {jobMatches.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Company Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold font-display text-foreground">
                          {job.role}
                        </h3>
                        {job.match >= 90 && (
                          <Star className="w-5 h-5 text-warning fill-warning" />
                        )}
                      </div>
                      <p className="text-muted-foreground">{job.company}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">{job.type}</Badge>
                        <Badge variant="outline">{job.location}</Badge>
                        <Badge variant="secondary">{job.salary}</Badge>
                      </div>
                    </div>
                  </div>

                  {/* Match Score */}
                  <div className="lg:w-48 flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-primary/5 to-accent/5">
                    <div className="text-4xl font-bold font-display text-primary">
                      {job.match}%
                    </div>
                    <p className="text-sm text-muted-foreground">Match Score</p>
                    <Progress value={job.match} className="mt-2 h-2" />
                  </div>
                </div>

                {/* Skills Analysis */}
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-foreground">Required Skills</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {job.deadline}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {job.requiredSkills.map((skill) => (
                      <div
                        key={skill.name}
                        className={`
                          flex items-center gap-2 px-3 py-2 rounded-lg border
                          ${skill.has 
                            ? 'bg-success/10 border-success/20 text-success' 
                            : 'bg-destructive/10 border-destructive/20 text-destructive'}
                        `}
                      >
                        {skill.has ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                        <span className={`text-sm font-medium ${skill.has ? 'text-foreground' : ''}`}>
                          {skill.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button variant="hero" size="sm">
                    Apply Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button variant="outline" size="sm">
                    View Full Details
                  </Button>
                  <Button variant="ghost" size="sm">
                    Learn Missing Skills
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default JobMatching;
