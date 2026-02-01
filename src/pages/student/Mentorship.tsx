import { motion } from "framer-motion";
import { 
  Users,
  GraduationCap,
  Briefcase,
  MessageCircle,
  ExternalLink,
  Star
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mentors = [
  {
    id: 1,
    name: "Dr. Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    type: "Industry Professional",
    expertise: ["System Design", "Career Guidance", "Interview Prep"],
    matchReason: "Shared background in algorithms and data structures",
    rating: 4.9,
    sessions: 120,
  },
  {
    id: 2,
    name: "Michael Roberts",
    role: "Engineering Manager",
    company: "Microsoft",
    type: "Industry Professional",
    expertise: ["Leadership", "Full Stack Development", "Career Growth"],
    matchReason: "Similar career trajectory from CS graduate to tech lead",
    rating: 4.8,
    sessions: 85,
  },
  {
    id: 3,
    name: "Alex Kumar",
    role: "4th Year CS Student",
    company: "Your University",
    type: "Senior Student",
    expertise: ["Placement Prep", "Project Guidance", "Campus Resources"],
    matchReason: "Recently placed at top tech company, same department",
    rating: 4.7,
    sessions: 45,
  },
  {
    id: 4,
    name: "Emily Zhang",
    role: "Data Scientist",
    company: "Netflix",
    type: "Industry Professional",
    expertise: ["Machine Learning", "Data Engineering", "Python"],
    matchReason: "Can help bridge your ML skill gap",
    rating: 4.9,
    sessions: 92,
  },
  {
    id: 5,
    name: "David Park",
    role: "Recent Graduate",
    company: "Amazon",
    type: "Alumni",
    expertise: ["Interview Experience", "Resume Review", "Negotiation"],
    matchReason: "Graduated from your program last year",
    rating: 4.6,
    sessions: 38,
  },
];

const Mentorship = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Industry Professional":
        return Briefcase;
      case "Senior Student":
        return GraduationCap;
      case "Alumni":
        return Users;
      default:
        return Users;
    }
  };

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold font-display text-foreground">
          Networking & Mentorship
        </h1>
        <p className="text-muted-foreground mt-1">
          Connect with mentors matched to your career goals
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">3</p>
                  <p className="text-sm text-muted-foreground">Industry Mentors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <GraduationCap className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Senior Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold font-display text-foreground">1</p>
                  <p className="text-sm text-muted-foreground">Alumni Connections</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Mentor Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {mentors.map((mentor, index) => {
          const TypeIcon = getTypeIcon(mentor.type);
          return (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-xl font-bold text-primary">
                        {mentor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{mentor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{mentor.role}</p>
                      <p className="text-sm text-primary">{mentor.company}</p>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <TypeIcon className="w-3 h-3" />
                      {mentor.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Why recommended: </span>
                      {mentor.matchReason}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {mentor.expertise.map((exp) => (
                      <Badge key={exp} variant="outline">
                        {exp}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" />
                        <span className="font-medium text-foreground">{mentor.rating}</span>
                      </div>
                      <span>{mentor.sessions} sessions</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                      <Button variant="hero" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Connect
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Mentorship;
