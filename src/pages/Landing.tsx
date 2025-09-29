import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Brain, BarChart3 } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-strong">
              <Brain className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            AI Student Success
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Platform</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Predictive analytics and counseling system to identify at-risk students and provide timely interventions
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="group hover:shadow-strong transition-all duration-300 cursor-pointer border-2 hover:border-primary"
                onClick={() => navigate("/login?role=educator")}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 bg-gradient-primary rounded-full mb-4 group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">Educator / Mentor</CardTitle>
              <CardDescription className="text-lg">
                Monitor student progress, identify at-risk students, and provide targeted interventions
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" className="w-full bg-gradient-primary hover:shadow-medium">
                Access Dashboard
              </Button>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics & Risk Assessment</span>
                </div>
                <div>• Student monitoring • Intervention tools • Progress tracking</div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-strong transition-all duration-300 cursor-pointer border-2 hover:border-success"
                onClick={() => navigate("/login?role=student")}>
            <CardHeader className="text-center pb-6">
              <div className="mx-auto p-4 bg-gradient-success rounded-full mb-4 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8 text-success-foreground" />
              </div>
              <CardTitle className="text-2xl">Student</CardTitle>
              <CardDescription className="text-lg">
                Track your academic progress, attendance, and receive personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button size="lg" variant="outline" className="w-full border-success text-success hover:bg-success hover:text-success-foreground">
                View Progress
              </Button>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Personal Analytics</span>
                </div>
                <div>• Progress tracking • Recommendations • Goal setting</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="text-center animate-slide-up">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Powered by AI-Driven Insights</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="p-3 bg-success/10 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <BarChart3 className="h-8 w-8 text-success" />
              </div>
              <h3 className="font-semibold mb-2">Predictive Analytics</h3>
              <p className="text-sm text-muted-foreground">AI algorithms analyze attendance, grades, and engagement patterns</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-warning/10 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Brain className="h-8 w-8 text-warning" />
              </div>
              <h3 className="font-semibold mb-2">Early Intervention</h3>
              <p className="text-sm text-muted-foreground">Identify at-risk students before it's too late</p>
            </div>
            <div className="text-center">
              <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Personalized Support</h3>
              <p className="text-sm text-muted-foreground">Tailored recommendations and counseling for each student</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;