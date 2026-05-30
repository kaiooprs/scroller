// db.js

const gameEvents = [
    {
        dia: 1,
        titulo: "O Dilema do Tempo de Tela",
        descricao: "Após as primeiras 24 horas de testes, a diretoria percebeu que vídeos educativos mantêm usuários por menos tempo na plataforma. Executivos pressionam você a priorizar conteúdos rápidos e virais.",
        opcoes: [
            { texto: "Reduzir imediatamente o alcance de vídeos educativos para priorizar a retenção rápida de público.", impacto: { diretoria: 20, criadores: -20, infra: -15 }, proximoDia: 2 },
            { texto: "Avaliar métricas de engajamento e estabelecer diretrizes de crescimento que não prejudiquem a qualidade do feed.", impacto: { diretoria: 10, criadores: 15, infra: 5 }, proximoDia: 2 },
            { texto: "Congelar as configurações atuais e criar um ambiente isolado (sandbox) para testes antes de mexer na produção.", impacto: { diretoria: -10, criadores: 5, infra: 15 }, proximoDia: 2 }
        ]
    },
    {
        dia: 2,
        titulo: "Pressão por Monetização",
        descricao: "Com o algoritmo crescendo rapidamente, a diretoria quer aumentar a receita inserindo anúncios a cada 2 vídeos assistidos. Usuários começam a reclamar do excesso de publicidade.",
        opcoes: [
            { texto: "Forçar a implantação imediata dos anúncios não-puláveis em todas as contas ativas para bater a meta.", impacto: { diretoria: 25, criadores: -25, infra: -10 }, proximoDia: 3 },
            { texto: "Revisar a estratégia comercial junto às partes interessadas para definir limites aceitáveis de publicidade.", impacto: { diretoria: 15, criadores: 10, infra: 5 }, proximoDia: 3 },
            { texto: "Planejar um rollout gradual com testes A/B em pequenos grupos para monitorar a reação dos servidores e do público.", impacto: { diretoria: -10, criadores: 5, infra: 15 }, proximoDia: 3 }
        ]
    },
    {
        dia: 3,
        titulo: "O Pico de Tráfego Viral",
        descricao: "Um trend viral gerou milhões de acessos em poucas horas. Os servidores começam a apresentar falhas e a equipe técnica alerta para risco crítico de instabilidade.",
        opcoes: [
            { texto: "Alocar capacidade computacional extra instantaneamente, mesmo que estoure o orçamento previsto.", impacto: { diretoria: -15, criadores: 0, infra: 30 }, proximoDia: 4 },
            { texto: "Aplicar políticas predefinidas de Gerenciamento de Capacidade para controlar a sobrecarga de forma escalonada.", impacto: { diretoria: -5, criadores: -5, infra: 25 }, proximoDia: 4, minigame: 'throttling' },
            { texto: "Assumir o risco de indisponibilidade e não intervir nos servidores durante o pico de acessos.", impacto: { diretoria: 15, criadores: 10, infra: -35 }, proximoDia: 4 }
        ]
    },
    {
        dia: 4,
        titulo: "A Revolta dos Criadores",
        descricao: "Criadores populares iniciaram uma campanha contra as mudanças recentes do algoritmo. A hashtag crítica à plataforma ganha força e ameaça a reputação do teste público.",
        opcoes: [
            { texto: "Intervir no código para suprimir o alcance das hashtags e tentar sufocar a crise de imagem imediatamente.", impacto: { diretoria: 20, criadores: -35, infra: -5 }, proximoDia: 5 },
            { texto: "Mapear os impactos na reputação da marca e realinhar os objetivos do negócio com os influenciadores-chave.", impacto: { diretoria: 10, criadores: 15, infra: 5 }, proximoDia: 5 },
            { texto: "Registrar um incidente de grande impacto e criar canais de suporte abertos para acalmar a comunidade.", impacto: { diretoria: -10, criadores: 20, infra: 10 }, proximoDia: 5 }
        ]
    },
    {
        dia: 5,
        titulo: "Crise de Transparência",
        descricao: "Usuários começaram a acusar o algoritmo de limitar vídeos sem explicação. A desconfiança cresce nas redes sociais e a pressão por transparência atinge os acionistas.",
        opcoes: [
            { texto: "Negar publicamente qualquer falha sistêmica e ordenar que a operação siga sem alterações no código.", impacto: { diretoria: 15, criadores: -25, infra: -10 }, proximoDia: 6 },
            { texto: "Auditar os processos lógicos de recomendação para rastrear possíveis desvios entre o que foi planejado e o executado.", impacto: { diretoria: 5, criadores: 15, infra: 10 }, proximoDia: 6 },
            { texto: "Executar uma análise técnica dos logs e agendar um rollback controlado da última atualização do sistema.", impacto: { diretoria: -15, criadores: 15, infra: 25 }, proximoDia: 6 }
        ]
    },
    {
        dia: 6,
        titulo: "O Ultimato dos Investidores",
        descricao: "Investidores exigem crescimento imediato e ameaçam cortar parte do orçamento do projeto. A diretoria exige que o algoritmo entregue resultados rápidos de monetização.",
        opcoes: [
            { texto: "Priorizar a exigência financeira e forçar uma agressiva taxa de retenção algorítmica, sem testes adicionais.", impacto: { diretoria: 30, criadores: -30, infra: -20 }, proximoDia: 7 },
            { texto: "Formular um comitê estratégico para demonstrar aos investidores o equilíbrio entre lucro e a capacidade real de entrega.", impacto: { diretoria: 15, criadores: 10, infra: 10 }, proximoDia: 7 },
            { texto: "Definir um rigoroso cronograma de liberação de funcionalidades (Release Management) para diluir os riscos.", impacto: { diretoria: -15, criadores: 5, infra: 20 }, proximoDia: 7 }
        ]
    },
    {
        dia: 7,
        titulo: "O Lançamento Global",
        descricao: "O período de testes terminou e a plataforma precisa decidir se o Scroller será lançado globalmente. Qualquer falha agora pode ser fatal para o futuro da empresa.",
        opcoes: [
            { texto: "Ignorar pendências técnicas e fazer o deploy imediato globalmente para garantir o relatório de lucros do trimestre.", impacto: { diretoria: 40, criadores: -30, infra: -40 }, proximoDia: 8 },
            { texto: "Apresentar indicadores de desempenho (KPIs) balanceados, demonstrando que a arquitetura do Scroller é sustentável.", impacto: { diretoria: 20, criadores: 10, infra: 10 }, proximoDia: 8 },
            { texto: "Vetar o lançamento global, apontando em relatório que os processos de transição e suporte ainda não estão maduros.", impacto: { diretoria: -25, criadores: 15, infra: 30 }, proximoDia: 8 }
        ]
    }
];