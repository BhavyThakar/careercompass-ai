import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Upload,
  BarChart3,
  Settings,
  Briefcase,
  MapPin,
  FileText,
  Shield,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Home,
  Menu,
  X,
  Database,
  Sliders,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

interface NavGroup {
  title: string;
  id: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    id: "overview",
    items: [
      { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
    ],
  },
  {
    title: "Student Management",
    id: "students",
    items: [
      { icon: Users, label: "All Students", path: "/admin/students" },
      { icon: Upload, label: "Data Upload", path: "/admin/upload" },
      { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    ],
  },
  {
    title: "Career Configuration",
    id: "careers",
    items: [
      { icon: Briefcase, label: "Job Roles", path: "/admin/companies" },
      { icon: FileText, label: "Resume Settings", path: "/admin/resume-settings" },
    ],
  },
  {
    title: "Opportunities",
    id: "opportunities",
    items: [
      { icon: MapPin, label: "Manage Locations", path: "/admin/locations" },
      { icon: Database, label: "Companies", path: "/admin/companies" },
    ],
  },
  {
    title: "System",
    id: "system",
    items: [
      { icon: Sliders, label: "AI Configuration", path: "/admin/ai-config" },
      { icon: Settings, label: "Settings", path: "/admin/settings" },
    ],
  },
];

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["overview", "students", "careers", "opportunities", "system"]);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleGroup = (id: string) => {
    setExpandedGroups((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const isActive = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-foreground rounded-xl flex items-center justify-center shadow-md">
            <Shield className="w-6 h-6 text-background" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-sidebar-foreground">
              Student<span className="text-gradient">IQ</span>
            </span>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <NavLink
          to="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
            "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
          )}
          onClick={() => setIsMobileOpen(false)}
        >
          <Home className="w-5 h-5" />
          Back to Home
        </NavLink>

        <div className="h-px bg-sidebar-border my-4" />

        {navGroups.map((group) => (
          <div key={group.id} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
            >
              <span>{group.title}</span>
              {expandedGroups.includes(group.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {expandedGroups.includes(group.id) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-1 overflow-hidden"
                >
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive(item.path)
                          ? "bg-foreground text-background shadow-md"
                          : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </NavLink>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Admin section */}
      <div className="p-4 border-t border-sidebar-border space-y-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-foreground flex items-center justify-center">
            <Shield className="w-5 h-5 text-background" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              Admin User
            </p>
            <p className="text-xs text-muted-foreground truncate">
              System Administrator
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-muted-foreground hover:text-destructive hover:border-destructive"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-72 bg-sidebar border-r border-sidebar-border flex flex-col z-50 transition-transform duration-300 lg:translate-x-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default AdminSidebar;
