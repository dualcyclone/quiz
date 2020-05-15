let questions = [];
let activeQuestion = 0;
let pictures = [
  'picture/1.png',
  'picture/2.png',
  'picture/3.png',
  'picture/4.png',
  'picture/5.png',
  'picture/6.png',
  'picture/7.png',
  'picture/8.png',
  'picture/9.png',
  'picture/10.png',
];

const displayNext = (nexter) => () => {
  if (questions.length-1 < (activeQuestion + nexter) || (activeQuestion + nexter) < 0) {
    return;
  }

  questions[activeQuestion].style.display = 'none';
  activeQuestion += nexter;
  questions[activeQuestion].style.display = '';
}

const createQuestion = (num) => {
  const question = pictures[num];
  const parent = document.getElementById('questions');

  const templateQuestion = document.createElement('section');
  templateQuestion.className = 'picture';

  const title = document.createElement('h1');
  const image = document.createElement('img');

  title.innerHTML = `Question ${num+1}`;
  image.src = question;

  templateQuestion.appendChild(title);
  templateQuestion.appendChild(image);
  parent.appendChild(templateQuestion);

  templateQuestion.style.display = 'none';

  return templateQuestion;
};

const loader = () => {
  questions = pictures.reduce((acc, q, i) => [ ...acc, createQuestion(i, q) ] , []);
  questions[activeQuestion].style.display = '';

  document.getElementsByClassName('next')[0].onclick = displayNext(1);
  document.getElementsByClassName('previous')[0].onclick = displayNext(-1);
}

window.addEventListener('load', loader);
