import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Função checkout iniciada.')

serve(async (req) => {
  // 1. Trata CORS (Pré-flight)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 2. Inicializa Stripe e Supabase
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
      apiVersion: '2022-11-15',
      httpClient: Stripe.createFetchHttpClient(),
    })

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    // 3. Pega o usuário logado
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Usuário não autenticado.')
    }

    // 4. Pega o price_id do corpo da requisição
    const { priceId } = await req.json()
    if (!priceId) {
        throw new Error('Price ID não fornecido.')
    }

    // 5. Pega a URL do frontend (para redirecionamento)
    // Se não estiver definida, usa localhost como fallback
    const frontendUrl = Deno.env.get('FRONTEND_URL') || 'http://localhost:3000'

    // 6. Cria a Sessão de Checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // O ID que começa com price_...
          quantity: 1,
        },
      ],
      mode: 'subscription', // Ou 'payment' se for pagamento único
      success_url: `${frontendUrl}/?session_id={CHECKOUT_SESSION_ID}`, // Redireciona para Home com sucesso
      cancel_url: `${frontendUrl}/planos`, // Redireciona para Planos se cancelar
      customer_email: user.email, // Preenche o email automaticamente
      metadata: {
        user_id: user.id, // Importante: Salva o ID do usuário no Stripe para usarmos no Webhook depois
      },
    })

    // 7. Retorna a URL da sessão para o frontend
    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Erro no checkout:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})