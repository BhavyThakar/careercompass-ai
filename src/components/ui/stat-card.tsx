import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) => {
  const variants = {
    default: "bg-card border-border",
    primary: "bg-secondary border-primary/20",
    success: "bg-success/10 border-success/20",
    warning: "bg-warning/10 border-warning/20",
  };

  const iconVariants = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "p-6 rounded-2xl border shadow-card",
        variants[variant],
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        {Icon && (
          <div className={cn("p-2 rounded-lg", iconVariants[variant])}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-3xl font-bold font-display text-foreground">{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 pt-2">
            <span
              className={cn(
                "text-sm font-medium",
                trend.positive ? "text-success" : "text-destructive"
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
            <span className="text-sm text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export { StatCard };
