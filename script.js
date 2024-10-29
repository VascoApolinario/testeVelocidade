let currentQuestion = 1;
let timeLimit = 40;
let interval;
let correctAnswer = 4;
let score = 0;
let lives = 3;

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("timer").textContent = `${timeLeft}s`;

  interval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      resetGame();
    }
  }, 1000);
}

function resetGame() {
  currentQuestion = 1;
  timeLimit = 40;
  score = 0;
  lives = 3;
  updateLives();
  document.getElementById("score").textContent = `Pontos: ${score}`;
  document.getElementById("result").style.display = "none";
  document.getElementById("lives").style.display = "flex";
  document.getElementById("question").style.display = "block";
  document.querySelector(".answers").style.display = "grid";
  startNewQuestion();
}

function startNewQuestion() {
  clearInterval(interval);

  if (currentQuestion > 100) {
    timeLimit = Math.max(20, timeLimit - 0.2);
  } else if (currentQuestion % 5 === 0) {
    timeLimit = Math.max(30, timeLimit - 1);
  }

  document.getElementById("timer").textContent = `${timeLimit}s`;
  startTimer();
  generateQuestion();
}

function generateQuestion() {
  let questionText;
  let answers;
  let difficultyLevel;

  if (currentQuestion < 50) {
    difficultyLevel = 1;
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    questionText = `Qual é o resultado de ${num1} + ${num2}?`;
    answers = generateAnswers(correctAnswer);
  } else if (currentQuestion < 100) {
    difficultyLevel = 2;
    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 50) + 1;
    correctAnswer = num1 + num2;
    questionText = `Qual é o resultado de ${num1} + ${num2}?`;
    answers = generateAnswers(correctAnswer);
  } else {
    difficultyLevel = 3;
    let num = Math.floor(Math.random() * 100) + 1;
    correctAnswer = Math.sqrt(num).toFixed(2);
    questionText = `Qual é a raiz quadrada de ${num}?`;
    answers = generateAnswers(correctAnswer);
  }

  document.getElementById("question").textContent = questionText;

  document.querySelectorAll(".answer").forEach((el, index) => {
    el.textContent = answers[index];
    el.onclick = () => checkAnswer(answers[index], difficultyLevel);
  });

  currentQuestion++;
}

function generateAnswers(correctAnswer) {
  let answers = [correctAnswer];
  while (answers.length < 4) {
    let randomAnswer = (Math.random() * 20 + correctAnswer - 10).toFixed(2);
    if (!answers.includes(randomAnswer)) {
      answers.push(randomAnswer);
    }
  }
  return answers.sort(() => Math.random() - 0.5);
}

function checkAnswer(selected, difficultyLevel) {
  if (parseFloat(selected) === parseFloat(correctAnswer)) {
    let pointsToAdd = difficultyLevel;
    score += pointsToAdd;
  } else {
    lives -= 1;
    updateLives();
    if (lives === 0) {
      endGame();
      return;
    }
    score -= 1;
  }
  document.getElementById("score").textContent = `Pontos: ${score}`;
  startNewQuestion();
}

function updateLives() {
  const livesContainer = document.getElementById("lives");
  livesContainer.innerHTML = "★".repeat(lives) + "☆".repeat(3 - lives);
}

function endGame() {
  clearInterval(interval);
  document.getElementById("lives").style.display = "none";
  document.getElementById("question").style.display = "none";
  document.querySelector(".answers").style.display = "none";
  
  let iq = 70;
  if (score >= 100) iq = 115;
  if (score >= 120) iq = 130;

  const resultText = `Seu score é: ${score}<br>Sua IQ é: ${iq}`;
  document.getElementById("result").innerHTML = resultText;
  document.getElementById("result").style.display = "block";
}

window.onload = startNewQuestion;
