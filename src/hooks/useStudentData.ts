import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  user_id: string;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  class: string;
  phone?: string;
}

export interface FeePayment {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  transaction_id?: string;
  student_id: string;
  created_at: string;
  updated_at: string;
}

export interface CounselingSession {
  id: string;
  counselor_name: string;
  session_type: string;
  status: string;
  scheduled_date: string;
  duration_minutes: number;
  meeting_link?: string;
}

export interface TutoringSession {
  id: string;
  tutor_name: string;
  subject: string;
  status: string;
  scheduled_date: string;
  duration_minutes: number;
  meeting_link?: string;
}

export interface StudyResource {
  id: string;
  title: string;
  description?: string;
  subject: string;
  resource_type: string;
  file_url?: string;
  external_url?: string;
}

export interface StudentSchedule {
  id: string;
  subject: string;
  teacher_name: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room_number?: string;
}

export interface Achievement {
  id: string;
  title: string;
  description?: string;
  achievement_type: string;
  grade_score?: number;
  issued_date: string;
  certificate_url?: string;
}

export const useStudentData = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [feePayments, setFeePayments] = useState<FeePayment[]>([]);
  const [counselingSessions, setCounselingSessions] = useState<CounselingSession[]>([]);
  const [tutoringSessions, setTutoringSessions] = useState<TutoringSession[]>([]);
  const [studyResources, setStudyResources] = useState<StudyResource[]>([]);
  const [schedule, setSchedule] = useState<StudentSchedule[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch student profile
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (studentError) {
        console.error('Error fetching student:', studentError);
        setLoading(false);
        return;
      }

      setStudent(studentData);

      if (studentData) {
        // Fetch all related data
        await Promise.all([
          fetchFeePayments(studentData.id),
          fetchCounselingSessions(studentData.id),
          fetchTutoringSessions(studentData.id),
          fetchStudyResources(),
          fetchSchedule(studentData.id),
          fetchAchievements(studentData.id),
        ]);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      toast({
        title: "Error",
        description: "Failed to load student data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchFeePayments = async (studentId: string) => {
    const { data, error } = await supabase
      .from('fee_payments')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching fee payments:', error);
    } else {
      setFeePayments((data || []) as FeePayment[]);
    }
  };

  const fetchCounselingSessions = async (studentId: string) => {
    const { data, error } = await supabase
      .from('counseling_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching counseling sessions:', error);
    } else {
      setCounselingSessions(data || []);
    }
  };

  const fetchTutoringSessions = async (studentId: string) => {
    const { data, error } = await supabase
      .from('tutoring_sessions')
      .select('*')
      .eq('student_id', studentId)
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching tutoring sessions:', error);
    } else {
      setTutoringSessions(data || []);
    }
  };

  const fetchStudyResources = async () => {
    const { data, error } = await supabase
      .from('study_resources')
      .select('*')
      .eq('is_active', true)
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching study resources:', error);
    } else {
      setStudyResources(data || []);
    }
  };

  const fetchSchedule = async (studentId: string) => {
    const { data, error } = await supabase
      .from('student_schedules')
      .select('*')
      .eq('student_id', studentId)
      .eq('is_active', true)
      .order('day_of_week', { ascending: true });

    if (error) {
      console.error('Error fetching schedule:', error);
    } else {
      setSchedule(data || []);
    }
  };

  const fetchAchievements = async (studentId: string) => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('student_id', studentId)
      .order('issued_date', { ascending: false });

    if (error) {
      console.error('Error fetching achievements:', error);
    } else {
      setAchievements(data || []);
    }
  };

  return {
    student,
    feePayments,
    counselingSessions,
    tutoringSessions,
    studyResources,
    schedule,
    achievements,
    loading,
    refetch: fetchStudentData,
  };
};