/*
  # Initial Schema Setup for Talent Management System

  1. New Tables
    - `profiles`
      - Stores talent profile information
      - Includes approval status and registration details
    - `skills`
      - Stores available skills/expertise options
    - `profile_skills`
      - Junction table for profile-skill relationships
    - `hire_requests`
      - Stores client hiring requests
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for admin access
*/

-- Create enum for profile status
CREATE TYPE profile_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  description text,
  photo_url text,
  status profile_status DEFAULT 'pending',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create skills table
CREATE TABLE IF NOT EXISTS skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Create profile_skills junction table
CREATE TABLE IF NOT EXISTS profile_skills (
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  skill_id uuid REFERENCES skills(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, skill_id)
);

-- Create hire_requests table
CREATE TABLE IF NOT EXISTS hire_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES auth.users(id),
  talent_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  message text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE hire_requests ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (status = 'approved' OR auth.uid() IN (
    SELECT id FROM profiles WHERE is_admin = true
  ));

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policies for skills
CREATE POLICY "Skills are viewable by everyone"
  ON skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can manage skills"
  ON skills FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- Policies for profile_skills
CREATE POLICY "Profile skills are viewable by everyone"
  ON profile_skills FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own profile skills"
  ON profile_skills FOR ALL
  USING (
    profile_id = auth.uid() OR
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

-- Policies for hire_requests
CREATE POLICY "Users can view their own hire requests"
  ON hire_requests FOR SELECT
  USING (
    client_id = auth.uid() OR
    talent_id = auth.uid() OR
    auth.uid() IN (
      SELECT id FROM profiles WHERE is_admin = true
    )
  );

CREATE POLICY "Authenticated users can create hire requests"
  ON hire_requests FOR INSERT
  TO authenticated
  WITH CHECK (client_id = auth.uid());

-- Insert some initial skills
INSERT INTO skills (name) VALUES
  ('Web Development'),
  ('Mobile Development'),
  ('UI/UX Design'),
  ('Data Science'),
  ('DevOps'),
  ('Digital Marketing'),
  ('Content Writing'),
  ('Graphic Design'),
  ('Project Management'),
  ('Business Analysis');