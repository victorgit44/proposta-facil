// Motor de Interpolação de Variáveis no Estilo Notion / Proposify

export const DEFAULT_VARIABLES = {
  'cliente.nome': 'ACME Corporation',
  'cliente.empresa': 'ACME Corporation Ltda',
  'cliente.email': 'roberto@acme.com',
  'cliente.telefone': '(11) 98765-4321',
  'empresa.nome': 'PropostaFácil Tech & Design',
  'empresa.email': 'contato@propostafacil.com.br',
  'empresa.telefone': '(11) 98765-4321',
  'empresa.cnpj': '45.982.103/0001-89',
  'responsavel': 'João Victor (Gerente Comercial)',
  'proposta.numero': 'PROP-001089',
  'data': new Date().toLocaleDateString('pt-BR'),
  'validade': '30 dias',
  'valor_total': 'R$ 26.300,00',
  'subtotal': 'R$ 26.300,00',
  'desconto': 'R$ 0,00'
};

/**
 * Substitui marcadores no formato {{variavel}} pelo valor correspondente do dicionário de variáveis.
 */
export function interpolateVariables(text, customVars = {}) {
  if (typeof text !== 'string') return text;
  
  const mergedVars = { ...DEFAULT_VARIABLES, ...customVars };

  return text.replace(/\{\{\s*([a-zA-Z0-9_\.]+)\s*\}\}/g, (match, key) => {
    const trimmedKey = key.trim();
    if (mergedVars[trimmedKey] !== undefined && mergedVars[trimmedKey] !== null) {
      return mergedVars[trimmedKey];
    }
    return match; // Mantém a variável se não encontrada
  });
}
