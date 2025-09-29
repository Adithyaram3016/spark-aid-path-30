import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Download, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Student } from "./StudentCard";

interface CSVUploadProps {
  onDataUploaded: (students: Student[]) => void;
}

const CSVUpload = ({ onDataUploaded }: CSVUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const generateSampleData = (): Student[] => [
    {
      id: "csv1",
      name: "Emma Rodriguez",
      email: "emma.r@school.edu",
      class: "Grade 11A",
      riskLevel: "low",
      attendance: 94,
      testScores: [89, 92, 87],
      feeStatus: "paid",
      lastContact: "2024-01-28",
      reasons: []
    },
    {
      id: "csv2", 
      name: "Michael Chen",
      email: "michael.c@school.edu",
      class: "Grade 11A",
      riskLevel: "moderate",
      attendance: 82,
      testScores: [75, 68, 71],
      feeStatus: "pending",
      lastContact: "2024-01-26",
      reasons: ["Opportunities to strengthen study habits", "Fee payment pending"]
    },
    {
      id: "csv3",
      name: "Sarah Johnson", 
      email: "sarah.j@school.edu",
      class: "Grade 11B",
      riskLevel: "high",
      attendance: 58,
      testScores: [52, 47, 55],
      feeStatus: "overdue",
      lastContact: "2024-01-22",
      reasons: ["Great potential - attendance support needed", "Additional learning support available", "Fee assistance options available"]
    }
  ];

  const downloadTemplate = () => {
    const csvContent = `Name,Email,Class,Attendance,Test Score 1,Test Score 2,Test Score 3,Fee Status,Last Contact
John Doe,john.doe@school.edu,Grade 10A,85,78,82,79,paid,2024-01-25
Jane Smith,jane.smith@school.edu,Grade 10B,72,65,68,71,pending,2024-01-23
Mike Johnson,mike.j@school.edu,Grade 10A,91,88,92,87,paid,2024-01-27`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_data_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded! 📋",
      description: "Sample CSV template has been downloaded to help you format your data.",
    });
  };

  const parseCSV = (text: string): Student[] => {
    const lines = text.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map((line, index) => {
      const values = line.split(',').map(v => v.trim());
      const attendance = parseInt(values[3]) || 75;
      const testScores = [
        parseInt(values[4]) || 70,
        parseInt(values[5]) || 70, 
        parseInt(values[6]) || 70
      ];
      const avgScore = testScores.reduce((a, b) => a + b, 0) / testScores.length;
      
      let riskLevel: "low" | "moderate" | "high" = "low";
      const reasons: string[] = [];
      
      if (attendance < 60 || avgScore < 50) {
        riskLevel = "high";
        if (attendance < 60) reasons.push("Great potential - attendance support needed");
        if (avgScore < 50) reasons.push("Additional learning support available");
      } else if (attendance < 80 || avgScore < 70) {
        riskLevel = "moderate";
        if (attendance < 80) reasons.push("Opportunities to strengthen attendance");
        if (avgScore < 70) reasons.push("Opportunities to strengthen study habits");
      }
      
      const feeStatus = (values[7] || "paid").toLowerCase() as "paid" | "pending" | "overdue";
      if (feeStatus === "overdue") {
        reasons.push("Fee assistance options available");
      } else if (feeStatus === "pending") {
        reasons.push("Fee payment pending");
      }
      
      return {
        id: `csv${index + 1}`,
        name: values[0] || `Student ${index + 1}`,
        email: values[1] || `student${index + 1}@school.edu`,
        class: values[2] || "Grade 10A",
        riskLevel,
        attendance,
        testScores,
        feeStatus,
        lastContact: values[8] || new Date().toISOString().split('T')[0],
        reasons
      };
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const students = parseCSV(text);
        
        setTimeout(() => {
          onDataUploaded(students);
          setIsUploading(false);
          
          toast({
            title: "Data Uploaded Successfully! 🎉",
            description: `${students.length} student records have been imported and are ready for support.`,
          });
        }, 1500);
      } catch (error) {
        setIsUploading(false);
        toast({
          title: "Upload Error",
          description: "Please check your CSV format and try again.",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
  };

  const loadSampleData = () => {
    setIsUploading(true);
    setTimeout(() => {
      const sampleStudents = generateSampleData();
      onDataUploaded(sampleStudents);
      setIsUploading(false);
      
      toast({
        title: "Sample Data Loaded! 🌟",
        description: "Sample student data has been loaded for demonstration.",
      });
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Student Data Management
        </CardTitle>
        <CardDescription>
          Upload student data or use sample data to get started
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            onClick={downloadTemplate}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>
          
          <Button
            variant="outline"
            onClick={loadSampleData}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Load Sample Data
          </Button>
          
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Upload CSV
          </Button>
        </div>

        <Input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />

        {uploadedFile && (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-sm">
              {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
            </span>
          </div>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p className="font-medium mb-1">CSV Format Requirements:</p>
          <ul className="space-y-1 text-xs">
            <li>• Columns: Name, Email, Class, Attendance%, Test Scores (1-3), Fee Status, Last Contact</li>
            <li>• Attendance as percentage (0-100)</li>
            <li>• Fee Status: paid, pending, or overdue</li>
            <li>• Date format: YYYY-MM-DD</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVUpload;