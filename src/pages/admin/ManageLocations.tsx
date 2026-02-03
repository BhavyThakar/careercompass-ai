import { motion } from "framer-motion";
import { useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Globe,
  Users,
  Building2,
  Eye,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
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

// Mock locations data
const locations = [
  {
    id: 1,
    city: "San Francisco",
    state: "California",
    country: "USA",
    zipCode: "94105",
    companies: 45,
    activeJobs: 127,
    students: 892,
    status: "active",
    description: "Tech hub with major companies like Google, Apple, and Facebook"
  },
  {
    id: 2,
    city: "New York",
    state: "New York",
    country: "USA",
    zipCode: "10001",
    companies: 78,
    activeJobs: 203,
    students: 1245,
    status: "active",
    description: "Financial district and major corporate headquarters"
  },
  {
    id: 3,
    city: "Austin",
    state: "Texas",
    country: "USA",
    zipCode: "78701",
    companies: 32,
    activeJobs: 89,
    students: 567,
    status: "active",
    description: "Growing tech scene with companies like Tesla and Oracle"
  },
  {
    id: 4,
    city: "Seattle",
    state: "Washington",
    country: "USA",
    zipCode: "98101",
    companies: 28,
    activeJobs: 76,
    students: 445,
    status: "inactive",
    description: "Home to Amazon and Microsoft headquarters"
  },
  {
    id: 5,
    city: "Boston",
    state: "Massachusetts",
    country: "USA",
    zipCode: "02101",
    companies: 41,
    activeJobs: 98,
    students: 723,
    status: "active",
    description: "Academic and research hub with Harvard and MIT"
  }
];

const ManageLocations = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pt-12 lg:pt-0">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold font-display text-foreground">
              Manage Locations
            </h1>
            <p className="text-muted-foreground mt-1">
              Configure job market locations and regional settings
            </p>
          </div>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Location
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Location</DialogTitle>
                  <DialogDescription>
                    Add a new location to the career matching system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="city" className="text-right">
                      City
                    </Label>
                    <Input id="city" placeholder="Enter city name" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="state" className="text-right">
                      State
                    </Label>
                    <Input id="state" placeholder="Enter state/province" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="country" className="text-right">
                      Country
                    </Label>
                    <Select>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="germany">Germany</SelectItem>
                        <SelectItem value="australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="zipCode" className="text-right">
                      ZIP Code
                    </Label>
                    <Input id="zipCode" placeholder="Enter ZIP/postal code" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea id="description" placeholder="Location description and notes" className="col-span-3" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Add Location</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-primary" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Locations</p>
                <p className="text-2xl font-bold">247</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Building2 className="w-8 h-8 text-success" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active Companies</p>
                <p className="text-2xl font-bold">1,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Globe className="w-8 h-8 text-warning" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Countries</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-accent" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Students Served</p>
                <p className="text-2xl font-bold">15.2K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Locations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Location Directory
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search locations..."
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead>Companies</TableHead>
                  <TableHead>Active Jobs</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {locations.map((location) => (
                  <TableRow key={location.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>
                            <MapPin className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{location.city}, {location.state}</div>
                          <div className="text-sm text-muted-foreground">{location.country} • {location.zipCode}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        {location.companies}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        {location.activeJobs}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        {location.students}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={location.status === "active" ? "default" : "secondary"}>
                        {location.status}
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
                            Edit Location
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete Location
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
    </div>
  );
};

export default ManageLocations;
