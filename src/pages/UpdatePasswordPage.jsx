import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/api/supabaseClient'; // Importe o cliente Supabase
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext'; // Importar useAuth para verificar o usuário

const LogoIcon = () => (
  // Seu componente LogoIcon
  <svg className="w-8 h-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M12 18.5l-2-1m2 1l2-1m-2 1V16M6 7l2 1m-2-1l2-1m-2 1V10M4 14l2-1m-2 1l2 1m-2-1V11.5" />
  </svg>
);

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Usamos o useAuth para saber se o evento PASSWORD_RECOVERY foi detectado
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [readyToUpdate, setReadyToUpdate] = useState(false); // Controla se o form aparece

  useEffect(() => {
    // O AuthProvider já lida com o evento 'PASSWORD_RECOVERY' e atualiza o 'user'.
    // Se o 'user' existe ao chegar nesta página, significa que o token do email foi validado.
    if (user) {
      setReadyToUpdate(true);
      console.log('Token de recuperação validado. Usuário:', user);
    } else {
        // Se o usuário não estiver presente após o carregamento inicial do AuthProvider,
        // pode ser um acesso inválido ou o token expirou.
        // (O AuthProvider pode levar um momento para carregar, então esperamos ele)
        console.log('Aguardando validação do token ou acesso inválido.');
        // Poderíamos redirecionar após um tempo se 'user' continuar null, mas o AuthProvider
        // já cuida da sessão, então se não houver 'user', não estamos no estado de recuperação.
         setError('Token inválido ou expirado. Solicite um novo link de recuperação.');
    }

    // Monitorar o evento especificamente aqui é uma alternativa, mas o AuthProvider já faz isso.
    // const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
    //   if (event === "PASSWORD_RECOVERY") {
    //      console.log("Evento PASSWORD_RECOVERY detectado.");
    //      setReadyToUpdate(true);
    //   }
    // });
    // return () => authListener?.subscription.unsubscribe();

  }, [user]); // Reage à mudança no estado do usuário vindo do AuthProvider


  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
        setError('A senha deve ter pelo menos 6 caracteres.');
        return;
    }


    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Usa a função para atualizar o usuário (senha)
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw updateError;
      }

      console.log('Senha atualizada com sucesso:', data);
      setSuccessMessage('Senha atualizada com sucesso! Você será redirecionado para o login.');
      // Opcional: deslogar o usuário após atualizar a senha
      // await supabase.auth.signOut(); 
      setTimeout(() => navigate('/login'), 3000); // Redireciona após 3s

    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError(err.message || 'Falha ao atualizar a senha. Tente novamente.');
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
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
              {readyToUpdate ? 'Set a new password' : 'Validating link...'}
            </h2>
             {!readyToUpdate && !error && (
                 <p className="mt-2 text-sm text-slate-400">Please wait while we verify your request.</p>
             )}
              {readyToUpdate && (
                   <p className="mt-2 text-sm text-slate-400">Enter your new password below.</p>
             )}
          </div>

          <div className="mt-8">

            {/* Mensagem de Sucesso */}
            {successMessage && (
                 <div className="mb-4 rounded-md bg-green-900/30 p-4 border border-green-500/50 flex items-center gap-3">
                     <CheckCircle className="w-5 h-5 text-green-400" />
                     <p className="text-sm text-green-400">{successMessage}</p>
                  </div>
            )}
             {/* Mensagem de Erro */}
            {error && (
                  <div className="mb-4 rounded-md bg-red-900/30 p-4 border border-red-500/50">
                     <p className="text-sm text-red-400">{error}</p>
                     {!readyToUpdate && ( // Adiciona link para solicitar novo se o token for inválido
                          <Link to="/forgot-password" className="mt-2 text-sm font-medium text-blue-500 hover:text-blue-400 block">
                              Request a new password reset link
                          </Link>
                     )}
                  </div>
              )}

            {/* Mostra o formulário apenas se o token foi validado (readyToUpdate) */}
            {readyToUpdate && !successMessage && (
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                    New Password
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
                      disabled={loading}
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

                 <div className="relative">
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300">
                    Confirm New Password
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
                      disabled={loading}
                      className="block w-full appearance-none rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50"
                  >
                    {loading ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</>
                      ) : (
                        <> <Lock className="mr-2 h-4 w-4" /> Update Password </>
                      )
                    }
                  </button>
                </div>
              </form>
            )}
             {/* Mostra um loader enquanto valida o link */}
             {!readyToUpdate && !error && !successMessage && (
                  <div className="flex justify-center pt-8">
                      <Loader2 size={32} className="text-blue-500 animate-spin" />
                  </div>
             )}

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