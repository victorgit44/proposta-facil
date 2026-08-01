const API_URL = import.meta.env.VITE_API_URL || '';

// Listeners para onAuthStateChange
const authListeners = new Set();

const notifyAuthListeners = (event, session) => {
  authListeners.forEach(listener => {
    try {
      listener(event, session);
    } catch (err) {
      console.error('Erro em listener do Auth:', err);
    }
  });
};

// Helper genérico para requisições HTTP com Suporte a HttpOnly Cookies & Bearer Token
export async function fetchApi(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Envia HttpOnly Cookies automaticamente
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Erro HTTP ${response.status}`);
  }

  return data;
}

// -------------------------------------------------------------
// CLIENTE AUTH (Substitui supabase.auth)
// -------------------------------------------------------------
export const authClient = {
  signInWithPassword: async ({ email, password }) => {
    const data = await fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    notifyAuthListeners('SIGNED_IN', { user: data.user });

    return { data, error: null };
  },

  signUp: async ({ email, password, options = {} }) => {
    const full_name = options.data?.full_name || email.split('@')[0];
    const data = await fetchApi('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name }),
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    notifyAuthListeners('SIGNED_IN', { user: data.user });

    return { data, error: null };
  },

  signOut: async () => {
    try {
      await fetchApi('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      // Ignora falha de rede ao deslogar
    }
    localStorage.removeItem('token');
    notifyAuthListeners('SIGNED_OUT', null);
    return { error: null };
  },

  getSession: async () => {
    try {
      const data = await fetchApi('/api/auth/me');
      return { data: { session: { user: data.user } }, error: null };
    } catch (err) {
      localStorage.removeItem('token');
      return { data: { session: null }, error: err };
    }
  },

  getUser: async () => {
    const { data, error } = await authClient.getSession();
    return { data: { user: data?.session?.user || null }, error };
  },

  onAuthStateChange: (callback) => {
    authListeners.add(callback);
    
    // Executa verificação inicial imediata
    authClient.getSession().then(({ data }) => {
      callback(data?.session ? 'SIGNED_IN' : 'SIGNED_OUT', data?.session || null);
    });

    return {
      data: {
        subscription: {
          unsubscribe: () => authListeners.delete(callback),
        },
      },
    };
  },

  updateUser: async (userData) => {
    const data = await fetchApi('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return { data, error: null };
  },
};

// -------------------------------------------------------------
// MARIADB API CLIENT / BASE44 ENTITIES
// -------------------------------------------------------------
const createEntityClient = (endpoint) => ({
  list: async () => fetchApi(endpoint),
  listForUser: async () => fetchApi(endpoint),
  get: async (id) => fetchApi(`${endpoint}/${id}`),
  create: async (data) => fetchApi(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  update: async (id, data) => fetchApi(`${endpoint}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: async (id) => fetchApi(`${endpoint}/${id}`, { method: 'DELETE' }),
});

export const base44 = {
  entities: {
    Proposta: createEntityClient('/api/propostas'),
    Contrato: createEntityClient('/api/contratos'),
    ConfiguracaoEmpresa: createEntityClient('/api/configuracoes'),
    Assinatura: createEntityClient('/api/assinaturas'),
  },
  auth: {
    me: async () => {
      const { data } = await authClient.getSession();
      return data?.session?.user || null;
    },
    logout: async () => {
      await authClient.signOut();
      return true;
    },
    isAuthenticated: async () => {
      const { data } = await authClient.getSession();
      return !!data?.session;
    },
  },
};

// Substitutos de RPC e Edge Functions
export const mariadbClient = {
  auth: authClient,
  rpc: async (fnName, params) => {
    if (fnName === 'increment_usage') {
      try {
        await fetchApi('/api/usage/increment', {
          method: 'POST',
          body: JSON.stringify(params),
        });
        return { error: null };
      } catch (err) {
        return { error: err };
      }
    }
    return { error: new Error(`RPC ${fnName} não suportado.`) };
  },
  functions: {
    invoke: async (fnName, options = {}) => {
      if (fnName === 'upload-logo') {
        try {
          const data = await fetchApi('/api/upload-logo', {
            method: 'POST',
            body: JSON.stringify(options.body || {}),
          });
          return { data, error: null };
        } catch (err) {
          return { data: null, error: err };
        }
      }
      return { data: null, error: new Error(`Function ${fnName} não suportada.`) };
    },
  },
};

// Alias export para manter compatibilidade com import { supabase } de arquivos existentes
export const supabase = mariadbClient;
export default mariadbClient;
