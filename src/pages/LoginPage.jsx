import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/api/supabaseClient'; // Importe o cliente Supabase

// Ícones (LogoIcon, GoogleIcon) continuam os mesmos...
const LogoIcon = () => (
  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 18.5l-2-1m2 1l2-1m-2 1V16M6 7l2 1m-2-1l2-1m-2 1V10M4 14l2-1m-2 1l2 1m-2-1V11.5" />
  </svg>
);
const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.712,35.253,44,29.839,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);


export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- Função de Login com Email/Senha ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (signInError) {
        throw signInError; // Joga o erro para o catch
      }

      console.log('Login bem-sucedido:', data);
      navigate('/'); // Redireciona para o Dashboard após login

    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  // --- Função de Login com Google ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    
    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Opcional: Especifique para onde redirecionar após o login do Google
          // Se não especificado, usará as URLs configuradas no Supabase
          // redirectTo: 'http://localhost:3000/' 
        }
      });

      if (oauthError) {
        throw oauthError;
      }
      
      // O redirecionamento para o Google acontecerá automaticamente
      // O usuário voltará para a aplicação e o Supabase cuidará da sessão
      console.log('Redirecionando para o Google...', data);

    } catch (err) {
      console.error('Erro no login com Google:', err);
      setError(err.message || 'Falha ao iniciar login com Google.');
      setLoading(false); // Só desativa o loading se houver erro *antes* do redirect
    } 
    // Não colocamos setLoading(false) aqui porque a página será redirecionada
  };


  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <LogoIcon />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Welcome back!</h2>
            <p className="mt-2 text-sm text-slate-400">
              Don't have an account yet?{' '}
              {/* TODO: Criar a rota e página de SignUp */}
              <Link to="/signup" className="font-medium text-blue-500 hover:text-blue-400">
                Sign up now
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Campos Email e Senha (iguais) */}
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
                    disabled={loading} // Desabilita durante o loading
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
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading} // Desabilita durante o loading
                    className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 pr-10 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50" // Adicionado pr-10
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

              {/* Remember me e Forgot Password (iguais) */}
               <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  {/* TODO: Implementar recuperação de senha */}
                  <a href="#" className="font-medium text-blue-500 hover:text-blue-400">
                    Forgot password?
                  </a>
                </div>
              </div>
              
              {/* Exibe mensagem de erro */}
              {error && (
                  <div className="rounded-md bg-red-900/30 p-4 border border-red-500/50">
                     <p className="text-sm text-red-400">{error}</p>
                  </div>
              )}

              {/* Botão Log in */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </button>
              </div>
            </form>

            {/* Separador OR e Botão Google (iguais) */}
             <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-slate-900 px-2 text-slate-500">OR</span>
                </div>
              </div>

              <div className="mt-6">
                 {/* Botão Google */}
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="flex w-full items-center justify-center rounded-md border border-slate-700 bg-slate-800 py-2 px-4 text-sm font-medium text-slate-300 shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                >
                  <GoogleIcon />
                  Log in with Google
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito - Padrão Geométrico (igual) */}
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