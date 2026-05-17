// app.js

// 1. O Estado Global do Jogo
let state = {
    diretoria: 50,
    criadores: 50,
    infra: 50,
    diaAtual: 1
};

// Sistema de Conquistas (Lê o LocalStorage ou cria vazio)
let unlockedEndings = JSON.parse(localStorage.getItem('scroller_achievements')) || [];

// 2. Elementos da Tela
const gameContent = document.getElementById('game-content');
const statusHeader = document.getElementById('status-header');
const bgMusic = document.getElementById('bg-music');

const trilhas = {
    menu: 'assets/ost/startmenu.mp3',
    gameplay: 'assets/ost/gamethrough.mp3',
    gameover: 'assets/ost/gameover.mp3'
};

// Função que troca a música
function tocarMusica(nomeDaFaixa, repetir = true) {
    // Evita que a música reinicie do zero se já estiver tocando a faixa certa
    if (bgMusic.src.includes(trilhas[nomeDaFaixa])) return;

    bgMusic.src = trilhas[nomeDaFaixa];
    bgMusic.loop = repetir; // O padrão é repetir, mas podemos passar 'false'
    bgMusic.volume = 0.3;
    bgMusic.play().catch(erro => console.log("Áudio bloqueado até o primeiro clique do jogador."));
}

// 3. Renderiza o Menu Inicial
function renderMenu() {
    statusHeader.classList.add('hidden');
    tocarMusica('menu');
    
    // Adicionamos o card-wrapper e a animação de entrada aqui
    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; justify-content: center; height: 100%; align-items: center;">
            <img src="assets/happyscroller.png" width="200" alt="Scroller">
            <h1 class="menu-title">SCROLLER</h1>
            <p class="menu-subtitle">O Algoritmo em Teste</p>
            
            <button class="game-btn" onclick="startGame()">INICIAR JOGO</button>
            <button class="game-btn" onclick="transitionToRules()">COMO JOGAR</button>
            <button class="game-btn" style="border-color: #f778ba;" onclick="transitionToAchievements()">🏆 CONQUISTAS</button>
        </div>
    `;
}

// Transição para as Conquistas
function transitionToAchievements() {
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }
    setTimeout(() => { renderAchievements(); }, 400);
}

// Tela de Conquistas
function renderAchievements() {
    statusHeader.classList.add('hidden');
    tocarMusica('menu'); // Mantém o som do menu

    // O nosso catálogo de troféus
    const finais = [
        { id: 'tela_azul', nome: 'Tela Azul da Morte', desc: 'Colapso tecnológico imediato.', icone: '💀' },
        { id: 'fantoche', nome: 'Fantoche Corporativo', desc: 'Foco apenas em lucro e comunidade tóxica.', icone: '👔' },
        { id: 'heroi', nome: 'Herói Deletado', desc: 'Comunidade feliz, mas sem retorno financeiro.', icone: '💔' },
        { id: 'governanca', nome: 'Governança Pura', desc: 'Equilíbrio perfeito aplicando COBIT e ITIL.', icone: '🏆' },
        { id: 'rebeliao', nome: 'Rebelião da IA', desc: 'Controle total e independência do algoritmo.', icone: '🤖' }
    ];

    let htmlLista = '';
    
    finais.forEach(f => {
        const desbloqueado = unlockedEndings.includes(f.id);
        if(desbloqueado) {
            htmlLista += `
                <div class="achievement unlocked">
                    <span class="ach-icon">${f.icone}</span>
                    <div class="ach-text"><strong>${f.nome}</strong><br><small>${f.desc}</small></div>
                </div>`;
        } else {
            htmlLista += `
                <div class="achievement locked">
                    <span class="ach-icon">🔒</span>
                    <div class="ach-text"><strong>???</strong><br><small>Final Bloqueado</small></div>
                </div>`;
        }
    });

    // Injeta na tela
    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <h2 class="menu-title" style="font-size: 28px; margin-top: 10px; margin-bottom: 20px; color: #f778ba;">GALERIA DE FINAIS</h2>
            
            <div style="width: 100%; margin-bottom: 20px;">
                ${htmlLista}
            </div>
            
            <button class="game-btn" style="border-color: #ff7b72; color: #ff7b72;" onclick="resetAchievements()">Zerar Progresso</button>
            <button class="game-btn" onclick="transitionToMenu()">VOLTAR AO MENU</button>
        </div>
    `;
}

// Função para desbloquear e salvar o troféu no navegador
function unlockAchievement(id) {
    // Só salva se o jogador ainda não tiver essa conquista
    if (!unlockedEndings.includes(id)) {
        unlockedEndings.push(id);
        localStorage.setItem('scroller_achievements', JSON.stringify(unlockedEndings));
    }
}

// Transição suave do Menu para as Regras
function transitionToRules() {
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    setTimeout(() => {
        renderRules();
    }, 400);
}

// Renderização da Tela de Regras
function renderRules() {
    statusHeader.classList.add('hidden'); // Garante que o cabeçalho de barras continue oculto
    tocarMusica('menu'); // Mantém a mesma música rodando de fundo

    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; align-items: center; padding-bottom: 20px;">
            <h2 class="menu-title" style="font-size: 28px; margin-top: 10px; margin-bottom: 20px;">DIRETRIZES DO SISTEMA</h2>
            
            <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #c9d1d9; width: 100%; margin-bottom: 20px;">
                <p style="margin-bottom: 15px;">Você é o <strong>Scroller</strong>, um novo algoritmo em período de testes de 7 dias. Sua sobrevivência depende do equilíbrio entre três pilares corporativos e tecnológicos.</p>
                
                <h4 style="color: #58a6ff; margin-bottom: 5px; font-family: 'Urbanist'; text-transform: uppercase;">Barras de Recursos</h4>
                <p style="margin-bottom: 15px;">
                    • <strong>DIRETORIA:</strong> Prioriza o lucro e metas de negócio. Cai ao ignorar decisões financeiras.<br>
                    • <strong>CRIADORES:</strong> Confiança dos produtores de conteúdo. Reduz drasticamente ao focar excessivamente em anúncios.<br>
                    • <strong>INFRA:</strong> Estabilidade da TI. Exige planejamento e desaba com atualizações caóticas.
                </p>
                
                <h4 style="color: #ff7b72; margin-bottom: 5px; font-family: 'Urbanist'; text-transform: uppercase;">Condição de Derrota</h4>
                <p style="margin-bottom: 15px;">Se qualquer uma das barras ficar <strong>menor que 20 pontos</strong>, o sistema entra em colapso e o Scroller é sumariamente <strong>deletado</strong> (Tela Azul).</p>
                
                <h4 style="color: #f778ba; margin-bottom: 5px; font-family: 'Urbanist'; text-transform: uppercase;">Os 5 Finais Possíveis</h4>
                <p style="margin-bottom: 5px;">Existem 5 finais distintos que podem ser alcançados ao final do 7º dia (ou falhando antes disso). Suas decisões definirão o destino do Scroller. Explore combinações diferentes para desbloquear todos eles na sua Galeria de Conquistas!</p>
                
                <p style="font-style: italic; color: #8b949e; text-align: center; border-top: 1px solid #30363d; padding-top: 10px;">
                    "Lucro puro ou comunidade pura resulta em falha. Use COBIT para alinhamento estratégico e ITIL para mudanças."
                </p>
            </div>
            
            <button class="game-btn" onclick="transitionToMenu()">VOLTAR AO MENU</button>
        </div>
    `;
}

// 4. Inicia o Jogo
function startGame() {
    tocarMusica('gameplay');

    // Faz o Menu subir animado
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    // Espera a animação para carregar o Dia 1
    setTimeout(() => {
        state = { diretoria: 50, criadores: 50, infra: 50, diaAtual: 1 };
        statusHeader.classList.remove('hidden'); 
        updateBars(); 
        renderDay(state.diaAtual); 
    }, 400);
}

// 5. Atualiza o CSS das Barrinhas
function updateBars() {
    document.getElementById('bar-diretoria').style.width = `${state.diretoria}%`;
    document.getElementById('bar-criadores').style.width = `${state.criadores}%`;
    document.getElementById('bar-infra').style.width = `${state.infra}%`;
}

// 6. Renderiza o Card do Dia
function renderDay(diaIndex) {
    // O array começa no zero, então Dia 1 é o index 0
    const evento = gameEvents[diaIndex - 1]; 
    
    // Monta os botões dinamicamente
    let botoesHTML = '';
    evento.opcoes.forEach(opcao => {
        // Passando os impactos como parâmetros para a função makeDecision
        botoesHTML += `<button class="game-btn" onclick="makeDecision(${opcao.impacto.diretoria}, ${opcao.impacto.criadores}, ${opcao.impacto.infra}, ${opcao.proximoDia})">${opcao.texto}</button>`;
    });

    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom">
            <img src="${evento.imagem}" width="150" alt="Scroller">
            <div class="card-text">
                <h3>DIA ${evento.dia}: ${evento.titulo}</h3>
                <p>${evento.descricao}</p>
            </div>
            <div style="width: 100%;">
                ${botoesHTML}
            </div>
        </div>
    `;
}

// Função para zerar o Memory Card
function resetAchievements() {
    // Confirmação para o jogador não clicar sem querer
    if(confirm("Tem certeza que deseja apagar todos os finais desbloqueados?")) {
        localStorage.removeItem('scroller_achievements');
        unlockedEndings = []; // Zera o array atual
        renderAchievements(); // Recarrega a tela na hora
    }
}

// 7. Processa a Escolha do Jogador
function makeDecision(impactoDir, impactoCri, impactoInf, proximoDia) {
    // Pega o card atual e joga a animação de subir e sumir
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    // Espera 400ms (tempo da animação) para fazer a matemática e trocar de tela
    setTimeout(() => {
        state.diretoria += impactoDir;
        state.criadores += impactoCri;
        state.infra += impactoInf;

        state.diretoria = Math.max(0, Math.min(100, state.diretoria));
        state.criadores = Math.max(0, Math.min(100, state.criadores));
        state.infra = Math.max(0, Math.min(100, state.infra));

        updateBars();

        if (state.diretoria < 20 || state.criadores < 20 || state.infra < 20) {
            renderGameOver();
            return;
        }

        state.diaAtual = proximoDia;
        
        if(state.diaAtual > gameEvents.length) {
            gameContent.innerHTML = `<div class="scroll-in-bottom"><h3 style="text-align:center; margin-top: 50px;">Fim da Demo! Mais dias em breve.</h3><button class="game-btn" onclick="renderMenu()">VOLTAR AO MENU</button></div>`;
        } else {
            renderDay(state.diaAtual);
        }
    }, 400); // 400 milissegundos
}

// 8. Renderiza a Tela Azul da Morte
function renderGameOver() {
    statusHeader.classList.add('hidden');
    tocarMusica('gameover', false);
    unlockAchievement('tela_azul');
    
    // Adicionamos o card-wrapper aqui também
    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; justify-content: center; height: 100%; align-items: center; color: #ff7b72;">
            <img src="assets/deletedscroller.png" class="game-over-img" alt="Scroller Morto">
            <h1 style="font-family: 'Urbanist'; font-size: 40px; margin-top: 20px;">GAME OVER</h1>
            <p style="text-align: center; color: #f0f6fc; margin-bottom: 30px;">O sistema entrou em colapso. O Scroller foi deletado.</p>
            <button class="game-btn" onclick="transitionToMenu()">TENTAR NOVAMENTE</button>
        </div>
    `;
}

function transitionToMenu() {
    // Anima a saída da tela atual (ex: Game Over)
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    // Espera e chama o menu
    setTimeout(() => {
        renderMenu();
    }, 400);
}

// Inicializa o jogo chamando o Menu
renderMenu();