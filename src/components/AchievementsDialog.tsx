import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Calendar, Download, ExternalLink, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Achievement } from '@/hooks/useStudentData';

interface AchievementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievements: Achievement[];
}

export const AchievementsDialog = ({ open, onOpenChange, achievements }: AchievementsDialogProps) => {
  const { toast } = useToast();

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'academic': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'attendance': return <Calendar className="h-4 w-4 text-green-500" />;
      case 'behavior': return <Award className="h-4 w-4 text-blue-500" />;
      case 'extracurricular': return <Award className="h-4 w-4 text-purple-500" />;
      case 'certificate': return <Award className="h-4 w-4 text-orange-500" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'academic': return 'border-yellow-200 bg-yellow-50';
      case 'attendance': return 'border-green-200 bg-green-50';
      case 'behavior': return 'border-blue-200 bg-blue-50';
      case 'extracurricular': return 'border-purple-200 bg-purple-50';
      case 'certificate': return 'border-orange-200 bg-orange-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const handleCertificateDownload = (achievement: Achievement) => {
    if (achievement.certificate_url) {
      window.open(achievement.certificate_url, '_blank');
    } else {
      toast({
        title: "Certificate Downloaded",
        description: `${achievement.title} certificate has been downloaded`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements & Certificates
          </DialogTitle>
          <DialogDescription>
            Your academic accomplishments and earned certificates
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {achievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No achievements earned yet</p>
              <p className="text-sm mt-2">Keep working hard to earn your first achievement!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className={`border-2 ${getAchievementColor(achievement.achievement_type)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="mt-1">
                          {getAchievementIcon(achievement.achievement_type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{achievement.title}</h4>
                            <Badge variant="outline" className="text-xs capitalize">
                              {achievement.achievement_type}
                            </Badge>
                          </div>
                          
                          {achievement.description && (
                            <p className="text-sm text-muted-foreground mb-3">
                              {achievement.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(achievement.issued_date)}
                            </div>
                            
                            {achievement.grade_score && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                Score: {achievement.grade_score}%
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {achievement.certificate_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCertificateDownload(achievement)}
                          className="shrink-0"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Certificate
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} earned
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};