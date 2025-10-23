// Simulação do cliente base44 para rodar localmente
const createMockStorage = (entityName) => {
  const storageKey = `mock_${entityName}`
  
  return {
    list: async (sortBy = '-created_date', limit = 1000) => {
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return data.sort((a, b) => {
        const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
        const order = sortBy.startsWith('-') ? -1 : 1
        return order * (new Date(b[field]) - new Date(a[field]))
      }).slice(0, limit)
    },

    filter: async (filters, sortBy = '-created_date', limit = 100) => {
      const data = JSON.parse(localStorage.getItem(storageKey) || '[]')
      return data
        .filter(item => {
          return Object.entries(filters).every(([key, value]) => item[key] === value)
        })
        .sort((a, b) => {
          const field = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy
          const order = sortBy.startsWith('-') ? -1 : 1
          return order * (new Date(b[field]) - new Date(a[field]))
        })
        .slice(0, limit)
    },

    create: async (data) => {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const newItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString(),
        created_by: 'user@email.com',
        ...data
      }
      items.push(newItem)
      localStorage.setItem(storageKey, JSON.stringify(items))
      return newItem
    },

    update: async (id, data) => {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const index = items.findIndex(item => item.id === id)
      if (index !== -1) {
        items[index] = {
          ...items[index],
          ...data,
          updated_date: new Date().toISOString()
        }
        localStorage.setItem(storageKey, JSON.stringify(items))
        return items[index]
      }
      throw new Error('Item não encontrado')
    },

    delete: async (id) => {
      const items = JSON.parse(localStorage.getItem(storageKey) || '[]')
      const filtered = items.filter(item => item.id !== id)
      localStorage.setItem(storageKey, JSON.stringify(filtered))
      return true
    },

    schema: () => ({
      type: 'object',
      properties: {}
    })
  }
}

export const base44 = {
  entities: {
    Proposta: createMockStorage('Proposta'),
    Contrato: createMockStorage('Contrato'),
    ConfiguracaoEmpresa: createMockStorage('ConfiguracaoEmpresa'),
    Assinatura: createMockStorage('Assinatura'),
    User: createMockStorage('User'),
  },

  auth: {
    me: async () => {
      const user = JSON.parse(localStorage.getItem('mock_current_user') || 'null')
      if (!user) {
        const defaultUser = {
          id: '1',
          email: 'usuario@exemplo.com',
          full_name: 'Usuário Teste',
          role: 'admin'
        }
        localStorage.setItem('mock_current_user', JSON.stringify(defaultUser))
        return defaultUser
      }
      return user
    },

    updateMe: async (data) => {
      const user = await base44.auth.me()
      const updated = { ...user, ...data }
      localStorage.setItem('mock_current_user', JSON.stringify(updated))
      return updated
    },

    logout: (redirectUrl) => {
      localStorage.removeItem('mock_current_user')
      if (redirectUrl) {
        window.location.href = redirectUrl
      } else {
        window.location.reload()
      }
    },

    isAuthenticated: async () => {
      return !!localStorage.getItem('mock_current_user')
    }
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        // Simular upload convertendo para base64
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            resolve({ file_url: reader.result })
          }
          reader.readAsDataURL(file)
        })
      },

      InvokeLLM: async ({ prompt }) => {
        // Resposta mock da IA
        return {
          response: `Resposta simulada para: "${prompt}". Este é um ambiente de desenvolvimento local.`
        }
      }
    }
  }
}