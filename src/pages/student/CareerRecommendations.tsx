import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  TrendingUp,
  CheckCircle2,
  Info,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Filter, MapPin } from "lucide-react";
import * as React from "react";

// TypeScript interfaces for career recommendations
interface CareerRecommendation {
  id: number;
  title: string;
  match: number;
  category: string;
  salary: string;
  growth: string;
  reasons: string[];
  skills: string[];
  description?: string;
  experience_level?: string;
  location_type?: string;
  work_type?: string;
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
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
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [topRecommendation, setTopRecommendation] = useState<CareerRecommendation | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("match");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      const user = JSON.parse(rawUser);

      try {
        // Try with Authorization header first
        let response = await fetch('http://localhost:5000/api/user/recommendations', {
          headers: {
            "Authorization": `Bearer ${user.token || user.id}`,
            "Content-Type": "application/json"
          },
        });

        // If that fails, try with custom headers
        if (!response.ok && response.status === 401) {
          response = await fetch('http://localhost:5000/api/user/recommendations', {
            headers: {
              "X-USER-ID": String(user.id),
              "X-USER-ROLE": user.role || 'student',
            },
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setError(errorData.error || `Failed to fetch recommendations (${response.status})`);
          return;
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

  // Filter and sort recommendations
  const filteredRecommendations = recommendations
    .filter(rec => {
      const matchesSearch = rec.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rec.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || rec.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'match') return b.match - a.match;
      if (sortBy === 'salary') return parseInt(b.salary) - parseInt(a.salary);
      if (sortBy === 'growth') return parseInt(b.growth) - parseInt(a.growth);
      return 0;
    });

  const categories = ['all', ...Array.from(new Set(recommendations.map(rec => rec.category)))];

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

      {/* Search and Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search careers, skills..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Best Match</SelectItem>
                <SelectItem value="salary">Highest Salary</SelectItem>
                <SelectItem value="growth">Fastest Growth</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Filters
            </Button>
          </div>
        </div>
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
        {filteredRecommendations.map((career, index) => {
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="w-fit">{career.category}</Badge>
                    {career.experience_level && (
                      <Badge variant="secondary" className="text-xs">
                        {career.experience_level}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {career.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {career.description}
                    </p>
                  )}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Why this fits you
                    </p>
                    {career.reasons.slice(0, 2).map((reason, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        {reason}
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Salary:</span>
                        <span className="font-medium text-success">{career.salary}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-primary" />
                        <span className="font-medium text-primary">{career.growth}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {career.location_type || 'Remote/Hybrid'}
                    </span>
                    {career.work_type && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{career.work_type}</span>
                      </>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Key Skills Required
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {career.skills.slice(0, 4).map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {career.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{career.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    View Career Path
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredRecommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">No careers found</h3>
            <p>Try adjusting your search or filters to find more opportunities.</p>
          </div>
        </motion.div>
      )}

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
