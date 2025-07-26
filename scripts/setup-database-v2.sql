-- Drop existing tables if they exist
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Create user_profiles table for additional user information
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  date_of_birth DATE,
  preferred_currency TEXT DEFAULT 'INR',
  notification_preferences JSONB DEFAULT '{"email": true, "push": true}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table with enhanced structure
CREATE TABLE trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  destination TEXT NOT NULL,
  trip_name TEXT,
  trip_status TEXT DEFAULT 'planning' CHECK (trip_status IN ('planning', 'booked', 'completed', 'cancelled')),
  start_date DATE,
  end_date DATE,
  
  -- Cost breakdown
  transport_cost DECIMAL(10,2) DEFAULT 0,
  accommodation_cost DECIMAL(10,2) DEFAULT 0,
  attractions_cost DECIMAL(10,2) DEFAULT 0,
  food_cost DECIMAL(10,2) DEFAULT 0,
  shopping_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Detailed information stored as JSON
  transport_details JSONB DEFAULT '{}',
  accommodation_details JSONB DEFAULT '{}',
  attractions_details JSONB DEFAULT '{}',
  food_details JSONB DEFAULT '{}',
  shopping_details JSONB DEFAULT '{}',
  
  -- Additional trip metadata
  notes TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  shared_with TEXT[], -- Array of user IDs who can view this trip
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking login history
CREATE TABLE user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_end TIMESTAMP WITH TIME ZONE,
  ip_address INET,
  user_agent TEXT,
  device_info JSONB DEFAULT '{}'
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (
    auth.uid() = user_id OR 
    auth.uid() = ANY(shared_with)
  );

CREATE POLICY "Users can insert own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_sessions
CREATE POLICY "Users can view own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX user_profiles_email_idx ON user_profiles(email);
CREATE INDEX user_profiles_updated_at_idx ON user_profiles(updated_at DESC);

CREATE INDEX trips_user_id_idx ON trips(user_id);
CREATE INDEX trips_destination_idx ON trips(destination);
CREATE INDEX trips_status_idx ON trips(trip_status);
CREATE INDEX trips_dates_idx ON trips(start_date, end_date);
CREATE INDEX trips_updated_at_idx ON trips(updated_at DESC);
CREATE INDEX trips_favorite_idx ON trips(is_favorite) WHERE is_favorite = true;

CREATE INDEX user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX user_sessions_start_idx ON user_sessions(session_start DESC);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trips_updated_at 
  BEFORE UPDATE ON trips 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data for testing (optional)
-- This will only work after you have users in your system
