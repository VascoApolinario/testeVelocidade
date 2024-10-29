let currentQuestion = 1;
let timeLimit = 40;
let interval;
let correctAnswer;
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
      endGame();
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

  if (currentQuestion <= 20) {
    difficultyLevel = 1;
    questionText = generateEasyExpression();
  } else if (currentQuestion <= 50) {
    difficultyLevel = 2;
    questionText = generateMediumExpression();
  } else {
    difficultyLevel = 3;
    questionText = generateHardExpression();
  }

  document.getElementById("question").textContent = questionText;

  answers = generateAnswers(correctAnswer, difficultyLevel === 3 && questionText.includes("raiz quadrada"));
  
  document.querySelectorAll(".answer").forEach((el, index) => {
    el.textContent = answers[index];
    el.onclick = () => checkAnswer(parseFloat(answers[index]), difficultyLevel);
  });

  currentQuestion++;
}

function generateEasyExpression() {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operator = Math.random() > 0.5 ? '+' : '-';

  correctAnswer = operator === '+' ? num1 + num2 : num1 - num2;
  return `Qual é o resultado de ${num1} ${operator} ${num2}?`;
}

function generateMediumExpression() {
  let num1 = Math.floor(Math.random() * 20) + 1;
  let num2 = Math.floor(Math.random() * 20) + 1;
  let operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

  if (operator === '/') {
    correctAnswer = parseFloat((num1 / num2).toFixed(2)); // Aproximação com duas casas decimais
  } else if (operator === '*') {
    correctAnswer = num1 * num2;
  } else if (operator === '-') {
    correctAnswer = num1 - num2;
  } else {
    correctAnswer = num1 + num2;
  }

  return `Qual é o resultado de ${num1} ${operator} ${num2}?`;
}

function generateHardExpression() {
  let type = Math.random();

  if (type < 0.5) {
    // Pergunta de raiz quadrada
    let num = Math.floor(Math.random() * 100) + 1;
    correctAnswer = Math.round(Math.sqrt(num)); // Arredonda para o número inteiro mais próximo
    return `Qual é o número inteiro mais próximo da raiz quadrada de ${num}?`;
  } else {
    // Soma, subtração, multiplicação ou divisão simples
    let num1 = Math.floor(Math.random() * 50) + 1;
    let num2 = Math.floor(Math.random() * 50) + 1;
    let operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];

    if (operator === '/') {
      correctAnswer = parseFloat((num1 / num2).toFixed(2)); // Aproximação com duas casas decimais
    } else if (operator === '*') {
      correctAnswer = num1 * num2;
    } else if (operator === '-') {
      correctAnswer = num1 - num2;
    } else {
      correctAnswer = num1 + num2;
    }

    return `Qual é o resultado de ${num1} ${operator} ${num2}?`;
  }
}

function generateAnswers(correctAnswer, isSquareRoot) {
  let answers = [correctAnswer];
  let min = isSquareRoot ? correctAnswer - 3 : -5;
  let max = isSquareRoot ? correctAnswer + 3 : 5;

  while (answers.length < 4) {
    let randomAnswer;
    if (isSquareRoot) {
      randomAnswer = correctAnswer + Math.floor(Math.random() * (max - min + 1) + min);
    } else if (typeof correctAnswer === "number" && !Number.isInteger(correctAnswer)) {
      randomAnswer = parseFloat((Math.random() * 10 - 5 + correctAnswer).toFixed(2));
    } else {
      randomAnswer = Math.floor(Math.random() * (max - min) + min + correctAnswer);
    }
    if (!answers.includes(randomAnswer) && randomAnswer !== correctAnswer) {
      answers.push(randomAnswer);
    }
  }
  return answers.sort(() => Math.random() - 0.5);
}

function checkAnswer(selected, difficultyLevel) {
  if (selected === correctAnswer) {
    let pointsToAdd = difficultyLevel;
    score += pointsToAdd;

    // Add time for correct answer but cap at 40 seconds
    timeLimit = Math.min(40, timeLimit + 2);
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

function calculateIQ() {
  let baseIQ = 70;
  let iq = baseIQ + Math.round(30 * Math.log10(score + 1));
  return Math.min(160, iq);
}

function endGame() {
  clearInterval(interval);
  document.getElementById("lives").style.display = "none";
  document.getElementById("question").style.display = "none";
  document.querySelector(".answers").style.display = "none";
  
  let iq = calculateIQ();

  const resultText = `O seu score é: ${score}<br>O seu QI é de: ${iq}`;
  document.getElementById("result").innerHTML = resultText;
  document.getElementById("result").style.display = "block";
}

window.onload = startNewQuestion;
