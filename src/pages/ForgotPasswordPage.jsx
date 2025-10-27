import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient'; // Importe o cliente Supabase
import { Mail, Loader2, ArrowLeft } from 'lucide-react';

const LogoIcon = () => (
  // Seu componente LogoIcon
  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 18.5l-2-1m2 1l2-1m-2 1V16M6 7l2 1m-2-1l2-1m-2 1V10M4 14l2-1m-2 1l2 1m-2-1V11.5" />
  </svg>
);


export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState(''); // Para mensagens de sucesso ou instrução

  const handlePasswordResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      // Chama a função do Supabase para enviar o email de reset
      const { data, error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        // Opcional: Define para onde o link no email deve redirecionar o usuário DENTRO da sua aplicação React.
        // Se não definido, usará a Site URL configurada no Supabase.
        // É importante que essa rota exista no seu App.jsx e lide com a atualização da senha.
        // Vamos usar '/update-password' como exemplo por enquanto.
        redirectTo: `${window.location.origin}/update-password`, 
      });

      if (resetError) {
        throw resetError;
      }

      console.log('Solicitação de reset enviada:', data);
      setMessage('Se o email estiver cadastrado, você receberá um link para redefinir sua senha.');

    } catch (err) {
      console.error('Erro ao solicitar reset de senha:', err);
      setError(err.message || 'Falha ao enviar solicitação. Tente novamente.');
      setMessage(''); // Limpa a mensagem de sucesso em caso de erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Lado Esquerdo - Formulário */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
           {/* Botão Voltar */}
           <div className="mb-4">
              <Link to="/login" className="flex items-center gap-2 text-sm text-slate-400 hover:text-blue-400 transition">
                  <ArrowLeft size={16} />
                  Voltar para Login
              </Link>
           </div>
           
          <div>
            <LogoIcon />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Forgot your password?</h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter your email address below, and we'll send you a link to reset your password.
            </p>
          </div>

          <div className="mt-8">
            {/* Mensagem de Sucesso/Instrução */}
            {message && !error && (
                 <div className="mb-4 rounded-md bg-green-900/30 p-4 border border-green-500/50">
                     <p className="text-sm text-green-400">{message}</p>
                  </div>
            )}
            {/* Mensagem de Erro */}
            {error && (
                  <div className="mb-4 rounded-md bg-red-900/30 p-4 border border-red-500/50">
                     <p className="text-sm text-red-400">{error}</p>
                  </div>
              )}
              
            <form onSubmit={handlePasswordResetRequest} className="space-y-6">
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
                    disabled={loading || !!message} // Desabilita após enviar
                    className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !!message}
                  className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                >
                  {loading ? (
                      <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <> <Mail className="mr-2 h-4 w-4" /> Send Reset Link </>
                    )
                  }
                </button>
              </div>
            </form>
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