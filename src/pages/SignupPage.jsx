import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/api/supabaseClient'; // Importe o cliente Supabase

// Ícones (LogoIcon, GoogleIcon - Opcional para cadastro)
const LogoIcon = () => (
  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 18.5l-2-1m2 1l2-1m-2 1V16M6 7l2 1m-2-1l2-1m-2 1V10M4 14l2-1m-2 1l2 1m-2-1V11.5" />
  </svg>
);

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Campo extra
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // Mensagem de sucesso

  // --- Função de Cadastro com Email/Senha ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Validação extra: Senhas coincidem?
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        // options: {
        //   data: { // Opcional: Adicionar dados extras ao usuário no cadastro
        //     full_name: 'Nome Padrão', 
        //   }
        // }
      });

      if (signUpError) {
        throw signUpError;
      }

      console.log('Cadastro bem-sucedido:', data);
      
      // Mensagem de sucesso (considerando se a confirmação de email está ATIVA ou NÃO)
      if (data.user?.identities?.length === 0) {
           // Provavelmente a confirmação de email está ATIVA no Supabase
           setSuccessMessage('Cadastro realizado! Verifique seu email para confirmar a conta.');
           // Não redireciona, espera a confirmação
      } else {
           // Provavelmente a confirmação de email está DESATIVADA
           setSuccessMessage('Cadastro realizado com sucesso! Redirecionando para login...');
           setTimeout(() => navigate('/login'), 2000); // Redireciona para login após 2s
      }


    } catch (err) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Falha no cadastro. Verifique os dados ou tente outro email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <LogoIcon />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Create your account</h2>
            <p className="mt-2 text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400">
                Log in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            {/* Mensagem de Sucesso */}
            {successMessage && (
                 <div className="mb-4 rounded-md bg-green-900/30 p-4 border border-green-500/50">
                     <p className="text-sm text-green-400">{successMessage}</p>
                  </div>
            )}
            
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || !!successMessage} // Desabilita após sucesso
                    className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || !!successMessage}
                    className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                   >
                     {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
               {/* Campo Confirmar Senha */}
               <div className="relative">
                <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading || !!successMessage}
                    className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                   {/* O botão de mostrar/esconder afeta ambos os campos */}
                </div>
              </div>

              {/* Exibe mensagem de erro */}
              {error && (
                  <div className="rounded-md bg-red-900/30 p-4 border border-red-500/50">
                     <p className="text-sm text-red-400">{error}</p>
                  </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading || !!successMessage}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Sign up'}
                </button>
              </div>
            </form>

            {/* Opcional: Adicionar "OR sign up with Google" aqui se desejar */}
            
          </div>
        </div>
      </div>

      {/* Lado Direito - Padrão Geométrico */}
       <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-slate-900 to-blue-900/30">
         <div className="absolute inset-0 grid grid-cols-4 gap-4 opacity-10 p-4">
             {[...Array(16)].map((_, i) => (
               <div key={i} className="aspect-square bg-blue-700 rounded-lg animate-pulse" style={{ animationDelay: `${i * 50}ms` }}></div>
             ))}
         </div>
      </div>
    </div>
  );
}