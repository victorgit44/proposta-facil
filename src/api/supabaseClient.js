import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found! Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para pegar o ID do usuário logado
const getUserId = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
      console.error("Erro ao buscar sessão:", error);
      return null;
  }
  if (!session?.user?.id) {
    console.warn("Tentativa de operação sem usuário logado válido.");
    return null;
  }
  return session.user.id;
}

// --- Client GENÉRICO (SEM filtro user_id automático) ---
const createGenericEntityClient = (tableName) => {
  return {
    list: async (sortBy = '-created_date', limit = 1000) => {
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      const { data, error } = await supabase.from(tableName).select('*').order(field, { ascending }).limit(limit)
      if (error) throw error
      return data || []
    },
    filter: async (filters, sortBy = '-created_date', limit = 100) => {
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      let query = supabase.from(tableName).select('*')
      Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value) })
      const { data, error } = await query.order(field, { ascending }).limit(limit)
      if (error) throw error
      return data || []
    },
    get: async (id) => {
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).single()
      if (error) throw error
      return data
    },
    create: async (rawData) => {
      const { data: result, error } = await supabase.from(tableName).insert([rawData]).select().single()
      if (error) throw error
      return result
    },
    update: async (id, rawData) => {
      const { data: result, error } = await supabase.from(tableName).update(rawData).eq('id', id).select().single()
      if (error) throw error
      return result
    },
    delete: async (id) => {
      const { error } = await supabase.from(tableName).delete().eq('id', id)
      if (error) throw error
      return true
    },
    schema: () => ({ type: 'object', properties: {} })
  }
}


// --- Client PARA DADOS DO USUÁRIO (COM filtro user_id automático) ---
const createOwnedEntityClient = (tableName) => {
  return {
    list: async (sortBy = '-created_date', limit = 1000) => {
      const userId = await getUserId();
      if (!userId) throw new Error("Usuário não autenticado para listar.");
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      const { data, error } = await supabase.from(tableName).select('*').eq('user_id', userId).order(field, { ascending }).limit(limit)
      if (error) throw error
      return data || []
    },
    filter: async (filters, sortBy = '-created_date', limit = 100) => {
       const userId = await getUserId();
       if (!userId) throw new Error("Usuário não autenticado para filtrar.");
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      let query = supabase.from(tableName).select('*').eq('user_id', userId)
      Object.entries(filters).forEach(([key, value]) => { query = query.eq(key, value) })
      const { data, error } = await query.order(field, { ascending }).limit(limit)
      if (error) throw error
      return data || []
    },
    get: async (id) => {
       const userId = await getUserId();
       if (!userId) throw new Error("Usuário não autenticado para obter.");
      const { data, error } = await supabase.from(tableName).select('*').eq('id', id).eq('user_id', userId).single()
      if (error) throw error
      return data
    },
    create: async (rawData) => {
       const userId = await getUserId();
       if (!userId) throw new Error("Usuário não autenticado para criar.");
       const dataWithUser = { ...rawData, user_id: userId };
      // --- Mantendo a MODIFICAÇÃO TEMPORÁRIA (sem .select().single()) ---
      const { error } = await supabase
        .from(tableName)
        .insert([dataWithUser]);
      if (error) throw error;
      console.log(`CREATE owned (sem select) para ${tableName} bem-sucedido.`);
      // Retorna os dados enviados + um ID placeholder
      return { ...dataWithUser, id: 'temp-id-após-criar' };
      // --- FIM DA MODIFICAÇÃO TEMPORÁRIA ---
    },
    update: async (id, rawData) => {
       const userId = await getUserId();
       if (!userId) throw new Error("Usuário não autenticado para atualizar.");
       const dataToUpdate = { ...rawData };
       delete dataToUpdate.user_id;
       // --- Mantendo a MODIFICAÇÃO TEMPORÁRIA (sem .select().single()) ---
       const { error } = await supabase
        .from(tableName)
        .update(dataToUpdate)
        .eq('id', id)
        .eq('user_id', userId);
       if (error) throw error;
       console.log(`UPDATE owned (sem select) para ${tableName} ID ${id} bem-sucedido.`);
        // Retorna os dados enviados para atualização
       return { id: id, ...dataToUpdate };
      // --- FIM DA MODIFICAÇÃO TEMPORÁRIA ---
    },
    delete: async (id) => {
       const userId = await getUserId();
       if (!userId) throw new Error("Usuário não autenticado para deletar.");
      const { error } = await supabase.from(tableName).delete().eq('id', id).eq('user_id', userId)
      if (error) throw error
      return true
    },
    schema: () => ({ type: 'object', properties: {} })
  }
}


// Cliente base44 (com definições completas)
export const base44 = {
  entities: {
    Proposta: createOwnedEntityClient('propostas'),
    Contrato: createOwnedEntityClient('contratos'),
    ConfiguracaoEmpresa: createOwnedEntityClient('configuracoes_empresa'),
    Assinatura: createGenericEntityClient('assinaturas'),
  },
  auth: {
    me: async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session || !session.user) {
        console.warn("Auth.me: Sessão não encontrada ou erro.", sessionError);
        return null; // Retorna null se não houver usuário
      }
      const user = session.user;
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
        role: user.user_metadata?.role || 'user'
      };
    },
    updateMe: async (userData) => {
      const { data: { user }, error } = await supabase.auth.updateUser({
        data: userData // Atualiza user_metadata
      });
      if (error) throw error;
      return user;
    },
    logout: async () => { // Removido redirectUrl não utilizado
      const { error } = await supabase.auth.signOut();
      if(error) {
          console.error("Erro no Logout:", error);
      }
      // Não precisa de reload/redirect aqui, o AuthProvider cuida disso
      return !error;
    },
    isAuthenticated: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return !!session;
    }
  },
  integrations: {
    // Exemplo - mantenha as suas implementações reais
     Core: {
       UploadFile: async ({ file }) => {
         // Esta função não está sendo usada pelo Configuracoes, mas pode ser útil
         console.warn("base44.integrations.Core.UploadFile não implementado ou diferente do upload direto.");
         // Exemplo de implementação (precisaria ajustar bucket, nome, RLS/função):
         // const fileExt = file.name.split('.').pop();
         // const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
         // const filePath = `generic_uploads/${fileName}`;
         // const { data, error } = await supabase.storage.from('public').upload(filePath, file); // Exemplo bucket 'public'
         // if (error) throw error;
         // const { data: { publicUrl } } = supabase.storage.from('public').getPublicUrl(filePath);
         // return { file_url: publicUrl };
         return { file_url: 'nao-implementado' };
       },
       InvokeLLM: async ({ prompt }) => {
         console.log('LLM Prompt (base44):', prompt);
         return { response: 'Resposta simulada da IA (base44). Integre com OpenAI/Webhook para respostas reais.' };
       }
     }
  },
}