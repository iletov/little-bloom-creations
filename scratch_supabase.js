const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kchuerrrntebpxzgyzdt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjaHVlcnJybnRlYnB4emd5emR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3ODA0MjYsImV4cCI6MjA3NDM1NjQyNn0.Cu3GV2vvQY4oMMzoJiCOwaBoDNY0wNsMMvmq0RXycyg';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSku() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('sku', 'GEN-01');
    
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Result:', data);
  }
}

checkSku();
