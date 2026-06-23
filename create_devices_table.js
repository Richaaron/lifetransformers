const { createClient } = require('@supabase/supabase-js');

const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxaGRkeGN2cHV3dW5rYWN3dHFsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjE0MDUyNiwiZXhwIjoyMDk3NzE2NTI2fQ.B1vKxyY84p8UzqzQ-w5_-E--ZxboLs989rug18lzQI0';
const SUPABASE_URL = 'https://vqhddxcvpuwunkacwtql.supabase.co';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function run() {
  console.log('Creating user_devices table...');
  
  const sql = `
    CREATE TABLE IF NOT EXISTS public.user_devices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      device_token UUID NOT NULL,
      user_agent TEXT,
      ip_address TEXT,
      last_seen_at TIMESTAMPTZ DEFAULT NOW(),
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, device_token)
    );
    ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;
    DO \$\$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='user_devices' AND policyname='Users can view own devices') THEN
        CREATE POLICY "Users can view own devices" ON public.user_devices FOR SELECT USING (auth.uid() = user_id);
      END IF;
    END \$\$;
  `;

  // Use the postgres query API via supabase client
  const res = await fetch(SUPABASE_URL + '/rest/v1/rpc/exec_sql', {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': 'Bearer ' + SERVICE_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql })
  });
  
  // Actually, we don't have exec_sql rpc. 
  // Remember we failed to run raw SQL previously without using the dashboard. 
  console.log('Wait, I cannot run raw SQL via RPC because exec_sql is not defined.');
}

run().catch(console.error);
