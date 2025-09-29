-- Add missing RLS policies for Student_info table if it exists

-- Check if Student_info table exists and add basic policies
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'Student_info' AND table_schema = 'public') THEN
        -- Add basic policies for Student_info table
        CREATE POLICY "Allow all access to Student_info" 
        ON public."Student_info" 
        FOR ALL 
        USING (true)
        WITH CHECK (true);
    END IF;
END
$$;