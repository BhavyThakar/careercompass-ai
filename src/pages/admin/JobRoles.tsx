import { motion } from "framer-motion";
import { useState } from "react";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  MapPin,
  Users,
  DollarSign,
  Calendar,
  Eye,
  MoreHorizontal,
  Briefcase
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for companies and job roles
const companies = [
  {
    id: 1,
    name: "TechCorp Inc.",
    logo: "/placeholder.svg",
    industry: "Technology",
    location: "San Francisco, CA",
    employees: 500,
    activeJobs: 12,
    description: "Leading technology company specializing in AI and cloud solutions.",
    website: "https://techcorp.com",
    status: "active"
  },
  {
    id: 2,
    name: "DataFlow Systems",
    logo: "/placeholder.svg",
    industry: "Data Analytics",
    location: "New York, NY",
    employees: 200,
    activeJobs: 8,
    description: "Data analytics and business intelligence solutions provider.",
    website: "https://dataflow.com",
    status: "active"
  },
  {
    id: 3,
    name: "CloudTech Solutions",
    logo: "/placeholder.svg",
    industry: "Cloud Computing",
    location: "Austin, TX",
    employees: 150,
    activeJobs: 5,
    description: "Cloud infrastructure and DevOps services company.",
    website: "https://cloudtech.com",
    status: "inactive"
  }
];

const jobRoles = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$120k - $160k",
    experience: "3-5 years",
    skills: ["React", "Node.js", "AWS"],
    postedDate: "2024-01-15",
    applicants: 45,
    status: "active"
  },
  {
    id: 2,
    title: "Data Scientist",
    company: "DataFlow Systems",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100k - $140k",
    experience: "2-4 years",
    skills: ["Python", "Machine Learning", "SQL"],
    postedDate: "2024-01-12",
    applicants: 32,
    status: "active"
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "CloudTech Solutions",
    location: "Austin, TX",
    type: "Full-time",
    salary: "$90k - $130k",
    experience: "2-3 years",
    skills: ["Docker", "Kubernetes", "AWS"],
    postedDate: "2024-01-10",
    applicants: 18,
    status: "active"
  }
];

const JobRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("companies");

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Job Roles & Companies
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage companies and job opportunities for career matching
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Company</DialogTitle>
                  <DialogDescription>
                    Add a new company to the career matching system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="company-name" className="text-right">
                      Company Name
                    </Label>
                    <Input id="company-name" placeholder="Enter company name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="industry" className="text-right">
                      Industry
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="location" className="text-right">
                      Location
                    </Label>
                    <Input id="location" placeholder="City, State/Country" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" placeholder="Company description" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="website" className="text-right">
                      Website
                    </Label>
                    <Input id="website" placeholder="https://company.com" className="col-span-3" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Company</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="jobs">Job Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="companies" className="space-y-6">
          {/* Companies Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Building2 className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Companies</p>
                    <p className="text-2xl font-bold">247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-success" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Active Jobs</p>
                    <p className="text-2xl font-bold">156</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-warning" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                    <p className="text-2xl font-bold">12.5K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <MapPin className="w-8 h-8 text-accent" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Locations</p>
                    <p className="text-2xl font-bold">89</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Companies List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    Companies Directory
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search companies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {companies.map((company) => (
                    <motion.div
                      key={company.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={company.logo} alt={company.name} />
                            <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{company.name}</h3>
                              <Badge variant={company.status === "active" ? "default" : "secondary"}>
                                {company.status}
                              </Badge>
                            </div>
                            <p className="text-muted-foreground mb-3">{company.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Building2 className="w-4 h-4" />
                                {company.industry}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {company.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {company.employees} employees
                              </div>
                              <div className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {company.activeJobs} active jobs
                              </div>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Company
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Company
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          {/* Job Roles Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Briefcase className="w-8 h-8 text-primary" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Jobs</p>
                    <p className="text-2xl font-bold">342</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-success" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Total Applicants</p>
                    <p className="text-2xl font-bold">2,847</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-warning" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Avg Salary</p>
                    <p className="text-2xl font-bold">$112K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-accent" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">Posted This Month</p>
                    <p className="text-2xl font-bold">67</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Roles Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-primary" />
                    Job Opportunities
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search jobs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Add New Job Role</DialogTitle>
                          <DialogDescription>
                            Create a new job opportunity for students.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="job-title" className="text-right">
                              Job Title
                            </Label>
                            <Input id="job-title" placeholder="Enter job title" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="company" className="text-right">
                              Company
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select company" />
                              </SelectTrigger>
                              <SelectContent>
                                {companies.map((company) => (
                                  <SelectItem key={company.id} value={company.id.toString()}>
                                    {company.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="location" className="text-right">
                              Location
                            </Label>
                            <Input id="location" placeholder="Job location" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="salary" className="text-right">
                              Salary Range
                            </Label>
                            <Input id="salary" placeholder="$100k - $150k" className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="experience" className="text-right">
                              Experience
                            </Label>
                            <Select>
                              <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Required experience" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                                <SelectItem value="mid">Mid Level (2-5 years)</SelectItem>
                                <SelectItem value="senior">Senior Level (5+ years)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                              Description
                            </Label>
                            <Textarea id="description" placeholder="Job description and requirements" className="col-span-3" />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Cancel</Button>
                          <Button>Add Job</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Salary</TableHead>
                      <TableHead>Applicants</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobRoles.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell className="font-medium">{job.title}</TableCell>
                        <TableCell>{job.company}</TableCell>
                        <TableCell>{job.location}</TableCell>
                        <TableCell>{job.type}</TableCell>
                        <TableCell>{job.salary}</TableCell>
                        <TableCell>{job.applicants}</TableCell>
                        <TableCell>
                          <Badge variant={job.status === "active" ? "default" : "secondary"}>
                            {job.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Job
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobRoles;
