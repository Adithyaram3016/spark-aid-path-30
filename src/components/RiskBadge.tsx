import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";

export type RiskLevel = "low" | "moderate" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RiskBadge = ({ level, className }: RiskBadgeProps) => {
  const configs = {
    low: {
      label: "Excelling",
      icon: CheckCircle,
      className: "bg-green-50 text-green-700 border-green-200",
    },
    moderate: {
      label: "Growing Strong",
      icon: AlertCircle,
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    high: {
      label: "Needs Support",
      icon: AlertTriangle,
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };

  const config = configs[level];
  const Icon = config.icon;

  return (
    <Badge className={`${config.className} ${className} border-2 font-medium px-3 py-1`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  );
};

export default RiskBadge;