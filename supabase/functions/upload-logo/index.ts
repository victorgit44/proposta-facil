// supabase/functions/upload-logo/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts' // Use a versão mais estável se necessário
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts' // Importa os cabeçalhos CORS

console.log('Função upload-logo iniciada.')

serve(async (req) => {
  // Trata a requisição OPTIONS (pré-verificação CORS)
  if (req.method === 'OPTIONS') {
    console.log('Recebida requisição OPTIONS');
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log(`Recebida requisição ${req.method}`);
    // 1. Cria um cliente Supabase que usa a service_role (ignora RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
        throw new Error('Variáveis de ambiente SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontradas.');
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
        }
    });

    console.log('Cliente Supabase Admin criado.');

    // 2. Extrai o arquivo da requisição (espera FormData)
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
        throw new Error('Content-Type inválido. Esperado multipart/form-data.');
    }
    
    const formData = await req.formData();
    // --- CORREÇÃO APLICADA AQUI ---
    const fileData = formData.get('logoFile'); // Pega o dado do FormData

    // Verifica se o dado recebido é realmente um objeto File
    if (!(fileData instanceof File)) {
      // Se não for um File, ou se for nulo/undefined, lança um erro
      throw new Error('Campo "logoFile" não é um arquivo válido ou não foi encontrado.');
    }
    
    // Agora podemos usar 'fileData' sabendo que é um File
    const file = fileData; 
    // --- FIM DA CORREÇÃO ---

    console.log(`Arquivo recebido: ${file.name}, Tamanho: ${file.size}, Tipo: ${file.type}`);

    // Validações adicionais
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)) {
       throw new Error('Tipo de arquivo inválido. Apenas PNG ou JPG são permitidos.');
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
        throw new Error('Arquivo muito grande. O limite é 5MB.');
    }


    // 3. Define o nome e caminho no Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `logo-${crypto.randomUUID()}.${fileExt}`; 
    const filePath = `${fileName}`; 

    console.log(`Fazendo upload para o bucket 'logo' com path: ${filePath}`);

    // 4. Faz o upload usando o cliente Admin
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('logo') // NOME DO SEU BUCKET
      .upload(filePath, file, {
        cacheControl: '3600', 
        upsert: false, 
        contentType: file.type 
      });

    if (uploadError) {
      console.error('Erro no upload para o Supabase Storage:', uploadError);
      throw new Error(`Erro no Supabase Storage: ${uploadError.message || 'Detalhes indisponíveis'}`);
    }

    console.log('Upload para o Storage bem-sucedido:', uploadData);

    // 5. Obtém a URL pública do arquivo
    const uploadedFilePath = uploadData?.path;
     if (!uploadedFilePath) {
         throw new Error('O upload não retornou um caminho de arquivo válido.');
     }
    
    const { data: publicURLData } = supabaseAdmin.storage
      .from('logo') // NOME DO SEU BUCKET
      .getPublicUrl(uploadedFilePath); 

    if (!publicURLData || !publicURLData.publicUrl) {
        console.error('Não foi possível obter a URL pública.');
        await supabaseAdmin.storage.from('logo').remove([uploadedFilePath]);
        throw new Error('Não foi possível obter a URL pública após o upload.');
    }

    const publicUrl = publicURLData.publicUrl;
    console.log('URL Pública obtida:', publicUrl);

    // 6. Retorna a URL pública em JSON
    return new Response(
      JSON.stringify({ logoUrl: publicUrl }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Erro não tratado na função:', error);
    const status = (error instanceof Error && (error.message.includes('inválido') || error.message.includes('Nenhum arquivo'))) ? 400 : 500;
    return new Response(
      JSON.stringify({ error: error.message || 'Erro interno do servidor.' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: status,
      }
    )
  }
})