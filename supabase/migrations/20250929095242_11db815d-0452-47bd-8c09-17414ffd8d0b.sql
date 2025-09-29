-- Create tables for student dashboard functionality

-- Students table for user profiles
CREATE TABLE public.students (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  student_id TEXT NOT NULL UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  class TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policies for students
CREATE POLICY "Students can view their own profile" 
ON public.students 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Students can update their own profile" 
ON public.students 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Fee payments table
CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  payment_date TIMESTAMP WITH TIME ZONE,
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own fee payments" 
ON public.fee_payments 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Counseling sessions table
CREATE TABLE public.counseling_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  counselor_name TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('individual', 'group', 'academic', 'career', 'personal')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.counseling_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own counseling sessions" 
ON public.counseling_sessions 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

CREATE POLICY "Students can create counseling sessions" 
ON public.counseling_sessions 
FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Tutoring sessions table
CREATE TABLE public.tutoring_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  tutor_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  notes TEXT,
  meeting_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.tutoring_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own tutoring sessions" 
ON public.tutoring_sessions 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

CREATE POLICY "Students can create tutoring sessions" 
ON public.tutoring_sessions 
FOR INSERT 
WITH CHECK (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Study resources table
CREATE TABLE public.study_resources (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('pdf', 'video', 'link', 'document', 'quiz')),
  file_url TEXT,
  external_url TEXT,
  class_level TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.study_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view active study resources" 
ON public.study_resources 
FOR SELECT 
USING (is_active = true);

-- Student schedules table
CREATE TABLE public.student_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  subject TEXT NOT NULL,
  teacher_name TEXT NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own schedule" 
ON public.student_schedules 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id),
  title TEXT NOT NULL,
  description TEXT,
  achievement_type TEXT NOT NULL CHECK (achievement_type IN ('academic', 'attendance', 'behavior', 'extracurricular', 'certificate')),
  grade_score DECIMAL(5,2),
  issued_date DATE NOT NULL,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view their own achievements" 
ON public.achievements 
FOR SELECT 
USING (student_id IN (SELECT id FROM public.students WHERE user_id = auth.uid()));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_students_updated_at
BEFORE UPDATE ON public.students
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
BEFORE UPDATE ON public.fee_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_counseling_sessions_updated_at
BEFORE UPDATE ON public.counseling_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tutoring_sessions_updated_at
BEFORE UPDATE ON public.tutoring_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_resources_updated_at
BEFORE UPDATE ON public.study_resources
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_student_schedules_updated_at
BEFORE UPDATE ON public.student_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at
BEFORE UPDATE ON public.achievements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();