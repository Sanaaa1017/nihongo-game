document.addEventListener("DOMContentLoaded", function () {
  const startBtn = document.getElementById("start");
  const submitBtn = document.getElementById("submit");
  const restartBtn = document.getElementById("restart");
  const gameContainer = document.getElementById("game");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const scoreDisplay = document.getElementById("score-value");
  const timerDisplay = document.getElementById("time-left");
  const resultScreen = document.getElementById("result");
  const finalScoreDisplay = document.getElementById("final-score");
  const feedbackDisplay = document.getElementById("feedback");
  const answerTable = document.getElementById("answer-table");
  const rules = document.getElementById("rules"); 

  let score = 0;
  let currentQuestionIndex = 0;
  let timer;
  let timeLeft = 60; // 計時器時間
  let userAnswers = []; // 儲存回答的答案和結果
  let shuffledQuestions; // 隨機排序的題目

  const questions = [
    { question: "あ", answer: "a" },
    { question: "い", answer: "i" },
    { question: "う", answer: "u" },
    { question: "え", answer: "e" },
    { question: "お", answer: "o" },
    { question: "か", answer: "ka" },
    { question: "き", answer: "ki" },
    { question: "く", answer: "ku" },
    { question: "け", answer: "ke" },
    { question: "こ", answer: "ko" },
    { question: "さ", answer: "sa" },
    { question: "し", answer: ["si", "shi"] },
    { question: "す", answer: "su" },
    { question: "せ", answer: "se" },
    { question: "そ", answer: "so" },
    { question: "た", answer: "ta" },
    { question: "ち", answer: ["ti", "chi"] },
    { question: "つ", answer: ["tu", "tsu"] },
    { question: "て", answer: "te" },
    { question: "と", answer: "to" },
    { question: "な", answer: "na" },
    { question: "に", answer: "ni" },
    { question: "ぬ", answer: "nu" },
    { question: "ね", answer: "ne" },
    { question: "の", answer: "no" },
    { question: "は", answer: "ha" },
    { question: "ひ", answer: "hi" },
    { question: "ふ", answer: ["hu", "fu"] },
    { question: "へ", answer: "he" },
    { question: "ほ", answer: "ho" },
    { question: "ま", answer: "ma" },
    { question: "み", answer: "mi" },
    { question: "む", answer: "mu" },
    { question: "め", answer: "me" },
    { question: "も", answer: "mo" },
    { question: "や", answer: "ya" },
    { question: "ゆ", answer: "yu" },
    { question: "よ", answer: "yo" },
    { question: "ら", answer: "ra" },
    { question: "り", answer: "ri" },
    { question: "る", answer: "ru" },
    { question: "れ", answer: "re" },
    { question: "ろ", answer: "ro" },
    { question: "わ", answer: "wa" },
    { question: "を", answer: "wo" },
    { question: "ん", answer: "n" },
  ];

  startBtn.addEventListener("click", startGame);
  submitBtn.addEventListener("click", checkAnswer);
  restartBtn.addEventListener("click", restartGame);

  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

  function startGame() {
    startBtn.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    rules.classList.add("hidden");
    shuffledQuestions = shuffleArray(questions).slice(0, 10); // 隨機選出10題
    showQuestion();
    timer = setInterval(updateTimer, 1000);
  }

  function showQuestion() {
    if (currentQuestionIndex < shuffledQuestions.length) {
      questionNumber.textContent = `題數: ${currentQuestionIndex + 1}/${
        shuffledQuestions.length
      }`;
      questionText.textContent =
        shuffledQuestions[currentQuestionIndex].question;
      answerInput.value = "";
      feedbackDisplay.textContent = "";
      answerInput.focus();
    } else {
      finishGame();
    }
  }

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = shuffledQuestions[currentQuestionIndex].answer;

    // 檢查答案是否是陣列，並確認使用者輸入是否在正確答案中
    const isCorrect = Array.isArray(correctAnswer)
      ? correctAnswer.includes(userAnswer)
      : userAnswer === correctAnswer;

    if (isCorrect) {
      score++;
      feedbackDisplay.innerHTML = '<span style="color: green;">答對了!!好棒</span>';
      
    } else {
      feedbackDisplay.innerHTML = '<span style="color: red;">答錯囉~~再接再厲</span>';
    }

    // 顯示正確答案
    feedbackDisplay.innerHTML += `<div>正確答案: ${
      Array.isArray(correctAnswer) ? correctAnswer.join(" / ") : correctAnswer
    }</div>`;

    // 將用戶的回答記錄到 userAnswers 陣列
    userAnswers.push({
      question: shuffledQuestions[currentQuestionIndex].question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
    });

    scoreDisplay.textContent = score;
    currentQuestionIndex++;

    setTimeout(showQuestion, 1000); // 1秒延遲
  }

  function updateTimer() {
    if (timeLeft > 0) {
      timeLeft--;
      timerDisplay.textContent = timeLeft;
    } else {
      finishGame();
    }
  }

  function finishGame() {
    clearInterval(timer);
    gameContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    finalScoreDisplay.textContent = `你的分數: ${score} / ${shuffledQuestions.length}`;
    displayAnswerTable();
  }

  function displayAnswerTable() {
    answerTable.innerHTML = "";
    const headerRow = document.createElement("tr");
    headerRow.innerHTML = `
        <th>題目</th>
        <th>你的回答</th>
        <th>正確答案</th>
        <th>結果</th>
      `;
    answerTable.appendChild(headerRow);

    userAnswers.forEach((answer) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${answer.question}</td>
          <td>${answer.userAnswer}</td>
          <td>${answer.correctAnswer}</td>
          <td>${answer.isCorrect ? "⭕" : "✖️"}</td>
        `;
      answerTable.appendChild(row);
    });
  }

  function restartGame() {
    score = 0;
    currentQuestionIndex = 0;
    timeLeft = 60;
    userAnswers = []; // 清除回答記錄
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    resultScreen.classList.add("hidden");
    startBtn.classList.remove("hidden");
    rules.classList.remove("hidden");
  }

  function shuffleArray(array) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
});
