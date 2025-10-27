import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/api/supabaseClient'; // Importe o cliente Supabase

// Cria o Contexto
const AuthContext = createContext(null);

// Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Guarda os dados do usuário logado
  const [loading, setLoading] = useState(true); // Indica se a verificação inicial da sessão está acontecendo

  useEffect(() => {
    // 1. Tenta pegar a sessão atual ao carregar
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Erro ao pegar sessão inicial:", error);
      }
      setUser(session?.user ?? null); // Define o usuário se houver sessão
      setLoading(false); // Marca que a verificação inicial terminou
    };

    getSession();

    // 2. Ouve mudanças no estado de autenticação (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth Event:', event, session); // Log para depuração
        setUser(session?.user ?? null); // Atualiza o usuário no estado
        
        // Se for um login (SIGNED_IN) e a URL tiver #error (ex: falha no OAuth), mostre um alerta
        if (event === 'SIGNED_IN' && window.location.hash.includes('error')) {
            alert('Erro durante o processo de autenticação externa.');
            // Limpa o hash para evitar mostrar o alerta novamente
             window.location.hash = ''; 
        }

        // Se for logout, podemos forçar um reload ou redirecionamento se necessário
        // if (event === 'SIGNED_OUT') navigate('/login'); // Exemplo
      }
    );

    // 3. Limpa o listener quando o componente desmontar
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Roda apenas uma vez ao montar o AuthProvider

  // O valor que será compartilhado pelo Contexto
  const value = {
    user,
    loading, // Exporta o estado de loading inicial
    signOut: () => supabase.auth.signOut(), // Função de logout
    // Você pode adicionar mais funções aqui (ex: signUp, updatePassword) se quiser
  };

  // Retorna o Provedor envolvendo os children (a aplicação)
  // Só renderiza os children DEPOIS que a verificação inicial da sessão terminar
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

// Hook customizado para usar o Contexto de Autenticação facilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};