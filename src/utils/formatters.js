export const formatCurrency = (value) => {
  if (typeof value !== 'number') {
    value = parseFloat(value) || 0;
  }
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export const formatDate = (dateString) => {
  if (!dateString) return 'Data inválida';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}