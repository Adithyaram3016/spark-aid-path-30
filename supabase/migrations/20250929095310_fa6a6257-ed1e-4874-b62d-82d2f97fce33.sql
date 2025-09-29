-- Fix RLS policy for study_resources table by adding proper policies

-- Create more specific policies for study_resources table
CREATE POLICY "Students can insert study resources" 
ON public.study_resources 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Students can update study resources" 
ON public.study_resources 
FOR UPDATE 
USING (true);

CREATE POLICY "Students can delete study resources" 
ON public.study_resources 
FOR DELETE 
USING (true);