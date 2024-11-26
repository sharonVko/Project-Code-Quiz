import './style.css'
import IQuestion from './interfaces/IQuestion';
// import Swal from 'sweetalert2';

//home view language choice
const home = document.querySelector('#home') as HTMLDivElement;
const easyGermanBtn = document.querySelector('#easyGermanBtn') as HTMLButtonElement;
const hardGermanBtn = document.querySelector('#hardGermanBtn') as HTMLButtonElement;
const mixedGermanBtn = document.querySelector('#mixedGermanBtn') as HTMLButtonElement; //hinzugefügt
const easyEnglishBtn = document.querySelector('#easyEnglishBtn') as HTMLButtonElement;
const hardEnglishBtn = document.querySelector('#hardEnglishBtn') as HTMLButtonElement;
const mixedEnglishBtn = document.querySelector('#mixedEnglishBtn') as HTMLButtonElement; //hinzugefügt

//quiz view
const quiz = document.querySelector('#quiz') as HTMLDivElement;
const progressCounter = document.querySelector('#progressCounter') as HTMLDivElement;
const question = document.querySelector('#question') as HTMLHeadElement;
const radios = document.getElementsByName('choice') as NodeListOf<HTMLInputElement>;
const labels = document.querySelectorAll('label') as NodeListOf<HTMLLabelElement>;
/* const answerAbtn = document .querySelector('#answerAbtn')
const answerBbtn = document .querySelector('#answerBbtn')
const answerCbtn = document .querySelector('#answerCbtn')
const answerDbtn = document .querySelector('#answerDbtn') */

const answerTextA = document.querySelector('#answerTextA') as HTMLDivElement;
const answerTextB = document.querySelector('#answerTextB') as HTMLDivElement;
const answerTextC = document.querySelector('#answerTextC') as HTMLDivElement;
const answerTextD = document.querySelector('#answerTextD') as HTMLDivElement;
const submitAnswer = document.querySelector('#submitAnswer') as HTMLButtonElement;

//leaderboard view
const leaderBoard = document.querySelector('#leaderBoard') as HTMLDivElement;
const points = document.querySelector('#points') as HTMLHeadElement;
const returnHome = document.querySelector('#returnHome') as HTMLButtonElement;
const progressBar = document.querySelector('.progress-bar2') as HTMLDivElement;
// const table = document.querySelector('.table') as HTMLDivElement;

const gameList = [
  'https://vz-wd-24-01.github.io/typescript-quiz/questions/leicht.json',
  'https://vz-wd-24-01.github.io/typescript-quiz/questions/schwer.json',
  'src/questions/qMixedGE.json',
  'https://vz-wd-24-01.github.io/typescript-quiz/questions/easy.json',
  'https://vz-wd-24-01.github.io/typescript-quiz/questions/hard.json',
  'src/questions/qMixedEN.json',
]; // 2 hinzugefügt



let questionList: IQuestion[] = [];
let answeredList: number[] = [];
let quizPosition = -1;
let selAnswer = -1;
let isAnswer = false;
let score = 0;

const displayLeaderBoard = () => {
  quiz.classList.remove('active')
  quiz.classList.add('hidden')
  leaderBoard.classList.remove('hidden')
  leaderBoard.classList.add('active')
  leaderBoard.classList.add('flex')
  points.textContent = score + " / " + questionList.length;

}

const displayAnswer = () => {

  radios.forEach((radio) => {
    radio.disabled = true;
  })

  answeredList.push(selAnswer)
  if (selAnswer != questionList[quizPosition].correct) {
    labels[selAnswer].classList.add('wrongAnswer')
  } else {
    score++;
  }

  labels[questionList[quizPosition].correct].classList.add('correctAnswer')
}

const displayQuestion = () => {
  quizPosition++;
  if (quizPosition == questionList.length) {
    displayLeaderBoard()
    return
  }

  radios.forEach((radio) => {
    radio.disabled = false;
    radio.checked = false;
  })

  const q = questionList[quizPosition];
  progressCounter.innerHTML = `<div class='bold'>Question ${quizPosition + 1}/</div>${questionList.length}`;
  progressBar.style.width = Math.floor((quizPosition + 1) / questionList.length * 100) + '%';
  question.textContent = q.question;
  answerTextA.textContent = q.answers[0];
  answerTextB.textContent = q.answers[1];
  answerTextC.textContent = q.answers[2];
  answerTextD.textContent = q.answers[3];

  submitAnswer.disabled = true;
}

const startGame = async (id: number) => {
  try {
    score = 0;
    quizPosition = -1;
    home.classList.remove('active')
    home.classList.add('hidden')
    quiz.classList.remove('hidden')
    quiz.classList.add('active')

    const response: Response = await fetch(gameList[id]);
    console.log(response);
    questionList = await response.json();
    questionList = questionList
    // .slice(0, 2);
    console.log(questionList);

    displayQuestion()
  } catch (error) {
    console.error('fetch failed', error);
  }
}

easyGermanBtn?.addEventListener('click', () => startGame(0));
hardGermanBtn?.addEventListener('click', () => startGame(1));
mixedGermanBtn?.addEventListener('click', () => startGame(2)); //hinzugefügt, index geschoben
easyEnglishBtn?.addEventListener('click', () => startGame(3));
hardEnglishBtn?.addEventListener('click', () => startGame(4));
mixedEnglishBtn?.addEventListener('click', () => startGame(5));//hinzugefügt


submitAnswer.addEventListener('click', (e) => {
  e.preventDefault();
  if (isAnswer) {

    submitAnswer.textContent = "Validate";
    if (selAnswer != questionList[quizPosition].correct) {
      labels[selAnswer].classList.remove('wrongAnswer')
    }

    labels[questionList[quizPosition].correct].classList.remove('correctAnswer')
    radios.forEach((radio) => {
      radio.disabled = false;
    })
    displayQuestion();
  } else {
    submitAnswer.innerHTML = `Next <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M4 11v2h12l-5.5 5.5l1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5L16 11z"/></svg>`;
    displayAnswer();
  }
  console.log({ isAnswer })
  isAnswer = !isAnswer
  console.log({ isAnswer })
})

labels.forEach((label, index) => label.addEventListener('click', () => {
  selAnswer = index;
  submitAnswer.disabled = false;
}))


returnHome.addEventListener('click', () => {
  leaderBoard.classList.remove('active')
  leaderBoard.classList.remove('flex')
  leaderBoard.classList.add('hidden')
  home.classList.remove('hidden')
  home.classList.add('active')
})



// table.addEventListener('click', async () => {
//   const { value: text } = await Swal.fire({
//     input: "text",
//     inputLabel: "Enter your Name",
//     inputPlaceholder: "Enter your Name"
//   });
//   if (text) {
//     Swal.fire(`Entered Name: ${text}`);
//   }
// })