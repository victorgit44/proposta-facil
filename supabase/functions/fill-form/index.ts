console.log('Função fill-form (100% Standalone) iniciada')

// 1. Definimos o CORS aqui mesmo para não depender de arquivos externos antigos
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // 2. Trata requisição Pre-flight (CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, type } = await req.json()
    const apiKey = Deno.env.get('GOOGLE_API_KEY')

    if (!apiKey) throw new Error('GOOGLE_API_KEY não configurada.')
    if (!text) throw new Error('Texto não fornecido.')

    // 3. Prompt do sistema
    let systemInstruction = ''
    if (type === 'proposta') {
      systemInstruction = `
      ATENÇÃO: Retorne APENAS um JSON válido. Sem Markdown. Sem explicações.
      
      Extraia os dados do texto abaixo para preencher uma proposta comercial.
      Estrutura do JSON:
      {
        "nome_cliente": "string (ou null)",
        "empresa_cliente": "string (ou null)",
        "email_cliente": "string (ou null)",
        "telefone_cliente": "string (ou null)",
        "servico_prestado": "string (crie uma descrição detalhada e vendedora baseada no pedido)",
        "prazo_entrega": "string (ou null)",
        "observacoes": "string (ou null)",
        "itens": [
          { "descricao": "string", "quantidade": number, "valor_unitario": number }
        ]
      }
      `
    } else {
        systemInstruction = 'Extraia dados para contrato em formato JSON...'
    }

    // 4. Chama a API do Google (gemini-1.5-flash)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `${systemInstruction}\n\nTexto do usuário: "${text}"` }]
        }]
      })
    })

    const data = await response.json()

    if (data.error) {
      console.error('Erro Google API:', data.error)
      throw new Error(`Erro Google: ${data.error.message}`)
    }

    let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) throw new Error('O Google Gemini não retornou texto.')

    // 5. Limpeza de Markdown
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()

    let jsonResult
    try {
        jsonResult = JSON.parse(rawText)
    } catch (e) {
        console.error("Texto inválido:", rawText)
        throw new Error("A IA retornou um formato inválido. Tente novamente.")
    }

    return new Response(JSON.stringify(jsonResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Erro na função:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Verifique os logs no Dashboard do Supabase.' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})