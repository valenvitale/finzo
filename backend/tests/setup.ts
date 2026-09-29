process.env.PORT = process.env.PORT || '3000';
process.env.NODE_ENV = 'test';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.SUPABASE_URL =
  process.env.SUPABASE_URL || 'https://test-project.supabase.co';
process.env.SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || 'test-anon-key';
process.env.SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'test-service-role-key';
