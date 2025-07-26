-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  transport_cost DECIMAL(10,2) DEFAULT 0,
  accommodation_cost DECIMAL(10,2) DEFAULT 0,
  attractions_cost DECIMAL(10,2) DEFAULT 0,
  food_cost DECIMAL(10,2) DEFAULT 0,
  shopping_cost DECIMAL(10,2) DEFAULT 0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  transport_details JSONB,
  accommodation_details JSONB,
  attractions_details JSONB,
  food_details JSONB,
  shopping_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their own trips
CREATE POLICY "Users can view own trips" ON trips
  FOR SELECT USING (auth.uid() = user_id);

-- Policy for users to insert their own trips
CREATE POLICY "Users can insert own trips" ON trips
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own trips
CREATE POLICY "Users can update own trips" ON trips
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy for users to delete their own trips
CREATE POLICY "Users can delete own trips" ON trips
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS trips_user_id_idx ON trips(user_id);
CREATE INDEX IF NOT EXISTS trips_destination_idx ON trips(destination);
CREATE INDEX IF NOT EXISTS trips_updated_at_idx ON trips(updated_at DESC);
