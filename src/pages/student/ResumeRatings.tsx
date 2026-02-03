import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Building2,
  Star,
  AlertTriangle,
  TrendingUp,
  FileText,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ResumeRatings = () => {
  const [resumeRatings, setResumeRatings] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    strongMatches: 0,
    goodMatches: 0,
    needsImprovement: 0
  });

  useEffect(() => {
    const fetchResumeRatings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await fetch("http://localhost:5000/api/student/resume-ratings", {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (response.ok) {
            const data = await response.json();
            setResumeRatings(data.ratings || []);
            setSummaryStats(data.summary || { strongMatches: 0, goodMatches: 0, needsImprovement: 0 });
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume ratings:", error);
      }
    };

    fetchResumeRatings();
  }, []);

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Resume Rating by Company
        </h1>
        <p className="text-muted-foreground mt-1">
          See how your resume matches specific companies and roles
        </p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-success/20 bg-success/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Strong Matches</p>
                  <p className="text-3xl font-bold font-display text-success">2</p>
                </div>
                <Star className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Good Matches</p>
                  <p className="text-3xl font-bold font-display text-primary">2</p>
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-warning/20 bg-warning/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Needs Improvement</p>
                  <p className="text-3xl font-bold font-display text-warning">2</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Ratings Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Company & Role Ratings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Missing Skills</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumeRatings.map((rating, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">{rating.company}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{rating.role}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 min-w-32">
                        <Progress 
                          value={rating.score} 
                          className={`h-2 flex-1 ${
                            rating.score >= 80 ? '[&>div]:bg-success' :
                            rating.score >= 60 ? '[&>div]:bg-primary' :
                            '[&>div]:bg-warning'
                          }`}
                        />
                        <span className="font-bold text-foreground">{rating.score}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {rating.missingSkills.slice(0, 2).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {rating.missingSkills.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{rating.missingSkills.length - 2}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        rating.status === "Strong Match" ? "default" :
                        rating.status === "Good Match" ? "secondary" :
                        "outline"
                      }>
                        {rating.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View Details
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Match Detail */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-success/20 bg-gradient-to-br from-success/5 to-primary/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-success" />
                Best Match: Meta - Frontend Engineer
              </CardTitle>
              <Badge className="gradient-primary border-0">88% Match</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Your strong React and JavaScript skills make you an excellent candidate for 
              Meta's Frontend Engineer position. Consider learning React Native to complete 
              your skill set.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="hero" size="sm">
                Optimize Resume for This Role
              </Button>
              <Button variant="outline" size="sm">
                View Job Description
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResumeRatings;
