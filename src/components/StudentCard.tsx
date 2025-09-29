import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import RiskBadge, { RiskLevel } from "./RiskBadge";
import StudentCharts from "./StudentCharts";
import { 
  ChevronDown, 
  ChevronUp, 
  Phone, 
  UserPlus, 
  FileText, 
  Calendar,
  TrendingUp,
  DollarSign,
  BookOpen,
  Heart,
  Mail,
  MessageCircle,
  BarChart3
} from "lucide-react";

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  riskLevel: RiskLevel;
  attendance: number;
  testScores: number[];
  feeStatus: "paid" | "pending" | "overdue";
  lastContact: string;
  reasons: string[];
}

interface StudentCardProps {
  student: Student;
  onSendAlert?: (student: Student) => void;
}

const StudentCard = ({ student, onSendAlert }: StudentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [contacted, setContacted] = useState(false);
  const [counselorAssigned, setCounselorAssigned] = useState(false);
  const [noteAdded, setNoteAdded] = useState(false);

  const getReasonIcon = (reason: string) => {
    if (reason.includes("attendance")) return <Calendar className="h-3 w-3" />;
    if (reason.includes("fee")) return <DollarSign className="h-3 w-3" />;
    if (reason.includes("score")) return <BookOpen className="h-3 w-3" />;
    return <TrendingUp className="h-3 w-3" />;
  };

  const getReasonColor = (reason: string) => {
    if (reason.includes("attendance")) return "bg-blue-50 text-blue-700 border-blue-200";
    if (reason.includes("fee")) return "bg-purple-50 text-purple-700 border-purple-200";
    if (reason.includes("score")) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-muted text-muted-foreground";
  };

  const getFeeStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-success";
      case "pending": return "text-warning";
      case "overdue": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const averageScore = student.testScores.length > 0 
    ? Math.round(student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length)
    : 0;

  return (
    <Card className="hover:shadow-medium transition-all duration-200">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <CardTitle className="text-lg">{student.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{student.class} • {student.email}</p>
                </div>
                <RiskBadge level={student.riskLevel} />
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-right text-sm">
                  <div className="font-medium">{student.attendance}% attendance</div>
                  <div className="text-muted-foreground">Avg: {averageScore}%</div>
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Growth Opportunities */}
            {student.reasons.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2 text-primary">Growth Opportunities:</h4>
                <div className="flex flex-wrap gap-2">
                  {student.reasons.map((reason, index) => (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className={`text-xs ${getReasonColor(reason)}`}
                    >
                      {getReasonIcon(reason)}
                      <span className="ml-1">{reason}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Detailed Stats */}
            <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/30 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{student.attendance}%</div>
                <div className="text-xs text-muted-foreground">Attendance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{averageScore}%</div>
                <div className="text-xs text-muted-foreground">Avg Score</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${getFeeStatusColor(student.feeStatus)}`}>
                  {student.feeStatus.toUpperCase()}
                </div>
                <div className="text-xs text-muted-foreground">Fee Status</div>
              </div>
            </div>

            {/* Recent Test Scores */}
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Last 3 Test Scores:</h4>
              <div className="flex space-x-2">
                {student.testScores.slice(-3).map((score, index) => (
                  <div 
                    key={index}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      score >= 80 ? 'bg-success/10 text-success' :
                      score >= 60 ? 'bg-warning/10 text-warning' :
                      'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {score}%
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant={contacted ? "default" : "outline"} 
                className="flex items-center gap-1"
                onClick={() => setContacted(!contacted)}
              >
                <Phone className="h-3 w-3" />
                {contacted ? "✓ Contacted" : "Mark Contacted"}
              </Button>
              <Button 
                size="sm" 
                variant={counselorAssigned ? "default" : "outline"} 
                className="flex items-center gap-1"
                onClick={() => setCounselorAssigned(!counselorAssigned)}
              >
                <UserPlus className="h-3 w-3" />
                {counselorAssigned ? "✓ Counselor Assigned" : "Assign Counselor"}
              </Button>
              <Button 
                size="sm" 
                variant={noteAdded ? "default" : "outline"} 
                className="flex items-center gap-1"
                onClick={() => setNoteAdded(!noteAdded)}
              >
                <FileText className="h-3 w-3" />
                {noteAdded ? "✓ Note Added" : "Add Note"}
              </Button>
              {onSendAlert && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => onSendAlert(student)}
                >
                  <Heart className="h-3 w-3" />
                  Send Caring Message
                </Button>
              )}
              <Button 
                size="sm" 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAnalytics(!showAnalytics);
                }}
              >
                <BarChart3 className="h-3 w-3" />
                {showAnalytics ? "Hide Analytics" : "Show Analytics"}
              </Button>
            </div>

            {/* Performance Analytics */}
            {showAnalytics && (
              <div className="mt-6 border-t pt-4">
                <h4 className="text-md font-medium mb-4">Performance Analytics</h4>
                <StudentCharts student={student} />
              </div>
            )}

            <div className="mt-3 text-xs text-muted-foreground">
              Last contact: {student.lastContact}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default StudentCard;