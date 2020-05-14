const TOTAL_PLAYCOUNT = 3;

let questions = [];
let activeQuestion = 0;
let audio = [
  { clip: new Audio('audio/1.mp3'), playcount: 0 },
  { clip: new Audio('audio/2.mp3'), playcount: 0 },
  { clip: new Audio('audio/3.mp3'), playcount: 0 },
  { clip: new Audio('audio/4.mp3'), playcount: 0 },
  { clip: new Audio('audio/5.mp3'), playcount: 0 },
  { clip: new Audio('audio/6.mp3'), playcount: 0 },
  { clip: new Audio('audio/7.mp3'), playcount: 0 },
  { clip: new Audio('audio/8.mp3'), playcount: 0 },
  { clip: new Audio('audio/9.mp3'), playcount: 0 },
  { clip: new Audio('audio/10.mp3'), playcount: 0 },
];

const persistValues = () => {
  playcount = audio.reduce((acc, { playcount }, i) => [ ...acc, playcount ], []);
  setCookie('playcount', JSON.stringify(playcount));
}

const reinstateValues = () => {
  const previousValues = getCookie('playcount') && JSON.parse(getCookie('playcount'));

  console.log(previousValues)
  if (!previousValues) {
    return;
  }

  audio = audio.map((aud, i) => ({ ...aud, playcount: previousValues[i] }));
}

const playAudio = (question, btn, playcount) => () => {
  question.playcount += 1;

  if (question.playcount === TOTAL_PLAYCOUNT) {
    btn.onclick = undefined;
    btn.innerHTML = 'No more plays available';
  }

  playcount.innerHTML = `PLAYS REMAINING: ${TOTAL_PLAYCOUNT - question.playcount}`;

  persistValues();
  question.clip.play();
}

const getCookie = function (name) {
  const value = '; '  + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
};

const setCookie = (name, value)  =>{
  const d = new Date;
  d.setTime(d.getTime() + 24*60*60*1000*1);
  document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}

const displayNext = (nexter) => () => {
  if (questions.length-1 < (activeQuestion + nexter) || (activeQuestion + nexter) < 0) {
    return;
  }

  audio.forEach((q) => {
    q.clip.pause();
    q.clip.currentTime = 0;
  })

  questions[activeQuestion].style.display = 'none';
  activeQuestion += nexter;
  questions[activeQuestion].style.display = '';
}

const createQuestion = (num) => {
    const question = audio[num];
    const parent = document.getElementById('questions');
    const playsAvailable = question.playcount < TOTAL_PLAYCOUNT;

    const templateQuestion = document.createElement('section');
    const title = document.createElement('h1');
    const playBtn = document.createElement('button');
    const playcount = document.createElement('p');

    title.innerHTML = `Question ${num+1}`;
    playBtn.innerHTML = playsAvailable ? 'PLAY' : 'No more plays available';
    playBtn.onclick = playsAvailable && playAudio(question, playBtn, playcount);
    playcount.innerHTML = `PLAYS REMAINING: ${TOTAL_PLAYCOUNT - question.playcount}`

    templateQuestion.appendChild(title);
    templateQuestion.appendChild(playBtn);
    templateQuestion.appendChild(playcount);
    parent.appendChild(templateQuestion);

    templateQuestion.style.display = 'none';

    return templateQuestion;
};

const loader = () => {
  reinstateValues();
  questions = audio.reduce((acc, q, i) => [ ...acc, createQuestion(i, q) ] , []);
  questions[activeQuestion].style.display = '';

  persistValues();

  document.getElementsByClassName('next')[0].onclick = displayNext(1);
  document.getElementsByClassName('previous')[0].onclick = displayNext(-1);
}

window.addEventListener('load', loader);
