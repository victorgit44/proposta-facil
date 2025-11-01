import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '@/api/supabaseClient';
// Não precisamos mais de 'base44' ou 'PLAN_LIMITS' neste arquivo

// Cria o Contexto
const AuthContext = createContext(null);

// Cria o Provedor do Contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Apenas loading do *usuário*

  useEffect(() => {
    // onAuthStateChange dispara imediatamente na carga inicial e em login/logout
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth Event (Context):', event); // Log para depuração
        const currentUser = session?.user ?? null;
        setUser(currentUser); // Define o usuário (ou null se deslogado)
        setLoading(false); // Marca que o carregamento do *usuário* terminou
      }
    );

    // Limpa o listener
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []); // Roda apenas uma vez

  // O valor que será compartilhado (agora sem assinatura/limits)
  const value = {
    user,
    loading, // Estado de loading do Auth
    signOut: () => supabase.auth.signOut(),
  };

  // Não renderiza a aplicação (children) até que o loading inicial do *usuário* termine
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};