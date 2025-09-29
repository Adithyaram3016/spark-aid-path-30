import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User } from 'lucide-react';
import type { StudentSchedule } from '@/hooks/useStudentData';

interface ScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule: StudentSchedule[];
}

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ScheduleDialog = ({ open, onOpenChange, schedule }: ScheduleDialogProps) => {
  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const groupedSchedule = schedule.reduce((acc, item) => {
    const day = dayNames[item.day_of_week];
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {} as Record<string, StudentSchedule[]>);

  // Sort each day's schedule by start time
  Object.keys(groupedSchedule).forEach(day => {
    groupedSchedule[day].sort((a, b) => a.start_time.localeCompare(b.start_time));
  });

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Class Schedule
          </DialogTitle>
          <DialogDescription>
            Your weekly class timetable and session schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {schedule.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scheduled classes found</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {weekDays.map(day => {
                const daySchedule = groupedSchedule[day];
                if (!daySchedule || daySchedule.length === 0) return null;

                return (
                  <Card key={day}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {daySchedule.map((classItem, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold">{classItem.subject}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {classItem.teacher_name}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(classItem.start_time)} - {formatTime(classItem.end_time)}
                                </div>
                                {classItem.room_number && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    Room {classItem.room_number}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};