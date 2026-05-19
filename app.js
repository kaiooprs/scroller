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
    gameover: 'assets/ost/gameover.mp3',
    ending: 'assets/ost/ending.mp3',
    trueEnding: 'assets/ost/trueEnding.mp3'
};

// Função que troca a música
function tocarMusica(nomeDaFaixa, repetir = true) {
    if (bgMusic.src.includes(trilhas[nomeDaFaixa])) return;

    bgMusic.src = trilhas[nomeDaFaixa];
    bgMusic.loop = repetir; 
    bgMusic.volume = 0.3;
    bgMusic.play().catch(erro => console.log("Áudio bloqueado até o primeiro clique do jogador."));
}

// 3. Renderiza o Menu Inicial
function renderMenu() {
    statusHeader.classList.add('hidden');
    tocarMusica('menu');
    
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
    tocarMusica('menu'); 

    // Catálogo de troféus atualizado para bater com os 6 finais reais do jogo
    const finais = [
        { id: 'tela_azul', nome: 'Tela Azul da Morte', desc: 'Colapso tecnológico antes do 7º dia.', icone: '💀' },
        { id: 'fantoche', nome: 'Fantoche Corporativo', desc: 'Foco apenas em lucro e diretoria.', icone: '👔' },
        { id: 'anarquia', nome: 'Anarquia dos Influencers', desc: 'Comunidade feliz, mas receita despencou.', icone: '🔥' },
        { id: 'fortaleza', nome: 'Fortaleza Burocrática', desc: 'Infraestrutura impecável, mas sem engajamento.', icone: '🛡️' },
        { id: 'governanca', nome: 'Governança Sustentável', desc: 'Equilíbrio padrão aplicando COBIT e ITIL.', icone: '⚖️' },
        { id: 'secreto', nome: 'O Algoritmo Perfeito', desc: 'Sinergia absoluta acima de 90 em tudo.', icone: '🌟' }
    ];

    let htmlLista = '';
    
    finais.forEach(f => {
        const desbloqueado = unlockedEndings.includes(f.id);
        if(desbloqueado) {
            htmlLista += `
                <div class="achievement unlocked" style="margin-bottom: 10px; padding: 10px; border: 1px solid #39d353; border-radius: 8px; display: flex; align-items: center; background: rgba(57, 211, 83, 0.1);">
                    <span class="ach-icon" style="font-size: 24px; margin-right: 15px;">${f.icone}</span>
                    <div class="ach-text"><strong>${f.nome}</strong><br><small style="color: #c9d1d9;">${f.desc}</small></div>
                </div>`;
        } else {
            htmlLista += `
                <div class="achievement locked" style="margin-bottom: 10px; padding: 10px; border: 1px solid #30363d; border-radius: 8px; display: flex; align-items: center; opacity: 0.5;">
                    <span class="ach-icon" style="font-size: 24px; margin-right: 15px;">🔒</span>
                    <div class="ach-text"><strong>???</strong><br><small style="color: #8b949e;">Final Bloqueado</small></div>
                </div>`;
        }
    });

    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; align-items: center; width: 100%;">
            <h2 class="menu-title" style="font-size: 24px; margin-top: 10px; margin-bottom: 20px; color: #f778ba;">GALERIA DE FINAIS</h2>
            
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
    statusHeader.classList.add('hidden'); 
    tocarMusica('menu'); 

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
                
                <h4 style="color: #f778ba; margin-bottom: 5px; font-family: 'Urbanist'; text-transform: uppercase;">Os Finais Possíveis</h4>
                <p style="margin-bottom: 5px;">Existem finais distintos que podem ser alcançados ao final do 7º dia. Explore combinações diferentes para desbloquear todos eles na sua Galeria de Conquistas!</p>
            </div>
            
            <button class="game-btn" onclick="transitionToMenu()">VOLTAR AO MENU</button>
        </div>
    `;
}

function getScrollerExpression() {
    const { diretoria, criadores, infra } = state;
    
    const menorBarra = Math.min(diretoria, criadores, infra);
    const maiorBarra = Math.max(diretoria, criadores, infra);
    const diferenca = maiorBarra - menorBarra;

    if (menorBarra < 35) {
        return 'assets/critical-scroller.png'; 
    } 
    else if (diretoria >= 80 && criadores >= 80 && infra >= 80) {
        return 'assets/love-scroller.png'; 
    } 
    else if (diferenca > 40) {
        return 'assets/worried-scroller.png'; 
    } 
    else if (menorBarra >= 65) {
        return 'assets/happyscroller.png'; 
    } 
    else {
        return 'assets/neutralscroller.png'; 
    }
}

// 4. Inicia o Jogo
function startGame() {
    tocarMusica('gameplay');

    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    setTimeout(() => {
        state = { diretoria: 50, criadores: 50, infra: 50, diaAtual: 1 };
        statusHeader.classList.remove('hidden'); 
        updateBars(); 
        renderDay(state.diaAtual); 
    }, 400);
}

// 5. Atualiza o CSS das Barrinhas
// 5. Atualiza o CSS das Barrinhas
function updateBars() {
    // Atualiza o tamanho visual (largura)
    document.getElementById('bar-diretoria').style.width = `${state.diretoria}%`;
    document.getElementById('bar-criadores').style.width = `${state.criadores}%`;
    document.getElementById('bar-infra').style.width = `${state.infra}%`;

    // Atualiza o número de texto no meio da barra
    document.getElementById('text-diretoria').innerText = `${state.diretoria}%`;
    document.getElementById('text-criadores').innerText = `${state.criadores}%`;
    document.getElementById('text-infra').innerText = `${state.infra}%`;
}

// 6. Renderiza o Card do Dia
function renderDay(diaIndex) {
    const evento = gameEvents[diaIndex - 1]; 
    
    const opcoesEmbaralhadas = [...evento.opcoes].sort(() => Math.random() - 0.5);
    
    let botoesHTML = '';
    opcoesEmbaralhadas.forEach(opcao => {
        botoesHTML += `<button class="game-btn" onclick="makeDecision(${opcao.impacto.diretoria}, ${opcao.impacto.criadores}, ${opcao.impacto.infra}, ${opcao.proximoDia})">${opcao.texto}</button>`;
    });

    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom">
            <img src="${getScrollerExpression()}" width="150" alt="Scroller">
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
    if(confirm("Tem certeza que deseja apagar todos os finais desbloqueados?")) {
        localStorage.removeItem('scroller_achievements');
        unlockedEndings = []; 
        renderAchievements(); 
    }
}

// 7. Processa a Escolha do Jogador
function makeDecision(impactoDir, impactoCri, impactoInf, proximoDia) {
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

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
            renderGameWin();
        } else {
            renderDay(state.diaAtual);
        }
    }, 400); 
}

// 9. Processamento dos Finais Diferentes
function renderGameWin() {
    statusHeader.classList.add('hidden');

    const { diretoria, criadores, infra } = state;
    let tituloFinal = "";
    let descricaoFinal = "";
    let imagemFinal = "assets/happyscroller.png";
    let musicaFinal = "ending"; // O padrão agora é a música genérica
    let idParaDesbloquear = ""; // Variável para dizer ao sistema qual troféu liberar
    let estiloImagem = "width: 150px;"

    // 1. Final Secreto
    if (diretoria >= 90 && criadores >= 90 && infra >= 90) {
        tituloFinal = "FINAL SECRETO: O ALGORITMO PERFEITO";
        descricaoFinal = "Incrível! Você alcançou o equilíbrio absoluto. O Scroller tornou-se uma lenda da Governança de TI: gerou lucros astronômicos para a diretoria, manteve a comunidade de criadores extremamente engajada e opera em uma infraestrutura impecável baseada em COBIT e ITIL. Você zerou o sistema.";
        imagemFinal = "assets/true-ending-scroller.png"; 
        musicaFinal = "trueEnding"; // Toca a música épica
        idParaDesbloquear = "secreto"; // ID exato que está no array de conquistas
        estiloImagem = "width: 220px; border-radius: 20px; box-shadow: 0px 0px 50px 10px rgba(57, 211, 83, 0.4); margin-bottom: 10px;";
    }
    // 2. Dominância da Diretoria
    else if (diretoria > criadores && diretoria > infra) {
        tituloFinal = "FINAL: O FANTOCHE CORPORATIVO";
        descricaoFinal = "Você priorizou totalmente o lucro e o desejo dos acionistas. A diretoria está riquíssima, mas o Scroller virou um mar de anúncios e dancinhas fúteis. Os criadores originais abandonaram a plataforma e a infraestrutura roda no limite.";
        imagemFinal = "assets/neutralscroller.png";
        idParaDesbloquear = "fantoche";
    }
    // 3. Dominância dos Criadores
    else if (criadores > diretoria && criadores > infra) {
        tituloFinal = "FINAL: A ANARQUIA DOS INFLUENCERS";
        descricaoFinal = "Os criadores amam você, a comunidade manda no aplicativo e não há censura. Contudo, a receita despencou e os acionistas estão processando a empresa. Sem dinheiro entrando, a manutenção do Scroller está com os dias contados.";
        imagemFinal = "assets/happyscroller.png";
        idParaDesbloquear = "anarquia";
    }
    // 4. Dominância da Infraestrutura
    else if (infra > diretoria && infra > criadores) {
        tituloFinal = "FINAL: A FORTALEZA BUROCRÁTICA";
        descricaoFinal = "A infraestrutura é uma obra de arte: segura, atualizada e sem bugs. Porém, para alcançar isso, você burocratizou tanto os processos que o aplicativo perdeu a graça. Os criadores migraram e a diretoria não consegue monetizar o sistema.";
        imagemFinal = "assets/worried-scroller.png";
        idParaDesbloquear = "fortaleza";
    }
    // 5. Final Equilibrado Padrão
    else {
        tituloFinal = "FINAL: GOVERNANÇA SUSTENTÁVEL";
        descricaoFinal = "Parabéns! Você concluiu o período de testes com sucesso. O Scroller provou que a aplicação consciente de COBIT e ITIL cria sistemas resilientes. Nenhuma frente colapsou, o negócio é sustentável e a infraestrutura é estável.";
        imagemFinal = "assets/happyscroller.png";
        idParaDesbloquear = "governanca";
    }

    // A mágica acontece aqui: desbloqueia o troféu e toca a música decidida
    unlockAchievement(idParaDesbloquear);
    tocarMusica(musicaFinal);

    gameContent.innerHTML = `
        <div id="card-wrapper" class="scroll-in-bottom" style="display: flex; flex-direction: column; justify-content: center; min-height: 100%; align-items: center; text-align: center;">
            <img src="${imagemFinal}" style="${estiloImagem}" alt="Scroller Final">
            <h2 style="font-family: 'Urbanist'; color: #39d353; margin-top: 20px; font-size: 22px;">${tituloFinal}</h2>
            <p style="font-size: 14px; color: #8b949e; margin: 15px 0 30px 0; line-height: 1.5;">${descricaoFinal}</p>
            <button class="game-btn" onclick="transitionToMenu()">VOLTAR AO MENU</button>
        </div>
    `;
}

// 8. Renderiza a Tela Azul da Morte
function renderGameOver() {
    statusHeader.classList.add('hidden');
    tocarMusica('gameover', false);
    
    // Salva a conquista da Tela Azul
    unlockAchievement('tela_azul');
    
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
    const cardAtual = document.getElementById('card-wrapper');
    if (cardAtual) {
        cardAtual.classList.remove('scroll-in-bottom');
        cardAtual.classList.add('scroll-out-up');
    }

    setTimeout(() => {
        renderMenu();
    }, 400);
}

// Inicializa o jogo chamando o Menu
renderMenu();