import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock } from 'lucide-react';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'counseling' | 'tutoring';
  studentId: string;
  onSuccess: () => void;
}

export const BookingDialog = ({ open, onOpenChange, type, studentId, onSuccess }: BookingDialogProps) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [staffMember, setStaffMember] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const staffOptions = type === 'counseling' 
    ? ['Dr. Sarah Johnson', 'Ms. Emily Davis', 'Mr. Robert Chen']
    : ['Prof. Michael Smith', 'Dr. Lisa Anderson', 'Ms. Jennifer Wilson'];

  const sessionTypeOptions = type === 'counseling'
    ? [
        { value: 'individual', label: 'Individual Session' },
        { value: 'group', label: 'Group Session' },
        { value: 'academic', label: 'Academic Guidance' },
        { value: 'career', label: 'Career Counseling' },
        { value: 'personal', label: 'Personal Support' }
      ]
    : [
        { value: 'math', label: 'Mathematics' },
        { value: 'science', label: 'Science' },
        { value: 'english', label: 'English' },
        { value: 'history', label: 'History' },
        { value: 'physics', label: 'Physics' }
      ];

  const handleSubmit = async () => {
    if (!date || !time || !staffMember || (!sessionType && type === 'counseling') || (!subject && type === 'tutoring')) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const scheduledDate = new Date(`${date}T${time}`).toISOString();

      const sessionData = {
        student_id: studentId,
        scheduled_date: scheduledDate,
        duration_minutes: parseInt(duration),
        notes,
        meeting_link: `https://meet.school.edu/session-${Date.now()}`,
      };

      let error;

      if (type === 'counseling') {
        const { error: counselingError } = await supabase
          .from('counseling_sessions')
          .insert({
            ...sessionData,
            counselor_name: staffMember,
            session_type: sessionType,
          });
        error = counselingError;
      } else {
        const { error: tutoringError } = await supabase
          .from('tutoring_sessions')
          .insert({
            ...sessionData,
            tutor_name: staffMember,
            subject: subject,
          });
        error = tutoringError;
      }

      if (error) {
        throw error;
      }

      toast({
        title: "Booking Confirmed",
        description: `Your ${type} session has been scheduled successfully`,
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was an error booking your session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Book {type === 'counseling' ? 'Counseling' : 'Tutoring'} Session
          </DialogTitle>
          <DialogDescription>
            Schedule a session with one of our {type === 'counseling' ? 'counselors' : 'tutors'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="staff">
              {type === 'counseling' ? 'Counselor' : 'Tutor'}
            </Label>
            <Select value={staffMember} onValueChange={setStaffMember}>
              <SelectTrigger>
                <SelectValue placeholder={`Select a ${type === 'counseling' ? 'counselor' : 'tutor'}`} />
              </SelectTrigger>
              <SelectContent>
                {staffOptions.map((staff) => (
                  <SelectItem key={staff} value={staff}>
                    {staff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-type">
              {type === 'counseling' ? 'Session Type' : 'Subject'}
            </Label>
            <Select value={type === 'counseling' ? sessionType : subject} onValueChange={type === 'counseling' ? setSessionType : setSubject}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${type === 'counseling' ? 'session type' : 'subject'}`} />
              </SelectTrigger>
              <SelectContent>
                {sessionTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any specific topics or requirements..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 bg-gradient-primary"
            >
              {submitting ? (
                "Booking..."
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Book Session
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};