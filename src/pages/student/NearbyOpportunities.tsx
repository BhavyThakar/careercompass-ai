import { motion } from "framer-motion";
import { 
  MapPin,
  Building2,
  Briefcase,
  Star,
  ExternalLink,
  Navigation
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const opportunities = [
  {
    id: 1,
    company: "TechCorp Solutions",
    role: "Software Developer Intern",
    type: "Internship",
    location: "Downtown Tech Hub",
    distance: "2.5 km",
    match: 92,
    salary: "$25/hr",
    skills: ["JavaScript", "React", "Node.js"],
  },
  {
    id: 2,
    company: "DataFlow Analytics",
    role: "Junior Data Engineer",
    type: "Full-time",
    location: "Business District",
    distance: "4.8 km",
    match: 87,
    salary: "$75k/year",
    skills: ["Python", "SQL", "ETL"],
  },
  {
    id: 3,
    company: "CloudFirst Inc",
    role: "Cloud Developer Trainee",
    type: "Internship",
    location: "Innovation Park",
    distance: "6.2 km",
    match: 78,
    salary: "$22/hr",
    skills: ["AWS", "Docker", "Linux"],
  },
  {
    id: 4,
    company: "WebWorks Studio",
    role: "Full Stack Developer",
    type: "Full-time",
    location: "Creative Quarter",
    distance: "3.1 km",
    match: 85,
    salary: "$80k/year",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 5,
    company: "StartupHub",
    role: "Frontend Developer",
    type: "Part-time",
    location: "University Area",
    distance: "1.2 km",
    match: 90,
    salary: "$30/hr",
    skills: ["React", "TypeScript", "CSS"],
  },
  {
    id: 6,
    company: "Enterprise Systems",
    role: "Backend Developer Intern",
    type: "Internship",
    location: "Corporate Campus",
    distance: "8.5 km",
    match: 75,
    salary: "$20/hr",
    skills: ["Java", "Spring", "SQL"],
  },
];

const NearbyOpportunities = () => {
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
            Nearby Opportunities
          </h1>
          <p className="text-muted-foreground mt-1">
            Companies and jobs in your area matched to your profile
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary">
          <Navigation className="w-5 h-5 text-primary" />
          <span className="text-sm text-foreground">Current Location: City Center</span>
        </div>
      </motion.div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          {/* Opportunity Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all group">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-primary" />
                      </div>
                      <Badge variant={opp.match >= 85 ? "default" : "secondary"}>
                        {opp.match}% Match
                      </Badge>
                    </div>
                    <div className="pt-3">
                      <p className="text-sm text-muted-foreground">{opp.company}</p>
                      <CardTitle className="text-lg">{opp.role}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{opp.type}</Badge>
                      <Badge variant="outline">{opp.salary}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{opp.location}</span>
                      <span className="text-primary font-medium">({opp.distance})</span>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {opp.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      View Details
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="map">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-96 bg-gradient-to-br from-secondary to-muted flex items-center justify-center relative">
                  {/* Placeholder map */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full grid grid-cols-8 grid-rows-6 gap-px">
                      {Array.from({ length: 48 }).map((_, i) => (
                        <div key={i} className="bg-primary/10 rounded" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Location markers */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
                  </div>
                  
                  {opportunities.slice(0, 4).map((opp, index) => (
                    <div 
                      key={opp.id}
                      className="absolute"
                      style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${20 + Math.random() * 60}%`,
                      }}
                    >
                      <div className="relative group cursor-pointer">
                        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-success-foreground text-xs font-bold shadow-lg">
                          {opp.match}
                        </div>
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Card className="p-2 shadow-lg">
                            <p className="text-xs font-medium whitespace-nowrap">{opp.company}</p>
                          </Card>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-center z-10 p-8 bg-card/80 backdrop-blur-sm rounded-2xl">
                    <MapPin className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Interactive Map Coming Soon
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      View opportunities on a real map with distance calculations
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NearbyOpportunities;
