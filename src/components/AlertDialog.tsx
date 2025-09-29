import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student } from "./StudentCard";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AlertDialogProps {
  student: Student;
  isOpen: boolean;
  onClose: () => void;
}

const AlertDialog = ({ student, isOpen, onClose }: AlertDialogProps) => {
  const [guardianEmail, setGuardianEmail] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [alertType, setAlertType] = useState<"email" | "sms" | "both">("email");
  const { toast } = useToast();

  const generatePositiveMessage = () => {
    const messages = [];
    
    if (student.attendance < 75) {
      messages.push(`We wanted to share that ${student.name} has ${student.attendance}% attendance. With a little extra support, we believe they can improve and reach their full potential.`);
    }
    
    if (student.testScores.length > 0) {
      const avgScore = student.testScores.reduce((a, b) => a + b, 0) / student.testScores.length;
      if (avgScore < 60) {
        messages.push(`${student.name} is working hard in their studies. We recommend some additional practice in subjects where they can grow stronger.`);
      }
    }
    
    if (student.feeStatus === "overdue") {
      messages.push(`We'd like to discuss ${student.name}'s fee status to ensure they continue receiving the best education possible.`);
    }
    
    if (messages.length === 0) {
      messages.push(`${student.name} is doing well, and we wanted to keep you updated on their progress. Together, we can help them achieve even greater success.`);
    }
    
    return `Dear Guardian,\n\n${messages.join(' ')}\n\nWe're here to support ${student.name}'s journey and would love to discuss how we can work together to help them thrive.\n\nBest regards,\n${student.class} Team`;
  };

  const handleSendAlert = () => {
    const message = customMessage || generatePositiveMessage();
    
    // Simulate sending alert
    console.log("Sending alert:", {
      student: student.name,
      type: alertType,
      email: guardianEmail,
      phone: guardianPhone,
      message: message
    });
    
    toast({
      title: "Gentle Reminder Sent! 💝",
      description: `A caring message has been sent to ${student.name}'s guardian via ${alertType}.`,
    });
    
    onClose();
    setGuardianEmail("");
    setGuardianPhone("");
    setCustomMessage("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            Send Caring Message for {student.name}
          </DialogTitle>
          <DialogDescription>
            Send a gentle, encouraging message to the guardian to support {student.name}'s growth.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={alertType === "email" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlertType("email")}
              className="flex items-center gap-1"
            >
              <Mail className="h-3 w-3" />
              Email
            </Button>
            <Button
              variant={alertType === "sms" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlertType("sms")}
              className="flex items-center gap-1"
            >
              <Phone className="h-3 w-3" />
              SMS
            </Button>
            <Button
              variant={alertType === "both" ? "default" : "outline"}
              size="sm"
              onClick={() => setAlertType("both")}
              className="flex items-center gap-1"
            >
              <MessageCircle className="h-3 w-3" />
              Both
            </Button>
          </div>

          {(alertType === "email" || alertType === "both") && (
            <div>
              <label className="text-sm font-medium">Guardian Email</label>
              <Input
                type="email"
                placeholder="guardian@example.com"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </div>
          )}

          {(alertType === "sms" || alertType === "both") && (
            <div>
              <label className="text-sm font-medium">Guardian Phone</label>
              <Input
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={guardianPhone}
                onChange={(e) => setGuardianPhone(e.target.value)}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium">Message (Auto-generated positive message or custom)</label>
            <Textarea
              placeholder={generatePositiveMessage()}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendAlert} className="bg-gradient-primary">
            Send Caring Message 💝
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;