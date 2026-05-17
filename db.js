// db.js
const gameEvents = [
    {
        dia: 1,
        titulo: "O Dilema dos Vídeos Curtos",
        descricao: "A diretoria quer cortar o alcance de vídeos educativos para priorizar dancinhas lucrativas.",
        imagem: "assets/neutralscroller.png", 
        opcoes: [
            {
                texto: "Opção A — Ação Impulsiva",
                impacto: { diretoria: 20, criadores: -20, infra: -40 },
                proximoDia: 2
            },
            {
                texto: "Opção B — Ação Balanceada (COBIT)",
                impacto: { diretoria: -20, criadores: 20, infra: 10 },
                proximoDia: 2
            },
            {
                texto: "Opção C — Ação Estratégica (ITIL)",
                impacto: { diretoria: -10, criadores: 10, infra: 20 },
                proximoDia: 2
            }
        ]
    }
    // A equipe vai adicionar o Dia 2, 3, 4... aqui depois
];