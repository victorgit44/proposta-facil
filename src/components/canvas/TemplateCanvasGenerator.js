// Gerador de Estrutura de Páginas A4 com Posicionamento Livre para Templates da Biblioteca

export function buildCanvasPagesFromTemplate(template) {
  const title = template.titulo ? template.titulo.toUpperCase() : 'PROPOSTA COMERCIAL';
  const subtitle = template.servico || template.descricao || 'Apresentação Comercial Executiva';
  const priceVal = template.valor_sugerido ? parseFloat(template.valor_sugerido) : 15000;
  const coverTheme = template.cover_theme || 'blue';

  const themeColors = {
    purple: { cardBg: '#2e1065', border: '#581c87', accent: '#a855f7' },
    emerald: { cardBg: '#064e3b', border: '#065f46', accent: '#34d399' },
    slate: { cardBg: '#1e293b', border: '#334155', accent: '#94a3b8' },
    amber: { cardBg: '#451a03', border: '#78350f', accent: '#fbbf24' },
    pink: { cardBg: '#831843', border: '#9d174d', accent: '#f472b6' },
    cyan: { cardBg: '#164e63', border: '#155e75', accent: '#22d3ee' },
    blue: { cardBg: '#1b2a4a', border: '#1e3a8a', accent: '#60a5fa' }
  };

  const theme = themeColors[coverTheme] || themeColors.blue;
  const now = Date.now();

  return {
    theme: 'dark-executive',
    pages: [
      {
        id: 'page-1',
        title: 'Folha A4 #1 — Capa & Resumo',
        elements: [
          {
            id: `tpl-${now}-c1`,
            type: 'rect',
            x: 40,
            y: 40,
            width: 720,
            height: 320,
            rotation: 0,
            zIndex: 1,
            style: { fill: theme.cardBg, stroke: theme.border, strokeWidth: 1, cornerRadius: 16, opacity: 1 }
          },
          {
            id: `tpl-${now}-t1`,
            type: 'text',
            x: 80,
            y: 95,
            width: 640,
            rotation: 0,
            zIndex: 10,
            content: title,
            style: { fontSize: 28, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-t2`,
            type: 'text',
            x: 80,
            y: 175,
            width: 640,
            rotation: 0,
            zIndex: 10,
            content: `Preparado para Cliente Especial`,
            style: { fontSize: 18, fontFamily: 'Inter', fontStyle: 'bold', fill: theme.accent, align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-t3`,
            type: 'text',
            x: 80,
            y: 245,
            width: 640,
            rotation: 0,
            zIndex: 10,
            content: `PropostaFácil Tech • Validade de 30 dias`,
            style: { fontSize: 13, fontFamily: 'Inter', fontStyle: 'normal', fill: '#94a3b8', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-c2`,
            type: 'rect',
            x: 40,
            y: 400,
            width: 720,
            height: 340,
            rotation: 0,
            zIndex: 1,
            style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
          },
          {
            id: `tpl-${now}-t4`,
            type: 'text',
            x: 70,
            y: 430,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: '1. Resumo Executivo & Objetivos',
            style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-t5`,
            type: 'text',
            x: 70,
            y: 490,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: subtitle,
            style: { fontSize: 16, fontFamily: 'Inter', fontStyle: 'normal', fill: '#cbd5e1', align: 'left', opacity: 1 }
          }
        ]
      },
      {
        id: 'page-2',
        title: 'Folha A4 #2 — Investimento & Escopo',
        elements: [
          {
            id: `tpl-${now}-c3`,
            type: 'rect',
            x: 40,
            y: 40,
            width: 720,
            height: 360,
            rotation: 0,
            zIndex: 1,
            style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
          },
          {
            id: `tpl-${now}-t6`,
            type: 'text',
            x: 70,
            y: 70,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: '2. Tabela de Investimento Comercial',
            style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-t7`,
            type: 'text',
            x: 70,
            y: 130,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: `Serviço Principal: R$ ${(priceVal * 0.7).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\nSetup & Configurações: R$ ${(priceVal * 0.2).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\nTreinamento & Suporte: R$ ${(priceVal * 0.1).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n----------------------------------------------------\nValor Total da Proposta: R$ ${priceVal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            style: { fontSize: 16, fontFamily: 'Inter', fontStyle: 'bold', fill: '#34d399', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-c4`,
            type: 'rect',
            x: 40,
            y: 440,
            width: 720,
            height: 360,
            rotation: 0,
            zIndex: 1,
            style: { fill: '#111118', stroke: '#1e1e2e', strokeWidth: 1, cornerRadius: 12, opacity: 1 }
          },
          {
            id: `tpl-${now}-t8`,
            type: 'text',
            x: 70,
            y: 470,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: '3. Escopo de Entregáveis & Garantia',
            style: { fontSize: 22, fontFamily: 'Inter', fontStyle: 'bold', fill: '#ffffff', align: 'left', opacity: 1 }
          },
          {
            id: `tpl-${now}-t9`,
            type: 'text',
            x: 70,
            y: 530,
            width: 660,
            rotation: 0,
            zIndex: 10,
            content: '✓ Mapeamento Comercial & Adequação de Templates A4\n✓ Treinamento da Equipe e Validação de Resultados\n✓ Suporte Técnico Dedicado 24/7 com Garantia de SLA\n✓ Assinatura Digital e Registro Jurídico com IP e Data',
            style: { fontSize: 16, fontFamily: 'Inter', fontStyle: 'normal', fill: '#cbd5e1', align: 'left', opacity: 1 }
          }
        ]
      }
    ]
  };
}
