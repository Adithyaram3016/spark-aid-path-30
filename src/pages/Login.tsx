import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Brain, GraduationCap, Users } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get("role") || "educator";
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${role}!`,
      });
      
      if (role === "educator") {
        navigate("/educator-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    }, 1000);
  };

  const isEducator = role === "educator";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary-light/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          className="mb-6 -ml-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="shadow-strong border-2">
          <CardHeader className="text-center">
            <div className={`mx-auto p-4 rounded-full mb-4 ${
              isEducator ? 'bg-gradient-primary' : 'bg-gradient-success'
            }`}>
              {isEducator ? (
                <Users className="h-8 w-8 text-primary-foreground" />
              ) : (
                <GraduationCap className="h-8 w-8 text-success-foreground" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isEducator ? "Educator Login" : "Student Login"}
            </CardTitle>
            <CardDescription>
              Access your {isEducator ? "management dashboard" : "progress dashboard"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className={`w-full ${
                  isEducator ? 'bg-gradient-primary' : 'bg-gradient-success'
                } hover:shadow-medium`}
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
              
              <div className="text-center">
                <Button variant="link" className="text-sm text-muted-foreground">
                  Forgot your password?
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground mb-3">
                Demo Credentials:
              </p>
              <div className="text-xs space-y-1 text-muted-foreground bg-muted/50 p-3 rounded">
                <div>Email: demo@{role}.com</div>
                <div>Password: demo123</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;