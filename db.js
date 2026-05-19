// db.js
const gameEvents = [
    {
        dia: 1,
        titulo: "O Dilema dos Vídeos Curtos",
        descricao: "A diretoria quer cortar o alcance de vídeos educativos para priorizar dancinhas lucrativas e aumentar a receita imediatamente.",
        opcoes: [
            { texto: "Focar em ganhos rápidos ignorando riscos (Prática não recomendada)", impacto: { diretoria: 20, criadores: -15, infra: -5 }, proximoDia: 2 },
            { texto: "Manter conteúdo atual focando apenas na comunidade", impacto: { diretoria: -15, criadores: 20, infra: +5 }, proximoDia: 2 },
            { texto: "Estabelecer comitê de alinhamento estratégico (Prática COBIT/ITIL)", impacto: { diretoria: +10, criadores: +10, infra: +10 }, proximoDia: 2 }
        ]
    },
    {
        dia: 2,
        titulo: "Inserção Massiva de Anúncios",
        descricao: "Para bater a meta do trimestre, a gestão propõe colocar anúncios não-puláveis a cada 2 vídeos scrollados.",
        opcoes: [
            { texto: "Forçar implementação imediata em produção", impacto: { diretoria: 25, criadores: -20, infra: -10 }, proximoDia: 3 },
            { texto: "Vetar a mudança para proteger a experiência do usuário", impacto: { diretoria: -15, criadores: +15, infra: +5 }, proximoDia: 3 },
            { texto: "Avaliar o impacto e planejar uma liberação gradual", impacto: { diretoria: +10, criadores: +5, infra: 0 }, proximoDia: 3 }
        ]
    },
    {
        dia: 3,
        titulo: "A Trend Viral e a Sobrecarga",
        descricao: "Uma nova trend global faz o tráfego do aplicativo disparar 400% em duas horas. Os servidores estão operando no limite térmico.",
        opcoes: [
            { texto: "Aumentar capacidade computacional sem planejamento financeiro", impacto: { diretoria: -15, criadores: 0, infra: +30 }, proximoDia: 4 },
            { texto: "Aplicar políticas predefinidas de Gerenciamento de Capacidade", impacto: { diretoria: -5, criadores: -5, infra: +25 }, proximoDia: 4 },
            { texto: "Assumir o risco de indisponibilidade e não intervir", impacto: { diretoria: +15, criadores: +10, infra: -35 }, proximoDia: 4 }
        ]
    },
    {
        dia: 4,
        titulo: "Moderação de Conteúdo Ofensivo",
        descricao: "Um bug no filtro de IA permitiu que discursos de ódio e golpes fossem recomendados na aba principal.",
        opcoes: [
            { texto: "Suspender o serviço imediatamente para mitigar danos", impacto: { diretoria: -20, criadores: -5, infra: +15 }, proximoDia: 5 },
            { texto: "Aplicar uma solução de contorno oculta sem registrar incidente", impacto: { diretoria: +20, criadores: -20, infra: -10 }, proximoDia: 5 },
            { texto: "Registrar incidente grave e escalar para o suporte avançado", impacto: { diretoria: -5, criadores: +15, infra: +10 }, proximoDia: 5 }
        ]
    },
    {
        dia: 5,
        titulo: "A Revolta dos Criadores de Conteúdo",
        descricao: "Os maiores canais da plataforma ameaçam uma greve digital por conta da redução arbitrária no pagamento de monetização.",
        opcoes: [
            { texto: "Reverter a política de pagamentos para evitar crise de imagem", impacto: { diretoria: -20, criadores: +25, infra: 0 }, proximoDia: 6 },
            { texto: "Manter a política atual e ignorar o desgaste com os provedores", impacto: { diretoria: +15, criadores: -25, infra: 0 }, proximoDia: 6 },
            { texto: "Revisar o Acordo de Nível de Serviço (SLA) com base em metas", impacto: { diretoria: +15, criadores: +15, infra: +5 }, proximoDia: 6 }
        ]
    },
    {
        dia: 6,
        titulo: "Atualização Crítica do Sistema",
        descricao: "A equipe de Infraestrutura exige uma janela de manutenção de 4 horas de madrugada para aplicar patches críticos de segurança.",
        opcoes: [
            { texto: "Aprovar parada de emergência burlando o conselho de mudanças", impacto: { diretoria: -15, criadores: -10, infra: +25 }, proximoDia: 7 },
            { texto: "Adiar a atualização, assumindo os riscos de vulnerabilidade", impacto: { diretoria: +10, criadores: +10, infra: -25 }, proximoDia: 7 },
            { texto: "Agendar a janela via Gestão de Mudanças e Liberação", impacto: { diretoria: +5, criadores: +0, infra: +10 }, proximoDia: 7 }
        ]
    },
    {
        dia: 7,
        titulo: "O Teste Final do Algoritmo",
        descricao: "O período de homologação do Scroller terminou. A governança implementada será colocada à prova diante do conselho de administração.",
        opcoes: [
            { texto: "Apresentar um relatório focado exclusivamente no Retorno sobre Investimento (ROI)", impacto: { diretoria: +25, criadores: -15, infra: -5 }, proximoDia: 8 },
            { texto: "Apresentar um painel técnico focado apenas no uptime e infraestrutura", impacto: { diretoria: -10, criadores: -5, infra: +25 }, proximoDia: 8 },
            { texto: "Apresentar indicadores de desempenho (KPIs) equilibrando valor e recursos", impacto: { diretoria: +20, criadores: +10, infra: +10 }, proximoDia: 8 }
        ]
    }
];