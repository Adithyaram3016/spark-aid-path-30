import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Download, ExternalLink, FileText, Play, Search } from 'lucide-react';
import type { StudyResource } from '@/hooks/useStudentData';

interface ResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  resources: StudyResource[];
}

export const ResourcesDialog = ({ open, onOpenChange, resources }: ResourcesDialogProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const { toast } = useToast();

  const subjects = ['all', ...Array.from(new Set(resources.map(r => r.subject)))];

  const filteredResources = resources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'pdf': return <FileText className="h-4 w-4" />;
      case 'link': return <ExternalLink className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const handleResourceAccess = (resource: StudyResource) => {
    if (resource.external_url) {
      window.open(resource.external_url, '_blank');
    } else if (resource.file_url) {
      // Simulate file download
      toast({
        title: "Downloading Resource",
        description: `${resource.title} is being downloaded...`,
      });
    } else {
      toast({
        title: "Resource Unavailable",
        description: "This resource is currently not accessible.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Resources
          </DialogTitle>
          <DialogDescription>
            Access learning materials, documents, and study guides
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>
                  {subject === 'all' ? 'All Subjects' : subject.charAt(0).toUpperCase() + subject.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Resources List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {filteredResources.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No resources found matching your criteria</p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <Card key={resource.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getResourceIcon(resource.resource_type)}
                          <h4 className="font-semibold">{resource.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {resource.subject}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {resource.resource_type}
                          </Badge>
                        </div>
                        {resource.description && (
                          <p className="text-sm text-muted-foreground mb-3">
                            {resource.description}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleResourceAccess(resource)}
                        className="shrink-0"
                      >
                        {resource.resource_type === 'link' ? (
                          <>
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Open
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

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