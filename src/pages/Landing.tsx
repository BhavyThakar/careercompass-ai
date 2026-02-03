import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Shield, 
  Brain, 
  Target, 
  Briefcase, 
  TrendingUp,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze verified academic data to identify strengths and learning gaps",
    },
    {
      icon: Target,
      title: "Career Matching",
      description: "Get personalized career recommendations based on your skills and aptitude",
    },
    {
      icon: Briefcase,
      title: "Job Opportunities",
      description: "Connect with real internships and job opportunities matched to your profile",
    },
    {
      icon: TrendingUp,
      title: "Growth Roadmaps",
      description: "Personalized learning paths to unlock new career possibilities",
    },
  ];

  const trustIndicators = [
    "Verified Academic Data",
    "Resume Analysis",
    "Aptitude Assessments",
    "Behavioral Insights",
  ];

  return (
    <div className="min-h-screen gradient-hero overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-float" style={{ animationDelay: "4s" }} />
      </div>

      {/* Header */}
      <header className="relative z-10">
        <nav className="container mx-auto px-6 py-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                Student<span className="text-gradient">IQ</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => navigate("/student")}>
                Student Portal
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
                Admin Access
              </Button>
            </div>
          </motion.div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-12 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 backdrop-blur-sm border border-primary/10 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-secondary-foreground">
              AI-Powered Career Guidance System
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Understand Yourself.
            <br />
            <span className="text-gradient">Build Your Career.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10"
          >
            An AI-driven system that analyzes verified student data, identifies learning gaps, 
            recommends careers, and connects students with real opportunities.
          </motion.p>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-12"
          >
            {trustIndicators.map((indicator, index) => (
              <div
                key={indicator}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/50"
              >
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span className="text-sm text-muted-foreground">{indicator}</span>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => navigate("/student")}
              className="group w-full sm:w-auto"
            >
              <GraduationCap className="w-5 h-5" />
              Student Login
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="heroOutline" 
              size="xl" 
              onClick={() => navigate("/admin")}
              className="w-full sm:w-auto"
            >
              <Shield className="w-5 h-5" />
              Admin Login
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="group p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-card hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Bottom decorative element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"
        />
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            Student Intelligence & Career Guidance System — Empowering students through AI-driven insights
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
