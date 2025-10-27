import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importa nosso hook
import Layout from './Layout'; // Importa o Layout principal

// Este componente verifica se o usuário está logado.
// Se sim, renderiza o Layout e as rotas filhas (Outlet).
// Se não, redireciona para a página de login.
const ProtectedRoute = () => {
  const { user } = useAuth(); // Pega o usuário do contexto

  if (!user) {
    // Usuário não logado, redireciona para /login
    // O 'replace' evita que o usuário volte para a rota protegida clicando em "Voltar" no navegador
    return <Navigate to="/login" replace />;
  }

  // Usuário logado, renderiza o Layout padrão envolvendo as rotas filhas
  return (
    <Layout>
      <Outlet /> {/* Outlet renderiza o componente da rota filha correspondente */}
    </Layout>
  );
};

export default ProtectedRoute;