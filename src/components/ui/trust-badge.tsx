import { cn } from "@/lib/utils";
import { Shield, ShieldCheck, ShieldAlert } from "lucide-react";

interface TrustBadgeProps {
  level: "high" | "medium" | "low";
  showLabel?: boolean;
  className?: string;
}

const TrustBadge = ({ level, showLabel = true, className }: TrustBadgeProps) => {
  const config = {
    high: {
      icon: ShieldCheck,
      label: "High Trust",
      className: "bg-success/10 text-success border-success/20",
    },
    medium: {
      icon: Shield,
      label: "Medium Trust",
      className: "bg-warning/10 text-warning border-warning/20",
    },
    low: {
      icon: ShieldAlert,
      label: "Low Trust",
      className: "bg-muted text-muted-foreground border-border",
    },
  };

  const { icon: Icon, label, className: variantClass } = config[level];

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium",
        variantClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {showLabel && <span>{label}</span>}
    </div>
  );
};

export { TrustBadge };
