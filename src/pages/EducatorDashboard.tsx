import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentCard, { Student } from "@/components/StudentCard";
import AlertDialog from "@/components/AlertDialog";
import CSVUpload from "@/components/CSVUpload";
import StudentCharts from "@/components/StudentCharts";
import { 
  LogOut, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Users, 
  Heart, 
  TrendingUp,
  BarChart3,
  Bell,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.j@school.edu",
    class: "Grade 10A",
    riskLevel: "high",
    attendance: 45,
    testScores: [78, 65, 52],
    feeStatus: "overdue",
    lastContact: "2024-01-15",
    reasons: ["Low attendance (45%)", "Fee overdue", "Declining test scores"]
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.s@school.edu",
    class: "Grade 10A",
    riskLevel: "moderate",
    attendance: 78,
    testScores: [85, 70, 68],
    feeStatus: "pending",
    lastContact: "2024-01-20",
    reasons: ["Fee pending", "Test score drop"]
  },
  {
    id: "3",
    name: "Carol Williams",
    email: "carol.w@school.edu",
    class: "Grade 10B",
    riskLevel: "low",
    attendance: 92,
    testScores: [88, 92, 85],
    feeStatus: "paid",
    lastContact: "2024-01-25",
    reasons: []
  },
  {
    id: "4",
    name: "David Brown",
    email: "david.b@school.edu",
    class: "Grade 10A",
    riskLevel: "high",
    attendance: 60,
    testScores: [45, 50, 42],
    feeStatus: "overdue",
    lastContact: "2024-01-10",
    reasons: ["Low attendance (60%)", "Consistently low scores", "Fee overdue"]
  }
];

const EducatorDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("all");
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "all" || student.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const riskStats = {
    high: students.filter(s => s.riskLevel === "high").length,
    moderate: students.filter(s => s.riskLevel === "moderate").length,
    low: students.filter(s => s.riskLevel === "low").length,
  };

  const classes = ["all", ...Array.from(new Set(students.map(s => s.class)))];

  const handleSendAlert = (student: Student) => {
    setSelectedStudent(student);
    setShowAlertDialog(true);
  };

  const handleExportCSV = () => {
    const csvContent = [
      "Name,Email,Class,Attendance,Average Score,Fee Status,Risk Level,Last Contact",
      ...students.map(s => 
        `${s.name},${s.email},${s.class},${s.attendance}%,${Math.round(s.testScores.reduce((a,b) => a+b, 0) / s.testScores.length)}%,${s.feeStatus},${s.riskLevel},${s.lastContact}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported Successfully! 📊",
      description: "Student data has been downloaded as CSV file.",
    });
  };

  const handleSendDigest = () => {
    toast({
      title: "Caring Updates Sent! 💌",
      description: "Weekly progress updates have been sent to all guardians with positive messaging.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Educator Dashboard</h1>
              <p className="text-muted-foreground">Monitor and support student success</p>
            </div>
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
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            {/* Risk Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockStudents.length}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Users className="h-3 w-3 mr-1" />
                    Active students
                  </div>
                </CardContent>
              </Card>

              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-700">Needs Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-700">{riskStats.high}</div>
                  <div className="flex items-center text-xs text-amber-600">
                    <Heart className="h-3 w-3 mr-1" />
                    Ready for caring guidance
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Growing Strong</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-700">{riskStats.moderate}</div>
                  <div className="flex items-center text-xs text-blue-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Building momentum
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Excelling</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-700">{riskStats.low}</div>
                  <div className="flex items-center text-xs text-green-600">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Thriving beautifully
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters and Search */}
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Student List</CardTitle>
                    <CardDescription>Monitor and intervene for at-risk students</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleExportCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleSendDigest}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Caring Updates
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select 
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                    >
                      {classes.map(cls => (
                        <option key={cls} value={cls}>
                          {cls === "all" ? "All Classes" : cls}
                        </option>
                      ))}
                    </select>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredStudents.map(student => (
                    <StudentCard 
                      key={student.id} 
                      student={student} 
                      onSendAlert={handleSendAlert}
                    />
                  ))}
                </div>

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No students found matching your criteria.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Comprehensive analytics and insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                  <p>Detailed charts and reports will be available here including:</p>
                  <ul className="mt-4 space-y-1 text-sm">
                    <li>• Class-wise risk distribution</li>
                    <li>• Attendance vs test scores correlation</li>
                    <li>• Fee collection overview</li>
                    <li>• Intervention effectiveness tracking</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-6">
            <CSVUpload onDataUploaded={setStudents} />

            <Card>
              <CardHeader>
                <CardTitle>Positive Support Configuration</CardTitle>
                <CardDescription>Configure caring intervention thresholds and positive messaging</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium">Growth Support Thresholds</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Attendance Support Needed:</span>
                        <span className="font-mono">&lt; 75%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Academic Support Available:</span>
                        <span className="font-mono">&lt; 60% avg</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Financial Assistance:</span>
                        <span className="font-mono">Overdue fees</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium">Positive Messaging Examples</h4>
                    <div className="space-y-2 text-xs bg-muted p-3 rounded">
                      <p>"Your student has great potential..."</p>
                      <p>"We're here to support their growth..."</p>
                      <p>"Together we can help them thrive..."</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Alert Dialog */}
      {selectedStudent && (
        <AlertDialog
          student={selectedStudent}
          isOpen={showAlertDialog}
          onClose={() => {
            setShowAlertDialog(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default EducatorDashboard;