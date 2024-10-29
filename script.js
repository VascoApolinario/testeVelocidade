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

  if (currentQuestion < 50) {
    difficultyLevel = 1;
    questionText = generateSimpleExpression();
  } else if (currentQuestion < 100) {
    difficultyLevel = 2;
    questionText = generateMediumExpression();
  } else {
    difficultyLevel = 3;
    questionText = generateHardExpression();
  }

  document.getElementById("question").textContent = questionText;

  answers = generateAnswers(correctAnswer, difficultyLevel === 3);
  
  document.querySelectorAll(".answer").forEach((el, index) => {
    el.textContent = answers[index];
    el.onclick = () => checkAnswer(parseFloat(answers[index]), difficultyLevel);
  });

  currentQuestion++;
}

function generateSimpleExpression() {
  let num1 = Math.floor(Math.random() * 10) + 1;
  let num2 = Math.floor(Math.random() * 10) + 1;
  let operator = Math.random() > 0.5 ? '+' : '*';

  correctAnswer = operator === '+' ? num1 + num2 : num1 * num2;
  return `Qual é o resultado de ${num1} ${operator} ${num2}?`;
}

function generateMediumExpression() {
  let num1 = Math.floor(Math.random() * 20) + 1;
  let num2 = Math.floor(Math.random() * 20) + 1;
  let num3 = Math.floor(Math.random() * 10) + 1;
  let operators = ['+', '*', '/'];
  let op1 = operators[Math.floor(Math.random() * 2)];
  let op2 = operators[Math.floor(Math.random() * 3)];

  if (op2 === '/') num3 = Math.max(num3, 1); // Avoid division by zero
  correctAnswer = eval(`${num1} ${op1} ${num2} ${op2} ${num3}`).toFixed(2);
  correctAnswer = parseFloat(correctAnswer); // Convert to float if real number

  return `Qual é o resultado de (${num1} ${op1} ${num2}) ${op2} ${num3}?`;
}

function generateHardExpression() {
  let num1 = Math.floor(Math.random() * 50) + 1;
  let num2 = Math.floor(Math.random() * 50) + 1;
  let num3 = Math.floor(Math.random() * 30) + 1;
  let operators = ['+', '*', '/'];
  let op1 = operators[Math.floor(Math.random() * 3)];
  let op2 = operators[Math.floor(Math.random() * 3)];

  if (op2 === '/') num3 = Math.max(num3, 1); // Avoid division by zero
  correctAnswer = eval(`${num1} ${op1} ${num2} ${op2} ${num3}`).toFixed(2);
  correctAnswer = parseFloat(correctAnswer);

  return `Qual é o resultado de (${num1} ${op1} ${num2}) ${op2} ${num3}?`;
}

function generateAnswers(correctAnswer, isReal) {
  let answers = [correctAnswer];
  let min = isReal ? -10 : -5;
  let max = isReal ? 10 : 5;
  
  while (answers.length < 4) {
    let randomAnswer;
    if (isReal) {
      randomAnswer = (Math.random() * (max - min) + min + correctAnswer).toFixed(2);
    } else {
      randomAnswer = Math.floor(Math.random() * (max - min) + min + correctAnswer);
    }
    randomAnswer = parseFloat(randomAnswer); // Ensure it's a float if needed
    if (!answers.includes(randomAnswer)) {
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
  // Using a logarithmic scale to increase IQ dynamically based on score
  let baseIQ = 70;
  let iq = baseIQ + Math.round(30 * Math.log10(score + 1));
  return Math.min(160, iq); // Cap IQ to 160 for fun
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
