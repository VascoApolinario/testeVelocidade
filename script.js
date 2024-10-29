let currentQuestion = 1;
let timeLimit = 40;
let interval;
let correctAnswer = 4;

function startTimer() {
  let timeLeft = timeLimit;
  document.getElementById("timer").textContent = `${timeLeft}s`;

  interval = setInterval(() => {
    timeLeft--;
    document.getElementById("timer").textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(interval);
      alert("Tempo esgotado! Tente novamente.");
      resetGame();
    }
  }, 1000);
}

function resetGame() {
  currentQuestion = 1;
  timeLimit = 40;
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

  if (currentQuestion < 100) {
    let num1 = Math.floor(Math.random() * 10) + 1;
    let num2 = Math.floor(Math.random() * 10) + 1;
    correctAnswer = num1 + num2;
    questionText = `Qual é o resultado de ${num1} + ${num2}?`;
    answers = generateAnswers(correctAnswer);
  } else {
    let num = Math.floor(Math.random() * 100) + 1;
    correctAnswer = Math.sqrt(num).toFixed(2);
    questionText = `Qual é a raiz quadrada de ${num}?`;
    answers = generateAnswers(correctAnswer);
  }

  document.getElementById("question").textContent = questionText;

  document.querySelectorAll(".answer").forEach((el, index) => {
    el.textContent = answers[index];
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

function checkAnswer(selected) {
  if (selected == correctAnswer) {
    alert("Correto!");
    startNewQuestion();
  } else {
    alert("Incorreto, tente novamente!");
    resetGame();
  }
}

window.onload = startNewQuestion;
