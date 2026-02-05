
(function(){
 
  const clickBtn = document.getElementById('click-btn');
  const clickReset = document.getElementById('click-reset');
  const clickSave = document.getElementById('click-save');
  const clickScoreEl = document.getElementById('click-score');
  const clickTimerEl = document.getElementById('click-timer');
  const clickMsg = document.getElementById('click-message');
  const clickBestEl = document.getElementById('click-best');

  let clickScore = 0, clickTime = 30, clickInterval = null, clickStarted = false;
  const CLICK_KEY = 'minigames_click_best';
  const best = parseInt(localStorage.getItem(CLICK_KEY) || '0',10);
  clickBestEl.textContent = best;

  function updateClickUI(){ clickScoreEl.textContent = clickScore; clickTimerEl.textContent = clickTime; }

  function endClicker(){
    clearInterval(clickInterval); clickInterval = null; clickStarted = false; clickBtn.disabled = true;
    clickMsg.textContent = `Время вышло! Ваш счёт: ${clickScore}.`;
    if(clickScore > (parseInt(localStorage.getItem(CLICK_KEY)||'0',10))){
      localStorage.setItem(CLICK_KEY,String(clickScore)); clickBestEl.textContent = clickScore; clickMsg.textContent += ' Новый рекорд!';
    }
  }

  clickBtn.addEventListener('click', ()=>{
    clickScore += 1; updateClickUI();
  
    clickBtn.style.transform = 'scale(0.96)'; setTimeout(()=>clickBtn.style.transform='scale(1)',120);
    if(!clickStarted){
      clickStarted = true; clickInterval = setInterval(()=>{
        clickTime -=1; updateClickUI(); if(clickTime<=0) endClicker();
      },1000);
    }
  });

  clickReset.addEventListener('click', ()=>{
    clickScore = 0; clickTime = 30; updateClickUI(); clickMsg.textContent=''; clickBtn.disabled=false; if(clickInterval){ clearInterval(clickInterval); clickInterval=null; clickStarted=false; }
  });

  clickSave.addEventListener('click', ()=>{
    const prev = parseInt(localStorage.getItem(CLICK_KEY)||'0',10);
    if(clickScore>prev){ localStorage.setItem(CLICK_KEY,String(clickScore)); clickBestEl.textContent=clickScore; clickMsg.textContent='Рекорд сохранён!'; }
    else clickMsg.textContent='Рекорд не побит.';
  });

 
  const advGen = document.getElementById('adv-gen');
  const advText = document.getElementById('adv-text');
  const advSave = document.getElementById('adv-save');
  const advClear = document.getElementById('adv-clear');
  const advSaved = document.getElementById('adv-saved');
  const ADV_KEY = 'minigames_adventures';

  const chars = ['рыцарь','маг','вор','лучник','следопыт','паладин'];
  const places = ['тёмный лес','заброшенный замок','подводное царство','горная тропа','пустыня'];
  const villains = ['дракон','колдун','гоблин','злой король','ледяной тролль'];

  function rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function renderSavedAdventures(){
    const saved = JSON.parse(localStorage.getItem(ADV_KEY)||'[]');
    advSaved.innerHTML = saved.map(s=>`<div style="padding:6px;border-bottom:1px solid rgba(255,255,255,0.02)">${s}</div>`).join('') || '<div style="color:var(--muted)">Пусто</div>';
  }

  advGen.addEventListener('click', ()=>{
    const t = `Ваш персонаж — ${rand(chars)} находится в ${rand(places)} и сражается с ${rand(villains)}.`;
    advText.textContent = t;
  });

  advSave.addEventListener('click', ()=>{
    if(!advText.textContent) return; const arr = JSON.parse(localStorage.getItem(ADV_KEY)||'[]'); arr.unshift(advText.textContent); localStorage.setItem(ADV_KEY, JSON.stringify(arr.slice(0,50))); renderSavedAdventures();
  });
  advClear.addEventListener('click', ()=>{ localStorage.removeItem(ADV_KEY); renderSavedAdventures(); advText.textContent=''; });
  renderSavedAdventures();

 
  const guessInput = document.getElementById('guess-input');
  const guessSubmit = document.getElementById('guess-submit');
  const guessRestart = document.getElementById('guess-restart');
  const guessMsg = document.getElementById('guess-message');
  const guessLeftEl = document.getElementById('guess-left');

  let secret = Math.floor(Math.random()*100)+1; let attempts = 10; guessLeftEl.textContent = attempts;

  function resetGuess(){ secret = Math.floor(Math.random()*100)+1; attempts = 10; guessLeftEl.textContent = attempts; guessMsg.textContent=''; guessInput.value=''; guessInput.disabled=false; guessSubmit.disabled=false; }

  guessSubmit.addEventListener('click', ()=>{
    const val = parseInt(guessInput.value,10);
    if(!val || val<1 || val>100){ guessMsg.textContent='Введите число от 1 до 100'; return; }
    attempts -=1; guessLeftEl.textContent = attempts;
    if(val === secret){ guessMsg.textContent = `Верно! Это было ${secret}.`; guessInput.disabled=true; guessSubmit.disabled=true; }
    else if(attempts<=0){ guessMsg.textContent = `Игра окончена. Число было ${secret}.`; guessInput.disabled=true; guessSubmit.disabled=true; }
    else guessMsg.textContent = val < secret ? 'Загаданное число больше.' : 'Загаданное число меньше.';
  });
  guessRestart.addEventListener('click', resetGuess);

 
  updateClickUI();

  clickBestEl.textContent = localStorage.getItem(CLICK_KEY) || '0';
 
  const reactArea = document.getElementById('reaction-area');
  const reactBtn = document.getElementById('react-btn');
  const reactStart = document.getElementById('react-start');
  const reactReset = document.getElementById('react-reset');
  const reactTimerEl = document.getElementById('react-timer');
  const reactSuccessEl = document.getElementById('react-success');
  const reactAvgEl = document.getElementById('react-avg');
  const reactMsg = document.getElementById('react-msg');

  let reactTimer = 30, reactInterval = null, reactAppearTimeout = null, reactRunning = false;
  let reactSuccess = 0, reactTimes = [], reactShownAt = 0;

  function placeReactButton(){
   
    const rect = reactArea.getBoundingClientRect();
    const btnW = 100, btnH = 40;
    const x = Math.random()*(rect.width - btnW); const y = Math.random()*(rect.height - btnH);
    reactBtn.style.left = x+'px'; reactBtn.style.top = y+'px'; reactBtn.style.display = 'block'; reactBtn.focus();
    reactShownAt = performance.now();
  }

  function hideReactButton(){ reactBtn.style.display='none'; reactShownAt = 0; }

  function scheduleNextAppearance(){
    const delay = 1000 + Math.random()*4000; // 1-5s
    reactAppearTimeout = setTimeout(()=>{
      placeReactButton();
    }, delay);
  }

  function startReaction(){
    if(reactRunning) return; reactRunning = true; reactTimer = 30; reactSuccess=0; reactTimes=[]; reactSuccessEl.textContent='0'; reactAvgEl.textContent='—'; reactMsg.textContent=''; updateReactTimer();
    reactInterval = setInterval(()=>{ reactTimer -=1; updateReactTimer(); if(reactTimer<=0) stopReaction(); },1000);
    scheduleNextAppearance();
  }

  function stopReaction(){ reactRunning=false; clearInterval(reactInterval); clearTimeout(reactAppearTimeout); hideReactButton(); const avg = reactTimes.length? Math.round(reactTimes.reduce((a,b)=>a+b,0)/reactTimes.length):0; reactAvgEl.textContent = reactTimes.length? avg : '—'; reactMsg.textContent = `Игра закончена. Успешных нажатий: ${reactSuccess}. Среднее время: ${reactTimes.length? avg+' мс':'—'}`; }

  function updateReactTimer(){ reactTimerEl.textContent = reactTimer; }

  reactStart.addEventListener('click', ()=>{ startReaction(); });
  reactReset.addEventListener('click', ()=>{ clearInterval(reactInterval); clearTimeout(reactAppearTimeout); reactRunning=false; reactTimer=30; updateReactTimer(); reactSuccess=0; reactTimes=[]; reactSuccessEl.textContent='0'; reactAvgEl.textContent='—'; reactMsg.textContent=''; hideReactButton(); });

  reactBtn.addEventListener('click', (e)=>{
    if(!reactShownAt) return; const dt = Math.round(performance.now() - reactShownAt); reactTimes.push(dt); reactSuccess+=1; reactSuccessEl.textContent = reactSuccess; hideReactButton(); // schedule next
    if(reactRunning) scheduleNextAppearance();
  });


  const ttBoardEl = document.getElementById('tt-board');
  const ttCurrentEl = document.getElementById('tt-current');
  const ttRestart = document.getElementById('tt-restart');
  const ttResetScores = document.getElementById('tt-reset-scores');
  const ttScoreX = document.getElementById('tt-score-x');
  const ttScoreO = document.getElementById('tt-score-o');
  const ttMsg = document.getElementById('tt-msg');

  let ttState = Array(9).fill(''); let ttPlayer = 'X'; let ttScores = {X:0,O:0};

  function renderTT(){ ttBoardEl.innerHTML=''; ttBoardEl.style.gridTemplateColumns = 'repeat(3,80px)'; ttState.forEach((v,i)=>{
    const btn = document.createElement('button'); btn.className='btn'; btn.style.width='80px'; btn.style.height='80px'; btn.style.fontSize='28px'; btn.textContent = v; btn.dataset.idx=i; btn.addEventListener('click', ()=>ttPlay(i)); ttBoardEl.appendChild(btn);
  }); ttCurrentEl.textContent = ttPlayer; }

  function ttPlay(i){ if(ttState[i] || checkTTWin()) return; ttState[i]=ttPlayer; if(checkTTWin()){ ttMsg.textContent=`Победил ${ttPlayer}`; ttScores[ttPlayer]++; updateTTScores(); } else if(ttState.every(Boolean)){ ttMsg.textContent='Ничья'; } else { ttPlayer = ttPlayer==='X'?'O':'X'; }
    renderTT(); }

  function checkTTWin(){ const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const [a,b,c] of lines){ if(ttState[a] && ttState[a]===ttState[b] && ttState[a]===ttState[c]) return ttState[a]; } return null; }

  function updateTTScores(){ ttScoreX.textContent = ttScores.X; ttScoreO.textContent = ttScores.O; }

  ttRestart.addEventListener('click', ()=>{ ttState.fill(''); ttPlayer='X'; ttMsg.textContent=''; renderTT(); });
  ttResetScores.addEventListener('click', ()=>{ ttScores={X:0,O:0}; updateTTScores(); });
  renderTT(); updateTTScores();

 
  const mazeBoard = document.getElementById('maze-board');
  const mazeStart = document.getElementById('maze-start');
  const mazeReset = document.getElementById('maze-reset');
  const mazeTimerEl = document.getElementById('maze-timer');
  const mazeMsg = document.getElementById('maze-msg');

  
  const MAZE_H = 9, MAZE_W = 9;
  const baseMaze = [
    1,1,1,1,1,1,1,1,1,
    1,2,0,0,1,0,0,3,1,
    1,0,1,0,1,0,1,0,1,
    1,0,1,0,0,0,1,0,1,
    1,0,1,1,1,0,1,0,1,
    1,0,0,0,1,0,0,0,1,
    1,0,1,0,1,1,1,0,1,
    1,0,0,0,0,0,0,0,1,
    1,1,1,1,1,1,1,1,1
  ];

  let maze = [], playerPos = 10; 
  let mazeInterval = null, mazeTime = 0, mazeRunning = false;

  function renderMaze(){ mazeBoard.innerHTML = ''; mazeBoard.style.gridTemplateColumns = `repeat(${MAZE_W},28px)`;
    maze.forEach((cell,i)=>{
      const d = document.createElement('div'); d.style.width='28px'; d.style.height='28px'; d.style.display='block'; d.style.borderRadius='4px';
      if(cell===1){ d.style.background='#153'; d.style.backgroundColor='rgba(0,0,0,0.6)'; }
      else if(cell===0){ d.style.background='linear-gradient(180deg,rgba(255,255,255,0.01),transparent)'; }
      else if(cell===2){ d.style.background='linear-gradient(90deg,var(--accent),var(--accent-2))'; }
      else if(cell===3){ d.style.background='#3ab04a'; }
      d.dataset.idx = i; mazeBoard.appendChild(d);
    });
  }

  function mazeStartGame(){ if(mazeRunning) return; maze = baseMaze.slice(); playerPos = maze.indexOf(2); mazeTime=0; mazeRunning=true; mazeMsg.textContent=''; renderMaze(); mazeInterval = setInterval(()=>{ mazeTime +=1; mazeTimerEl.textContent = mazeTime; },1000); window.addEventListener('keydown', mazeKey);
  }

  function mazeStop(){ mazeRunning=false; clearInterval(mazeInterval); window.removeEventListener('keydown', mazeKey); const exitIdx = maze.indexOf(3); if(playerPos===exitIdx) mazeMsg.textContent='Вы выиграли!'; else mazeMsg.textContent='Игра остановлена.'; }

  function mazeKey(e){ if(!mazeRunning) return; const key = e.key; const row = Math.floor(playerPos/MAZE_W), col = playerPos%MAZE_W; let nr=row, nc=col; if(key==='ArrowUp') nr--; else if(key==='ArrowDown') nr++; else if(key==='ArrowLeft') nc--; else if(key==='ArrowRight') nc++; else return; const idx = nr*MAZE_W+nc; if(maze[idx]!==1){ // move
      maze[playerPos]=0; playerPos = idx; 
      if(maze[playerPos]===3){ 
        maze[playerPos]=2; renderMaze(); mazeStop(); return; }
      maze[playerPos]=2; renderMaze(); }
  }

  mazeStart.addEventListener('click', ()=>{ mazeStartGame(); });
  mazeReset.addEventListener('click', ()=>{ clearInterval(mazeInterval); mazeRunning=false; mazeTime=0; mazeTimerEl.textContent='0'; mazeMsg.textContent=''; maze = baseMaze.slice(); playerPos = maze.indexOf(2); renderMaze(); window.removeEventListener('keydown', mazeKey); });
  
  maze = baseMaze.slice(); playerPos = maze.indexOf(2); renderMaze();

})();
