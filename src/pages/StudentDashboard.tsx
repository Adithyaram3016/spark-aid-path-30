import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import RiskBadge from "@/components/RiskBadge";
import { useStudentData } from "@/hooks/useStudentData";
import { PaymentDialog } from "@/components/PaymentDialog";
import { BookingDialog } from "@/components/BookingDialog";
import { ResourcesDialog } from "@/components/ResourcesDialog";
import { ScheduleDialog } from "@/components/ScheduleDialog";
import { AchievementsDialog } from "@/components/AchievementsDialog";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Calendar, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  Target,
  MessageCircle,
  Award,
  Clock,
  Phone,
  Mail,
  Video
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock student data
const studentData = {
  name: "Alice Johnson",
  id: "STU001",
  class: "Grade 10A",
  email: "alice.j@school.edu",
  riskLevel: "moderate" as const,
  attendance: {
    percentage: 78,
    present: 156,
    total: 200,
    trend: [
      { month: "Sep", attendance: 85 },
      { month: "Oct", attendance: 82 },
      { month: "Nov", attendance: 75 },
      { month: "Dec", attendance: 78 },
      { month: "Jan", attendance: 78 }
    ]
  },
  academics: {
    avgScore: 72,
    recentScores: [
      { subject: "Math", score: 85, date: "2024-01-20" },
      { subject: "Science", score: 70, date: "2024-01-18" },
      { subject: "English", score: 68, date: "2024-01-15" },
      { subject: "History", score: 75, date: "2024-01-12" }
    ],
    trend: [
      { month: "Sep", score: 80 },
      { month: "Oct", score: 75 },
      { month: "Nov", score: 70 },
      { month: "Dec", score: 72 },
      { month: "Jan", score: 72 }
    ]
  },
  fees: {
    status: "pending",
    amount: 1200,
    dueDate: "2024-02-15",
    history: [
      { month: "Term 1", amount: 1200, status: "paid", date: "2023-09-15" },
      { month: "Term 2", amount: 1200, status: "paid", date: "2023-12-15" },
      { month: "Term 3", amount: 1200, status: "pending", date: "2024-02-15" }
    ]
  },
  recommendations: [
    {
      type: "urgent",
      title: "Improve Attendance",
      description: "Your attendance has dropped to 78%. Aim for 85% or higher.",
      action: "Meet with counselor"
    },
    {
      type: "academic",
      title: "Focus on Science & English",
      description: "Consider extra practice sessions for these subjects.",
      action: "Book tutoring session"
    },
    {
      type: "financial",
      title: "Fee Payment Due",
      description: "Term 3 fees are due by February 15th.",
      action: "Make payment"
    }
  ]
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    student, 
    feePayments, 
    counselingSessions, 
    tutoringSessions, 
    studyResources, 
    schedule, 
    achievements, 
    loading, 
    refetch 
  } = useStudentData();

  // Dialog states
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; payment: any }>({ open: false, payment: null });
  const [counselingDialog, setCounselingDialog] = useState(false);
  const [tutoringDialog, setTutoringDialog] = useState(false);
  const [resourcesDialog, setResourcesDialog] = useState(false);
  const [scheduleDialog, setScheduleDialog] = useState(false);
  const [achievementsDialog, setAchievementsDialog] = useState(false);

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "urgent": return "border-destructive bg-destructive/5";
      case "academic": return "border-primary bg-primary/5";
      case "financial": return "border-warning bg-warning/5";
      default: return "border-muted";
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "urgent": return <Clock className="h-4 w-4 text-destructive" />;
      case "academic": return <BookOpen className="h-4 w-4 text-primary" />;
      case "financial": return <DollarSign className="h-4 w-4 text-warning" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  // Handler functions for button actions
  const handlePayNow = () => {
    const pendingPayment = feePayments.find(p => p.status === 'pending');
    if (pendingPayment) {
      setPaymentDialog({ open: true, payment: pendingPayment });
    } else {
      toast({
        title: "No Pending Payments",
        description: "You have no pending fee payments at this time.",
      });
    }
  };

  const handleContactCounselor = () => {
    toast({
      title: "Contact Options",
      description: "Choose your preferred contact method",
    });
    // Open contact options menu
  };

  const handleStudyResources = () => {
    setResourcesDialog(true);
  };

  const handleViewSchedule = () => {
    setScheduleDialog(true);
  };

  const handleAchievements = () => {
    setAchievementsDialog(true);
  };

  const handleBookCounseling = () => {
    setCounselingDialog(true);
  };

  const handleBookTutoring = () => {
    setTutoringDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Student Profile Not Found</h1>
          <p className="text-muted-foreground mb-4">Please complete your profile setup first.</p>
          <Button onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  const pendingFees = feePayments.filter(p => p.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, {student.first_name} {student.last_name}</h1>
              <p className="text-muted-foreground">{student.class} • {student.student_id}</p>
            </div>
            <div className="flex items-center gap-4">
              <RiskBadge level="moderate" />
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-primary">Attendance</CardTitle>
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">78%</span>
                  <span className="text-sm text-muted-foreground">
                    156/200 days
                  </span>
                </div>
                <Progress value={78} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Target: 85% • Need to improve by 7%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-success">Academic Performance</CardTitle>
                <BookOpen className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">72%</span>
                  <Badge variant="outline" className="text-success border-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Stable
                  </Badge>
                </div>
                <Progress value={72} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Last 4 tests average • Target: 80%
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-warning/20 bg-warning/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-warning">Fee Status</CardTitle>
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${pendingFees.length > 0 ? pendingFees[0].amount : '0'}
                  </span>
                  <Badge className="bg-gradient-warning text-warning-foreground">
                    {pendingFees.length > 0 ? 'PENDING' : 'PAID'}
                  </Badge>
                </div>
                <p className="text-sm">
                  {pendingFees.length > 0 
                    ? `Due: ${new Date(pendingFees[0].due_date).toLocaleDateString()}`
                    : 'No pending payments'
                  }
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-gradient-warning"
                  onClick={handlePayNow}
                  disabled={pendingFees.length === 0}
                >
                  Pay Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Trend
              </CardTitle>
              <CardDescription>Monthly attendance percentage over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={studentData.attendance.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Test Scores */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Recent Test Scores
              </CardTitle>
              <CardDescription>Latest subject-wise performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={studentData.academics.recentScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar 
                    dataKey="score" 
                    fill="hsl(var(--success))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Personalized Recommendations
            </CardTitle>
            <CardDescription>
              AI-generated suggestions to improve your academic performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {studentData.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getRecommendationColor(rec.type)}`}
                >
                  <div className="flex items-start gap-3">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          if (rec.action === "Meet with counselor") {
                            handleBookCounseling();
                          } else if (rec.action === "Book tutoring session") {
                            handleBookTutoring();
                          } else if (rec.action === "Make payment") {
                            handlePayNow();
                          }
                        }}
                      >
                        {rec.action}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            className="h-20 flex flex-col gap-2 bg-gradient-primary"
            onClick={handleContactCounselor}
          >
            <MessageCircle className="h-6 w-6" />
            <span>Contact Counselor</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleStudyResources}
          >
            <BookOpen className="h-6 w-6" />
            <span>Study Resources</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleViewSchedule}
          >
            <Calendar className="h-6 w-6" />
            <span>View Schedule</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-20 flex flex-col gap-2"
            onClick={handleAchievements}
          >
            <Award className="h-6 w-6" />
            <span>Achievements</span>
          </Button>
        </div>

        {/* Contact Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Counselor Contact Options
            </CardTitle>
            <CardDescription>
              Multiple ways to reach your academic counselor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-2"
                onClick={() => window.open('mailto:counselor@school.edu', '_blank')}
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">Send Email</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-2"
                onClick={() => window.open('tel:+1234567890', '_blank')}
              >
                <Phone className="h-5 w-5" />
                <span className="text-sm">Call Direct</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex flex-col gap-2"
                onClick={handleBookCounseling}
              >
                <Video className="h-5 w-5" />
                <span className="text-sm">Book Session</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      {paymentDialog.open && paymentDialog.payment && (
        <PaymentDialog
          open={paymentDialog.open}
          onOpenChange={(open) => setPaymentDialog({ open, payment: null })}
          payment={paymentDialog.payment}
          onSuccess={refetch}
        />
      )}

      <BookingDialog
        open={counselingDialog}
        onOpenChange={setCounselingDialog}
        type="counseling"
        studentId={student.id}
        onSuccess={refetch}
      />

      <BookingDialog
        open={tutoringDialog}
        onOpenChange={setTutoringDialog}
        type="tutoring"
        studentId={student.id}
        onSuccess={refetch}
      />

      <ResourcesDialog
        open={resourcesDialog}
        onOpenChange={setResourcesDialog}
        resources={studyResources}
      />

      <ScheduleDialog
        open={scheduleDialog}
        onOpenChange={setScheduleDialog}
        schedule={schedule}
      />

      <AchievementsDialog
        open={achievementsDialog}
        onOpenChange={setAchievementsDialog}
        achievements={achievements}
      />
    </div>
  );
};

export default StudentDashboard;