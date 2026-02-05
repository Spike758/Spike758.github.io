
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
})();
