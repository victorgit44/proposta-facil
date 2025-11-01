// Define os limites para cada plano
export const PLAN_LIMITS = {
  'Gratuito': {
    propostas: 3,
    contratos: 1,
    ia: 10,
  },
  'Profissional': {
    propostas: 100,
    contratos: 50,
    ia: 500,
  },
  'Business': {
    propostas: Infinity, // Pode ser um número muito alto, ex: 99999
    contratos: Infinity,
    ia: Infinity,
  },
};