import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Student } from "./StudentCard";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

interface StudentChartsProps {
  student: Student;
}

const StudentCharts = ({ student }: StudentChartsProps) => {
  // Attendance trend data (simulated monthly data)
  const attendanceData = [
    { month: "Sep", attendance: Math.max(40, student.attendance - 15) },
    { month: "Oct", attendance: Math.max(50, student.attendance - 10) },
    { month: "Nov", attendance: Math.max(60, student.attendance - 5) },
    { month: "Dec", attendance: student.attendance },
    { month: "Jan", attendance: Math.min(100, student.attendance + 2) },
  ];

  // Test scores data
  const testScoresData = student.testScores.map((score, index) => ({
    test: `Test ${index + 1}`,
    score: score,
    target: 80
  }));

  // Fee status data
  const feeData = [
    { name: "Paid", value: student.feeStatus === "paid" ? 100 : 0, color: "#10b981" },
    { name: "Pending", value: student.feeStatus === "pending" ? 100 : 0, color: "#f59e0b" },
    { name: "Overdue", value: student.feeStatus === "overdue" ? 100 : 0, color: "#ef4444" },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Attendance Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Attendance Growth Journey
          </CardTitle>
          <CardDescription>
            Tracking {student.name}'s attendance progress over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
                formatter={(value) => [`${value}%`, 'Attendance']}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              Current attendance: <span className="font-semibold">{student.attendance}%</span>
              {student.attendance >= 80 ? " - Excellent consistency! 🌟" : " - Growing stronger each month! 📈"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Scores */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Academic Achievement
          </CardTitle>
          <CardDescription>
            Recent test performance and growth opportunities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={testScoresData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="test" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '12px'
                }} 
                formatter={(value, name) => [
                  `${value}%`, 
                  name === 'score' ? 'Score' : 'Target'
                ]}
              />
              <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-700">
              Average score: <span className="font-semibold">
                {Math.round(student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length)}%
              </span>
              {student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length >= 70 
                ? " - Great progress! 🎯" 
                : " - Every improvement counts! 💪"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Fee Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Fee Status Overview
          </CardTitle>
          <CardDescription>
            Current fee payment status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 flex items-center justify-center">
            {feeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={feeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name }) => name}
                  >
                    {feeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Status']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-muted-foreground">
                <PieChartIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Fee status data unavailable</p>
              </div>
            )}
          </div>
          <div className="mt-4 p-3 bg-purple-50 rounded-lg">
            <p className="text-sm text-purple-700">
              Status: <span className="font-semibold capitalize">{student.feeStatus}</span>
              {student.feeStatus === "paid" && " - All set! 💜"}
              {student.feeStatus === "pending" && " - Payment processing 🔄"}
              {student.feeStatus === "overdue" && " - Support available 🤝"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Growth Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-primary" />
            Personalized Growth Plan
          </CardTitle>
          <CardDescription>
            Tailored recommendations for {student.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {student.attendance < 80 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-1">📅 Attendance Support</h4>
                <p className="text-sm text-blue-700">
                  Let's work together to build consistent attendance habits. Small steps lead to big achievements!
                </p>
              </div>
            )}
            
            {student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length < 70 && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 mb-1">📚 Academic Growth</h4>
                <p className="text-sm text-amber-700">
                  Consider joining study groups or requesting extra help sessions. You have great potential!
                </p>
              </div>
            )}
            
            {student.feeStatus !== "paid" && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-1">💳 Financial Support</h4>
                <p className="text-sm text-purple-700">
                  Our counselors can discuss payment plans and financial assistance options.
                </p>
              </div>
            )}
            
            {student.attendance >= 80 && student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length >= 70 && student.feeStatus === "paid" && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-1">🌟 Excellent Progress!</h4>
                <p className="text-sm text-green-700">
                  You're doing amazingly well! Consider taking on leadership roles or mentoring other students.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentCharts;