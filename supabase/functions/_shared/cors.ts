// supabase/functions/_shared/cors.ts
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Permite qualquer origem (para desenvolvimento)
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}