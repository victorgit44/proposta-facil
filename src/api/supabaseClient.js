import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found! Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper para criar operações CRUD
const createEntityClient = (tableName) => {
  return {
    list: async (sortBy = '-created_date', limit = 1000) => {
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order(field, { ascending })
        .limit(limit)
      
      if (error) throw error
      return data || []
    },

    filter: async (filters, sortBy = '-created_date', limit = 100) => {
      const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
      const ascending = !sortBy.startsWith('-')
      
      let query = supabase.from(tableName).select('*')
      
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
      
      const { data, error } = await query
        .order(field, { ascending })
        .limit(limit)
      
      if (error) throw error
      return data || []
    },

    // 👇 ADICIONE ESTA NOVA FUNÇÃO 'GET'
    get: async (id) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .single() // .single() pega um único registro ou dá erro se não achar

      if (error) throw error
      return data
    },

    create: async (data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .insert([data])
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    bulkCreate: async (items) => {
      const { data, error } = await supabase
        .from(tableName)
        .insert(items)
        .select()
      
      if (error) throw error
      return data
    },

    update: async (id, data) => {
      const { data: result, error } = await supabase
        .from(tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return result
    },

    delete: async (id) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    },

    schema: () => ({
      type: 'object',
      properties: {}
    })
  }
}

// Cliente base44 compatível usando Supabase
export const base44 = {
  entities: {
    Proposta: createEntityClient('propostas'),
    Contrato: createEntityClient('contratos'),
    ConfiguracaoEmpresa: createEntityClient('configuracoes_empresa'),
    Assinatura: createEntityClient('assinaturas'),
  },

  auth: {
    me: async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        // Se não houver usuário autenticado, retornar usuário mock para desenvolvimento
        return {
          id: 'dev-user',
          email: 'usuario@exemplo.com',
          full_name: 'Usuário Desenvolvimento',
          role: 'admin'
        }
      }
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || user.email,
        role: user.user_metadata?.role || 'user'
      }
    },

    updateMe: async (data) => {
      const { data: result, error } = await supabase.auth.updateUser({
        data
      })
      
      if (error) throw error
      return result.user
    },

    logout: async (redirectUrl) => {
      await supabase.auth.signOut()
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        window.location.reload()
      }
    },

    isAuthenticated: async () => {
      const { data: { session } } = await supabase.auth.getSession()
      return !!session
    }
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
        const filePath = `uploads/${fileName}`

        const { data, error } = await supabase.storage
          .from('public')
          .upload(filePath, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
          .from('public')
          .getPublicUrl(filePath)

        return { file_url: publicUrl }
      },

      InvokeLLM: async ({ prompt }) => {
        // Simulação - você pode integrar com OpenAI ou outra API
        console.log('LLM Prompt:', prompt)
        return { response: 'Resposta simulada da IA. Integre com OpenAI para respostas reais.' }
      }
    }
  }
}