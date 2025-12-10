import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'

console.log('Função Webhook iniciada.')

serve(async (req) => {
  const signature = req.headers.get('Stripe-Signature')

  // 1. Inicializa o Stripe
  const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') as string, {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
  })

  // 2. Lê o corpo da requisição
  const body = await req.text()

  let event
  try {
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SIGNING_SECRET')
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SIGNING_SECRET não configurado.')
    }
    
    // --- CORREÇÃO AQUI: Usamos 'await' e 'constructEventAsync' ---
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret)
    
  } catch (err) {
    console.error(`⚠️  Webhook signature verification failed.`, err.message)
    return new Response(err.message, { status: 400 })
  }

  // 3. Lida com o evento 'checkout.session.completed'
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.user_id 
    
    console.log(`💰 Pagamento recebido para o usuário: ${userId}`)

    if (userId) {
      // Inicializa Supabase com Service Role
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Lógica simples de upgrade
      let novoPlano = 'Profissional'
      // Se o valor for maior que 100 reais (10000 centavos), vira Business
      if (session.amount_total >= 10000) { 
          novoPlano = 'Business' 
      }

      const { error } = await supabaseAdmin
        .from('assinaturas')
        .update({
          plano: novoPlano,
          status: 'active',
          propostas_criadas_mes: 0,
          contratos_criadas_mes: 0,
          mensagens_ia_mes: 0,
          ultimo_reset: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Erro ao atualizar assinatura:', error)
        return new Response('Erro ao atualizar banco', { status: 500 })
      }
      console.log(`✅ Plano do usuário ${userId} atualizado para ${novoPlano}`)
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})