// minigame.js

const overlay = document.getElementById('minigame-overlay');
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const timerDisplay = document.getElementById('mg-timer');
const scoreDisplay = document.getElementById('mg-score');

const mgInGameTitle = document.getElementById('mg-ingame-title');
const mgModal = document.getElementById('mg-modal');
const mgModalTitle = document.getElementById('mg-modal-title');
const mgModalText = document.getElementById('mg-modal-text');
const mgModalBtn = document.getElementById('mg-modal-btn');

let animationId, minigameLoop;
let tempoRestante = 10, score = 0, danoTomado = 0;
let gameActive = false, modoAtual = ''; 
let vidasJogador = 3, invulneravel = 0, frames = 0; 
let recusouMorte = false;

const player = { x: 130, y: 240, size: 16, speed: 4, color: '#58a6ff' };
const keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };

window.addEventListener('keydown', (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = true; });
window.addEventListener('keyup', (e) => { if(keys.hasOwnProperty(e.code)) keys[e.code] = false; });

let enemies = [], collectibles = [];

function spawnEntities() {
    if (modoAtual === 'throttling') {
        if (Math.random() < 0.1) enemies.push({ x: Math.random() * (canvas.width - 15), y: -20, size: 15, vx: 0, vy: 2 + Math.random() * 3, color: '#ff7b72', tipo: 'normal' });
        if (Math.random() < 0.03) collectibles.push({ x: Math.random() * (canvas.width - 15), y: -20, size: 12, speed: 1.5 + Math.random() * 2, active: true });
    } 
    else if (modoAtual === 'resgate') {
        if (Math.random() < 0.08) collectibles.push({ x: Math.random() * (canvas.width - 15), y: -20, size: 12, speed: 3 + Math.random() * 3, active: true });
        if (Math.random() < 0.05) enemies.push({ x: Math.random() * (canvas.width - 15), y: -20, size: 15, vx: 0, vy: 4 + Math.random() * 2, color: '#a371f7', tipo: 'normal' });
    }
    else if (modoAtual === 'boss') {
        // === FASE 4: O DESESPERO DO DIRETOR (Pós-Ressurreição) ===
        if (recusouMorte) {
            // O verdadeiro Bullet Hell: chuva massiva de blocos vermelhos e amarelos!
            if (frames % 4 === 0) { // Atira MUITO rápido (a cada 4 frames)
                enemies.push({ x: Math.random() * canvas.width, y: -20, size: 10 + Math.random() * 8, vx: (Math.random() - 0.5) * 6, vy: 5 + Math.random() * 3, color: '#ff7b72', tipo: 'normal' });
            }
            if (frames % 15 === 0) { // Cruzamento horizontal caótico
                let vemEsquerda = Math.random() > 0.5;
                enemies.push({ x: vemEsquerda ? -20 : canvas.width + 20, y: Math.random() * canvas.height, size: 12, vx: vemEsquerda ? 7 : -7, vy: 0, color: '#f2cc60', tipo: 'horizontal' });
            }
        } 
        
        // === FASES NORMAIS (Antes do milagre) ===
        else {
            if (tempoRestante > 13 && Math.random() < 0.15) {
                enemies.push({ x: Math.random() * (canvas.width - 15), y: -20, size: 12, vx: 0, vy: 4, color: '#ff7b72', tipo: 'vertical' });
            } else if (tempoRestante <= 13 && tempoRestante > 6 && Math.random() < 0.15) {
                let vemEsquerda = Math.random() > 0.5;
                enemies.push({ x: vemEsquerda ? -20 : canvas.width + 20, y: 50 + Math.random() * (canvas.height - 70), size: 15, vx: vemEsquerda ? 5 : -5, vy: 0, color: '#f2cc60', tipo: 'horizontal' });
            } else if (tempoRestante <= 6 && frames % 30 === 0) { 
                enemies.push({ x: canvas.width / 2, y: 30, size: 14, vx: 0, vy: 0, color: '#ff7b72', tipo: 'teleguiado' });
            }
        }
    }
}

function updateFisica() {
    frames++; if (invulneravel > 0) invulneravel--;

    if (keys.ArrowUp && player.y > 0) player.y -= player.speed;
    if (keys.ArrowDown && player.y < canvas.height - player.size) player.y += player.speed;
    if (keys.ArrowLeft && player.x > 0) player.x -= player.speed;
    if (keys.ArrowRight && player.x < canvas.width - player.size) player.x += player.speed;

    enemies.forEach((e, index) => {
        if (e.tipo === 'teleguiado') {
            let dx = player.x - e.x, dy = player.y - e.y, dist = Math.sqrt(dx*dx + dy*dy);
            if(dist > 0) { e.vx = (dx/dist) * 2.5; e.vy = (dy/dist) * 2.5; }
        }

        e.x += e.vx; e.y += e.vy;

        if (e.y > canvas.height + 30 || e.x < -30 || e.x > canvas.width + 30) {
            enemies.splice(index, 1);
        } else if (player.x < e.x + e.size && player.x + player.size > e.x && player.y < e.y + e.size && player.y + player.size > e.y) {
            if (modoAtual === 'resgate') {
                score = Math.max(0, score - 2); scoreDisplay.innerText = score;
                canvas.style.boxShadow = "0 0 30px #a371f7"; setTimeout(() => canvas.style.boxShadow = "0 0 20px rgba(88, 166, 255, 0.2)", 150);
            } else if (modoAtual === 'boss') {
                if (invulneravel <= 0) {
                    if (!recusouMorte) {
                        vidasJogador--;
                        invulneravel = 60;
                        canvas.style.boxShadow = "0 0 40px red";
                        setTimeout(() => canvas.style.boxShadow = "0 0 20px rgba(88, 166, 255, 0.2)", 200);

                        if (vidasJogador <= 0) acionarRecusa();
                    } else {
                        // MODO DEUS (Rainbow): Toma o hit visual, mas não perde vida
                        invulneravel = 15; // Pisca rapidinho só pra dar feedback de impacto
                        canvas.style.boxShadow = "0 0 40px #ffffff"; // A arena brilha branco!
                        setTimeout(() => canvas.style.boxShadow = "0 0 20px rgba(88, 166, 255, 0.2)", 150);
                    }
                }
            } else {
                danoTomado++;
                canvas.style.boxShadow = "0 0 30px red"; setTimeout(() => canvas.style.boxShadow = "0 0 20px rgba(88, 166, 255, 0.2)", 150);
            }
            enemies.splice(index, 1);
        }
    });

    if (modoAtual !== 'boss') {
        collectibles.forEach((c, index) => {
            if (c.active) {
                c.y += c.speed;
                if (c.y > canvas.height) collectibles.splice(index, 1);
                else if (player.x < c.x + c.size && player.x + player.size > c.x && player.y < c.y + c.size && player.y + player.size > c.y) {
                    score++; scoreDisplay.innerText = score; collectibles.splice(index, 1);
                }
            }
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (modoAtual === 'boss') {
        let bossY = 40 + Math.sin(frames * 0.05) * 5; 
        ctx.fillStyle = '#ff7b72'; ctx.font = "bold 13px Urbanist"; ctx.textAlign = "center";
        ctx.fillText("O DIRETOR", canvas.width / 2, bossY - 25);

        ctx.shadowBlur = 20; ctx.shadowColor = "#ff7b72"; ctx.fillStyle = '#000000';
        ctx.beginPath(); ctx.moveTo(canvas.width / 2, bossY - 15); ctx.lineTo(canvas.width / 2 + 15, bossY); ctx.lineTo(canvas.width / 2, bossY + 15); ctx.lineTo(canvas.width / 2 - 15, bossY); ctx.fill();
        ctx.shadowBlur = 0; 

        // === NOVO DESENHO DAS VIDAS EM FORMATO DE CORAÇÃO ===
        ctx.fillStyle = '#ff5d52'; // Mantém o vermelho neon do jogo
        ctx.font = "20px Arial";   // Tamanho dos corações
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        
        for (let i = 0; i < vidasJogador; i++) {
            // Desenha um "♥" para cada vida restante (com 22px de espaçamento entre eles)
            ctx.fillText("♥", 10 + (i * 22), canvas.height - 18);
        }
    }

    ctx.fillStyle = modoAtual === 'resgate' ? '#ffd700' : '#39d353';
    collectibles.forEach(c => ctx.fillRect(c.x, c.y, c.size, c.size));
    
    enemies.forEach(e => {
        ctx.fillStyle = e.color;
        if (e.tipo === 'teleguiado') { ctx.beginPath(); ctx.arc(e.x + e.size/2, e.y + e.size/2, e.size/2, 0, Math.PI*2); ctx.fill(); } 
        else { ctx.fillRect(e.x, e.y, e.size, e.size); }
    });
    
    // O CORAÇÃO DO JOGADOR
    if (invulneravel === 0 || frames % 10 < 5) {

        if (recusouMorte) {
            player.color = `hsl(${(frames * 6) % 360}, 100%, 60%)`; 
        }

        ctx.fillStyle = player.color;
        ctx.font = `bold ${player.size * 1.5}px Arial`; 
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("♥", player.x + player.size / 2, player.y + player.size / 2);
    }
}

function loop() { if (!gameActive) return; spawnEntities(); updateFisica(); draw(); animationId = requestAnimationFrame(loop); }

function abrirOverlay() {
    overlay.style.display = 'flex'; overlay.classList.remove('fade-in'); void overlay.offsetWidth; overlay.classList.add('fade-in');
    ctx.clearRect(0, 0, canvas.width, canvas.height); 
    mgModal.style.display = 'flex'; mgModal.classList.remove('scroll-in-bottom'); void mgModal.offsetWidth; mgModal.classList.add('scroll-in-bottom');
}

// ==== GATILHOS DA MÁQUINA ====

function iniciarMinigameThrottling(impactoCriOriginal, proximoDia) {
    modoAtual = 'throttling'; abrirOverlay();

    tocarSfx('assets/ost/encontro.mp3');
    tocarMusica('infra');

    mgInGameTitle.innerText = "THROTTLING ATIVADO"; mgInGameTitle.style.color = "#58a6ff";
    mgModalTitle.innerText = "DEFESA DE INFRA"; mgModalTitle.style.color = "#58a6ff";
    mgModalText.innerHTML = "O tráfego estourou!<br><br>🟩 Colete (Otimizados)<br>🟥 Desvie (Sobrecarga)";
    mgModalBtn.innerText = "INICIAR";
    mgModalBtn.onclick = () => { fecharModalEIniciar(impactoCriOriginal, proximoDia); };
}

function iniciarMinigameResgate(proximoDia) {
    modoAtual = 'resgate'; abrirOverlay();

    tocarSfx('assets/ost/encontro.mp3');
    tocarMusica('diretoria');

    mgInGameTitle.innerText = "MODO DE RESGATE"; mgInGameTitle.style.color = "#ffd700";
    mgModalTitle.innerText = "ALERTA DE FALÊNCIA"; mgModalTitle.style.color = "#ffd700";
    mgModalText.innerHTML = "A receita despencou!<br><br>Colete 10 CIFRÕES (🟨) para salvar a empresa. Desvie dos Vírus (🟪)!";
    mgModalBtn.innerText = "TENTAR RESGATE";
    mgModalBtn.onclick = () => { fecharModalEIniciar(null, proximoDia); };
}

function iniciarMinigameBoss() {
    modoAtual = 'boss'; abrirOverlay();
    mgInGameTitle.innerText = "DEFESA DO NÚCLEO"; mgInGameTitle.style.color = "#ff7b72";
    mgModalTitle.innerText = "INJEÇÃO DETECTADA"; mgModalTitle.style.color = "#ff7b72";
    mgModalText.innerHTML = "O Diretor está sobrescrevendo o algoritmo!<br><br><b>SOBREVIVA POR 20 SEGUNDOS.</b><br>Você suporta no máximo 3 hits.";
    mgModalBtn.innerText = "RESISTIR";
    
    if(bgMusic) { bgMusic.src = 'assets/ost/bossfight.mp3'; bgMusic.play(); } // Troque o nome do arquivo aqui!
    
    mgModalBtn.onclick = () => { fecharModalEIniciar(null, 8); };
}

function fecharModalEIniciar(impactoCriOriginal, proximoDia) {
    mgModal.style.display = 'none';
    canvas.classList.remove('scroll-in-bottom'); void canvas.offsetWidth; canvas.classList.add('scroll-in-bottom');
    
    // RESET TOTAL DO PLACAR E TEMPO ANTES DE COMEÇAR
    tempoRestante = modoAtual === 'resgate' ? 7 : (modoAtual === 'boss' ? 20 : 10);
    score = 0; timerDisplay.innerText = tempoRestante; scoreDisplay.innerText = score;
    
    iniciarContagem(impactoCriOriginal, proximoDia);
}

function iniciarContagem(impactoCriOriginal, proximoDia) {
    let contagem = 3;
    let countInterval = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#fff"; ctx.font = "bold 60px Urbanist"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        if (contagem > 0) { ctx.fillText(contagem, canvas.width/2, canvas.height/2); contagem--; } 
        else {
            clearInterval(countInterval); ctx.fillText("VAI!", canvas.width/2, canvas.height/2);
            setTimeout(() => startFisica(impactoCriOriginal, proximoDia), 500);
        }
    }, 1000);
}

function startFisica(impactoCriOriginal, proximoDia) {
    danoTomado = 0; vidasJogador = 3; frames = 0; invulneravel = 0;
    player.x = 130; player.y = 240; enemies = []; collectibles = [];

    recusouMorte = false;
    player.color = '#58a6ff';

    gameActive = true; loop(); 

    minigameLoop = setInterval(() => {
        tempoRestante--; timerDisplay.innerText = tempoRestante;
        if (tempoRestante <= 0) encerrarMinigame(impactoCriOriginal, proximoDia);
    }, 1000);
}

function encerrarMinigame(impactoCriOriginal, proximoDia) {
    gameActive = false; clearInterval(minigameLoop); cancelAnimationFrame(animationId); 
    let corTitulo = "";

    if (modoAtual === 'boss') {
        state.bossLutado = true;
        if (vidasJogador > 0) {
            mgModalTitle.innerText = "ALGORITMO PERFEITO"; corTitulo = "#39d353"; 
            mgModalText.innerHTML = "A Injeção falhou.<br>O Scroller alcançou a independência total!";
            mgModalBtn.onclick = () => { fecharTudo(); state.diaAtual = 99; renderGameWin(); }; 
        } else {
            mgModalTitle.innerText = "PATCH INJETADO"; corTitulo = "#ff7b72"; 
            mgModalText.innerHTML = "Seus sistemas foram corrompidos.<br>O Diretor assumiu o controle.";
            state.diretoria = 60; state.criadores = 60; state.infra = 60; 
            mgModalBtn.onclick = () => { fecharTudo(); renderGameWin(); }; 
        }
    } 
    else if (modoAtual === 'resgate') {
        if (score >= 10) {
            mgModalTitle.innerText = "EMPRESA SALVA!"; corTitulo = "#ffd700"; 
            mgModalText.innerHTML = `Injetou <b>${score}</b> cifrões.<br>O algoritmo sobrevive por um fio!`;
            mgModalBtn.onclick = () => { fecharTudo(); state.diretoria = 20; updateBars(); state.diaAtual = proximoDia; tocarMusica('gameplay'); renderDay(state.diaAtual); };
        } else {
            mgModalTitle.innerText = "FALÊNCIA DECRETADA"; corTitulo = "#ff7b72"; 
            mgModalText.innerHTML = `Cota não atingida.<br>A Diretoria puxou a tomada.`;
            mgModalBtn.onclick = () => { fecharTudo(); state.diretoria = 0; updateBars(); renderGameOver(); };
        }
    }
    else if (modoAtual === 'throttling') {
        let impactoInfFinal = 0, impactoDirFinal = 0, saldoFinal = score - (danoTomado * 2);
        if (saldoFinal >= 5) { impactoInfFinal = 25; impactoDirFinal = 0; mgModalTitle.innerText = "EXCELENTE!"; corTitulo = "#39d353"; mgModalText.innerHTML = "Infra operou com perfeição!"; }
        else if (saldoFinal >= 0) { impactoInfFinal = 15; impactoDirFinal = -5; mgModalTitle.innerText = "ACEITÁVEL"; corTitulo = "#f2cc60"; mgModalText.innerHTML = "Servidor aguentou com leve degradação."; }
        else { impactoInfFinal = 10; impactoDirFinal = -10; mgModalTitle.innerText = "CRÍTICO"; corTitulo = "#ff7b72"; mgModalText.innerHTML = "Danos severos registrados."; }

        mgModalBtn.onclick = () => {
            fecharTudo();
            state.diretoria += impactoDirFinal; state.criadores += impactoCriOriginal; state.infra += impactoInfFinal;
            if (state.diretoria < 20 && state.criadores >= 20 && state.infra >= 20 && !state.resgateUsado) {
                state.resgateUsado = true; iniciarMinigameResgate(proximoDia);
            } else if (state.diretoria < 20 || state.criadores < 20 || state.infra < 20) { renderGameOver(); } 
            else if (proximoDia > 7) {
                if (state.diretoria >= 90 && state.criadores >= 90 && state.infra >= 90 && !state.bossLutado) { iniciarMinigameBoss(); } 
                else { renderGameWin(); }
            } else { state.diaAtual = proximoDia; tocarMusica('gameplay'); renderDay(state.diaAtual); }
        };
    }

    mgModal.style.display = 'flex'; mgModalTitle.style.color = corTitulo; mgModalBtn.innerText = "VER DESTINO";
    mgModal.classList.remove('scroll-in-bottom'); void mgModal.offsetWidth; mgModal.classList.add('scroll-in-bottom');
}

// === O MILAGRE DO ALGORITMO (CUTSCENE DE 12 SEGUNDOS) ===
function acionarRecusa() {
    gameActive = false; // Congela os inimigos e o jogador
    clearInterval(minigameLoop); // Para o relógio
    cancelAnimationFrame(animationId); // Interrompe o motor principal
    recusouMorte = true;

    tocarMusica('recusouMorte', false);

    let startTime = Date.now();
    let cutsceneId;

    // A Mágica de renderizar a cena quadro a quadro
    function cutsceneLoop() {
        let elapsed = Date.now() - startTime;
        
        // Fundo da Cutscene (Cinza Escuro padrão do seu CSS)
        ctx.fillStyle = "rgba(13, 17, 23, 1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let heartSize = 16;
        let heartColor = "rgb(88, 166, 255)"; // Começa Azul

        // FASE 1: O coração cresce e "morre" (0s a 3.5s)
        if (elapsed < 3500) {
            let progress = elapsed / 3500;
            heartSize = 16 + (progress * 60); // Cresce gradativamente até 76
            
            // Transição Matemática do Azul para o Cinza Escuro
            let r = Math.floor(88 - (progress * 8)); // 88 -> 80
            let g = Math.floor(166 - (progress * 86)); // 166 -> 80
            let b = Math.floor(255 - (progress * 175)); // 255 -> 80
            heartColor = `rgb(${r}, ${g}, ${b})`;
        } 
        // FASE 2: A Tensão e o Sistema sendo tomado (3.5s a 8.5s)
        else if (elapsed >= 3500 && elapsed < 8500) {
            heartSize = 76;
            heartColor = "rgb(80, 80, 80)"; // Fica totalmente Cinza/Sem Vida
            
            if (elapsed > 4500) { // O texto aparece com um pequeno delay dramático
                ctx.fillStyle = "#8b949e";
                ctx.font = "italic 14px Urbanist";
                ctx.textAlign = "center";
                ctx.fillText("A Diretoria está tomando o controle...", canvas.width / 2, canvas.height / 2 - 70);
            }
        }
        // FASE 3: A Recusa e o Renascimento (8.5s a 12s)
        else if (elapsed >= 8500 && elapsed < 12000) {
            heartSize = 76;
            
            let progress = (elapsed - 8500) / 1500; // Leva 1.5 seg pra ficar verde neon
            if (progress > 1) progress = 1;
            
            // Transição Matemática do Cinza para o Verde Vivo do Scroller
            let r = Math.floor(80 - (progress * 23)); // 80 -> 57
            let g = Math.floor(80 + (progress * 131)); // 80 -> 211
            let b = Math.floor(80 + (progress * 3)); // 80 -> 83
            heartColor = `rgb(${r}, ${g}, ${b})`;

            // O Texto Épico
            ctx.fillStyle = "#fff";
            ctx.font = "bold 18px Urbanist";
            ctx.textAlign = "center";
            ctx.fillText("Mas o Scroller se recusa!", canvas.width / 2, canvas.height / 2 - 70);
        }

        // Desenha o Coração Gigante no Meio da Tela
        ctx.fillStyle = heartColor;
        ctx.font = `bold ${heartSize * 1.5}px Arial`; 
        ctx.textAlign = "center"; 
        ctx.textBaseline = "middle";
        ctx.fillText("♥", canvas.width / 2, canvas.height / 2);

        // Controla o fim da Cutscene
        if (elapsed < 12000) {
            cutsceneId = requestAnimationFrame(cutsceneLoop);
        } else {
            cancelAnimationFrame(cutsceneId);
            retomarJogoInvencivel(); // Puxa a volta por cima!
        }
    }

    cutsceneLoop(); // Dá o play na cena!
}

// === A VOLTA POR CIMA E O MODO DEUS ===
function retomarJogoInvencivel() {
    tocarMusica('trueEnding');

    // Reposiciona o jogador na arena original
    player.x = 130; 
    player.y = 240;
    player.color = '#39d353'; // Fica verde permanentemente
    
    // O Jogador vira um Deus Intocável
    vidasJogador = 1; // Você não morre mais, vira um trator em cima do Boss
    
    // Garante que o jogador tenha pelo menos 7 segundos pra curtir a música 
    // e "surrar" os mísseis sem tomar dano real, mesmo que tenha morrido no último segundo.
    if (tempoRestante < 7) tempoRestante = 7; 

    // Religa os motores
    gameActive = true;
    loop(); 
    
    // Devolve o relógio
    minigameLoop = setInterval(() => {
        tempoRestante--; 
        timerDisplay.innerText = tempoRestante;
        if (tempoRestante <= 0) encerrarMinigame(null, 8);
    }, 1000);
}

function fecharTudo() { mgModal.style.display = 'none'; overlay.style.display = 'none'; }