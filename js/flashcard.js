// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyC_8Y5vYXvXc0kvYH0jNOziiR0t1TtStTg",
  authDomain: "myproject-7ba9f.firebaseapp.com",
  projectId: "myproject-7ba9f",
  storageBucket: "myproject-7ba9f.appspot.com",
  messagingSenderId: "614709937741",
  appId: "1:614709937741:web:d11e5325162c249cfdfe04",
  measurementId: "G-LB9VZG4BHB"
};
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// === State ===
let vocab = [], studyPool = [], studyIndex = 0, testQueue = [], testIndex = 0;
let score = 0, timerSeconds = 25 * 60, timerInterval = null;

// === DOM ===
const menuStage = document.getElementById('menuStage');
const studyStage = document.getElementById('studyStage');
const testStage = document.getElementById('testStage');
const levelSelect = document.getElementById('levelSelect');
const startBtn = document.getElementById('startBtn');
const card = document.getElementById('card');
const frontWord = document.getElementById('frontWord');
const backWord = document.getElementById('backWord');
const backMeaning = document.getElementById('backMeaning');
const flipBtn = document.getElementById('flipBtn');
const nextBtn = document.getElementById('nextBtn');
const scoreDisplay = document.getElementById('scoreDisplay');
const progressBar = document.getElementById('progressBar');
const summaryOverlay = document.getElementById('summaryOverlay');
const summaryScore = document.getElementById('summaryScore');
const summaryTitle = document.getElementById('summaryTitle');
const summaryText = document.getElementById('summaryText');
const btnRetry = document.getElementById('btnRetry');
const btnHome = document.getElementById('btnHome');

// === Helper ===
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
function pickN(arr,n){ return shuffle(arr.slice()).slice(0,Math.min(n,arr.length)); }
function setProgress(frac){ progressBar.style.width = `${Math.round(frac*100)}%`; }
function updateScore(){ scoreDisplay.textContent = score; }

// === Audio ===
const AudioSynth = (() => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  function tone(f, d, t='sine', g=0.05){
    const o = ctx.createOscillator(); const gn = ctx.createGain();
    o.type = t; o.frequency.value = f; gn.gain.value = g;
    o.connect(gn); gn.connect(ctx.destination);
    o.start(); o.stop(ctx.currentTime + d);
  }
  return {
    click(){ tone(880,0.05); },
    correct(){ tone(1320,0.12); tone(990,0.08); },
    wrong(){ tone(220,0.12,'square'); },
    finish(){ tone(1760,0.15); tone(1320,0.1); }
  };
})();

// === Load vocab ===
auth.onAuthStateChanged(async (u)=>{
  if(!u){ window.location.href = "../loginNregister/login.html"; return; }
  await loadVocab();
});

async function loadVocab(){
  try{
    const snap = await db.collection('vocabularies').get();
    vocab = snap.docs.map(d => ({ id:d.id, ...d.data() }));
  }catch(e){
    console.warn('Load error', e);
    vocab = [{en:'apple',vi:'quả táo',level:'A1'}];
  }
}

// === Study ===
startBtn.addEventListener('click', startStudy);
flipBtn.addEventListener('click', ()=>{ card.classList.toggle('flipped'); AudioSynth.click(); });
card.addEventListener('click', (e)=>{ if(e.target.tagName.toLowerCase()!=='button'){ card.classList.toggle('flipped'); AudioSynth.click(); }});
nextBtn.addEventListener('click', ()=>{
  studyIndex++;
  if(studyIndex >= studyPool.length){ transitionToTest(); return; }
  showStudyCard(studyIndex);
});

function startStudy(){
  const lvl = levelSelect.value;
  let candidates = (lvl==='all') ? vocab : vocab.filter(w => w.level === lvl);
  if(!candidates.length){ alert('Không có từ cho level này!'); return; }
  studyPool = pickN(candidates, 19);
  studyIndex = 0; score = 0;
  updateScore(); setProgress(0);
  menuStage.classList.add('hidden');
  studyStage.classList.remove('hidden');
  showStudyCard(0);
}

function showStudyCard(i){
  const w = studyPool[i];
  frontWord.textContent = w.en || '...';
  backWord.textContent = w.en || '...';
  backMeaning.textContent = w.vi || '...';
  card.classList.remove('flipped');
  setProgress(i/studyPool.length);
}

// === Transition ===
function transitionToTest(){
  studyStage.style.opacity = 0;
  studyStage.style.transform = 'translateY(15px)';
  setTimeout(()=>{
    studyStage.classList.add('hidden');
    prepareTest();
    showTestStage();
  },400);
}

// === Test logic (10 MC + 5 Fill + 4 TF) ===
let testTimer;
const questionText = document.getElementById('questionText');
const optionsWrap = document.getElementById('optionsWrap');
const fillWrap = document.getElementById('fillWrap');
const fillInput = document.getElementById('fillInput');
const submitFill = document.getElementById('submitFill');
const skipBtn = document.getElementById('skipBtn');
const timerDisplay = document.getElementById('timerDisplay');

function prepareTest(){
  studyPool = shuffle(studyPool);
  const mcCount = 10, fillCount = 5, tfCount = 4;
  testQueue = [];
  for(let i=0;i<mcCount;i++) testQueue.push({type:'mc', idx:i});
  for(let j=0;j<fillCount;j++) testQueue.push({type:'fill', idx:mcCount+j});
  for(let k=0;k<tfCount;k++) testQueue.push({type:'tf', idx:(mcCount+fillCount+k)%studyPool.length});
  shuffle(testQueue);
  testIndex = 0;
}

function showTestStage(){
  testStage.classList.remove('hidden');
  testStage.style.opacity = 1;
  startTimer();
  showTestItem(0);
}

function startTimer(){
  clearInterval(testTimer);
  timerSeconds = 25 * 60;
  updateTimer();
  testTimer = setInterval(()=>{
    timerSeconds--; updateTimer();
    if(timerSeconds<=0){ clearInterval(testTimer); endTest(); }
  },1000);
}
function updateTimer(){
  const m=Math.floor(timerSeconds/60), s=timerSeconds%60;
  timerDisplay.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

function showTestItem(i){
  if(i >= testQueue.length){ endTest(); return; }
  testIndex = i;
  const item = testQueue[i], w = studyPool[item.idx];
  optionsWrap.innerHTML='';
  fillWrap.style.display='none';
  questionText.classList.remove('fade-slide');
  void questionText.offsetWidth;
  questionText.classList.add('fade-slide');
  setProgress(i/testQueue.length);

  if(item.type === 'mc'){
    const others = vocab.filter(v=>v.en !== w.en);
    const opts = shuffle([w, ...pickN(others,3)]);
    questionText.textContent = `Chọn nghĩa đúng cho: "${w.en}"`;
    opts.forEach(opt=>{
      const el=document.createElement('div');
      el.className='opt';
      el.textContent=opt.vi;
      el.onclick=()=>handleAnswer(opt.en===w.en);
      optionsWrap.appendChild(el);
    });
  }
  else if(item.type === 'fill'){
    questionText.textContent = `Viết từ tiếng Anh cho: "${w.vi}"`;
    fillWrap.style.display='block';
    submitFill.onclick = ()=>{
      const val = fillInput.value.trim().toLowerCase();
      handleAnswer(val === w.en.toLowerCase());
      fillInput.value='';
    };
    skipBtn.onclick = ()=>{ score -= 2; updateScore(); nextQuestion(); };
  }
  else if(item.type === 'tf'){
    // true/false random
    const isCorrect = Math.random() < 0.5;
    const shownVi = isCorrect ? w.vi : pickN(vocab.filter(v=>v.en!==w.en),1)[0].vi;
    questionText.textContent = `Từ "${w.en}" có nghĩa là "${shownVi}"?`;
    ['Đúng','Sai'].forEach(txt=>{
      const el=document.createElement('div');
      el.className='opt';
      el.textContent=txt;
      el.onclick=()=>handleAnswer((txt==='Đúng')===isCorrect);
      optionsWrap.appendChild(el);
    });
  }
}

function handleAnswer(correct){
  if(correct){ score += 10; AudioSynth.correct(); }
  else { score -= 5; AudioSynth.wrong(); }
  updateScore();
  setTimeout(nextQuestion, 400);
}
function nextQuestion(){ showTestItem(testIndex+1); }

function endTest(){
  clearInterval(testTimer);
  summaryOverlay.classList.add('show');
  summaryScore.textContent = score;
  summaryTitle.textContent = (score>=100)?"Phá vỡ mọi giới hạn.":(score>40)?"Continue your Streak !!!":"Hãy cố gắng hết sức nhé !!";
  summaryText.textContent = `Bạn đã hoàn thành. Tổng: ${score} điểm.`;
  AudioSynth.finish();
}

// === Summary buttons ===
btnRetry.onclick = ()=>{ summaryOverlay.classList.remove('show'); prepareTest(); showTestStage(); };
btnHome.onclick = ()=>{ location.reload(); };