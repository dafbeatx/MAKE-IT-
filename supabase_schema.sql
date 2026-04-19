-- ==========================================
-- SUPABASE SQL SCHEMA: MAKE!T PLATFORM
-- ==========================================

-- 1. Create table for Documents
CREATE TABLE public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    doc_type VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    nim_nip VARCHAR(50) NOT NULL,
    format_type VARCHAR(50) DEFAULT 'Standar A',
    sistematika JSONB DEFAULT '[]'::jsonb,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Document History (Chat logs & Revisions)
CREATE TABLE public.document_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Set up Row Level Security (RLS)
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_history ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS Policies for Documents
-- Policy: Users can only see their own documents
CREATE POLICY "Users can view their own documents" 
ON public.documents FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert their own documents" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own documents
CREATE POLICY "Users can update their own documents" 
ON public.documents FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own documents
CREATE POLICY "Users can delete their own documents" 
ON public.documents FOR DELETE 
USING (auth.uid() = user_id);

-- 5. Create RLS Policies for Document History
CREATE POLICY "Users can view history of their own documents" 
ON public.document_history FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.documents
    WHERE public.documents.id = document_history.document_id
    AND public.documents.user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert history to their own documents" 
ON public.document_history FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.documents
    WHERE public.documents.id = document_history.document_id
    AND public.documents.user_id = auth.uid()
  )
);

-- 6. Trigger for updated_at Auto-update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_documents_modtime
BEFORE UPDATE ON public.documents
FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- ==========================================
-- STORAGE SETUP (For .docx and .sav files)
-- ==========================================
-- Make sure to create a bucket named 'user-documents' in the Supabase Dashboard
INSERT INTO storage.buckets (id, name, public) VALUES ('user-documents', 'user-documents', false);

CREATE POLICY "Users can upload limits to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
