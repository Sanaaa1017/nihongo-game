document.addEventListener("DOMContentLoaded", function () {
  const startArea = document.getElementById("start-area");
  const gameArea = document.getElementById("game-area");
  const resultArea = document.getElementById("result-area");
  const startBtn = document.getElementById("start");
  const submitBtn = document.getElementById("submit");
  const restartBtn = document.getElementById("restart");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question");
  const answerInput = document.getElementById("answer");
  const scoreDisplay = document.getElementById("score-value");
  const timerDisplay = document.getElementById("time-left");
  const finalScoreDisplay = document.getElementById("final-score");
  const feedbackDisplay = document.getElementById("feedback");
  const answerTable = document.getElementById("answer-table");
  const selectionArea = document.getElementById("selection-area");
  const hiraganaAllCheckbox = document.getElementById("hira-all");
  const hiraSeionCheckbox = document.getElementById("hira-seion");
  const hiraDakuonCheckbox = document.getElementById("hira-dakuon");
  const hiraHandakuonCheckbox = document.getElementById("hira-handakuon");
  const hiraYouonCheckbox = document.getElementById("hira-youon");
  const kataganaAllCheckbox = document.getElementById("kata-all");
  const kataSeionCheckbox = document.getElementById("kata-seion");
  const kataDakuonCheckbox = document.getElementById("kata-dakuon");
  const kataHandakuonCheckbox = document.getElementById("kata-handakuon");
  const kataYouonCheckbox = document.getElementById("kata-youon");

  let score = 0;
  let currentQuestionIndex = 0;
  let timer;
  let timeLeft = 60; // 計時器時間
  let userAnswers = []; // 儲存回答的答案和結果
  let randomQuestions; // 隨機排序的題目
  let hiraSeion = [];
  let hiraDakuon = [];
  let hiraHanakuon = [];
  let hiraYouon = [];
  let kataSeion = [];
  let kataDakuon = [];
  let kataHanakuon = [];
  let kataYouon = [];

  fetch("hatsuon.json")
    .then((response) => response.json())
    .then((data) => {
      hiraSeion = data.hiraSeion;
      hiraDakuon = data.hiraDakuon;
      hiraHanakuon = data.hiraHanakuon;
      hiraYouon = data.hiraYouon;
      kataSeion = data.kataSeion;
      kataDakuon = data.kataDakuon;
      kataHanakuon = data.kataHanakuon;
      kataYouon = data.kataYouon;
    })
    .catch((error) => console.error("Error loading questions:", error));

  startBtn.addEventListener("click", startGame);
  submitBtn.addEventListener("click", checkAnswer);
  restartBtn.addEventListener("click", restartGame);

  // 選取平假名
  hiraganaAllCheckbox.addEventListener("change", function () {
    const isChecked = hiraganaAllCheckbox.checked;
    hiraSeionCheckbox.checked = isChecked;
    hiraDakuonCheckbox.checked = isChecked;
    hiraHandakuonCheckbox.checked = isChecked;
    hiraYouonCheckbox.checked = isChecked;
    updatehiraganaAllCheckbox(); // 更新「全選」checkbox 狀態
  });

  function updatehiraganaAllCheckbox() {
    const HiraCheckboxes = [
      hiraSeionCheckbox,
      hiraDakuonCheckbox,
      hiraHandakuonCheckbox,
      hiraYouonCheckbox,
    ];
    const allChecked = HiraCheckboxes.every((checkbox) => checkbox.checked);
    hiraganaAllCheckbox.checked = allChecked;
    hiraganaAllCheckbox.indeterminate =
      !allChecked && HiraCheckboxes.some((checkbox) => checkbox.checked);
  }
  // 當任何個別 checkbox 狀態改變時
  [
    hiraSeionCheckbox,
    hiraDakuonCheckbox,
    hiraHandakuonCheckbox,
    hiraYouonCheckbox,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", updatehiraganaAllCheckbox);
  });

  // 選取片假名
  kataganaAllCheckbox.addEventListener("change", function () {
    const isChecked = kataganaAllCheckbox.checked;
    kataSeionCheckbox.checked = isChecked;
    kataDakuonCheckbox.checked = isChecked;
    kataHandakuonCheckbox.checked = isChecked;
    kataYouonCheckbox.checked = isChecked;
    updatekataganaAllCheckbox();
  });

  function updatekataganaAllCheckbox() {
    const kataCheckboxes = [
      kataSeionCheckbox,
      kataDakuonCheckbox,
      kataHandakuonCheckbox,
      kataYouonCheckbox,
    ];
    const allChecked = kataCheckboxes.every((checkbox) => checkbox.checked);
    kataganaAllCheckbox.checked = allChecked;
    kataganaAllCheckbox.indeterminate =
      !allChecked && kataCheckboxes.some((checkbox) => checkbox.checked);
  }

  [
    kataSeionCheckbox,
    kataDakuonCheckbox,
    kataHandakuonCheckbox,
    kataYouonCheckbox,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", updatekataganaAllCheckbox);
  });

  function startGame() {
    startArea.classList.add("hidden");
    gameArea.classList.remove("hidden");
    // 選取題目範圍
    let selectedQuestions = [];
    if (hiraSeionCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraSeion);
    }
    if (hiraDakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraDakuon);
    }
    if (hiraHandakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraHanakuon);
    }
    if (hiraYouonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraYouon);
    }
    if (kataSeionCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(kataSeion);
    }
    if (kataDakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(kataDakuon);
    }
    if (kataHandakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(kataHanakuon);
    }
    if (kataYouonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(kataYouon);
    }
    if (selectedQuestions.length === 0) {
      alert("請至少選擇一個題目範圍！");
      gameArea.classList.add("hidden");
      startArea.classList.remove("hidden");
      return;
    }
    // 隨機選擇15題
    randomQuestions = shuffleArray(selectedQuestions).slice(0, 15);
    showQuestion();
    timer = setInterval(updateTimer, 1000);
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

  function showQuestion() {
    if (currentQuestionIndex < randomQuestions.length) {
      questionNumber.textContent = `題數: ${currentQuestionIndex + 1}/${
        randomQuestions.length
      }`;
      questionText.textContent = randomQuestions[currentQuestionIndex].question;
      answerInput.value = "";
      feedbackDisplay.textContent = "";
      answerInput.focus();
    } else {
      finishGame();
    }
  }

  answerInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

  function checkAnswer() {
    const userAnswer = answerInput.value.trim().toLowerCase();
    const correctAnswer = randomQuestions[currentQuestionIndex].answer;
    // 檢查答案是否是陣列，並確認使用者輸入是否在正確答案中
    const isCorrect = Array.isArray(correctAnswer)
      ? correctAnswer.includes(userAnswer)
      : userAnswer === correctAnswer;

    if (isCorrect) {
      score++;
      feedbackDisplay.innerHTML =
        '<span style="color: green;">答對了!!好棒</span>';
    } else {
      feedbackDisplay.innerHTML =
        '<span style="color: red;">答錯囉~再接再厲</span>';
    }

    feedbackDisplay.innerHTML += `<div>正確答案: ${
      Array.isArray(correctAnswer) ? correctAnswer.join(" / ") : correctAnswer
    }</div>`;

    // 將回答記錄到userAnswers陣列
    userAnswers.push({
      question: randomQuestions[currentQuestionIndex].question,
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
    gameArea.classList.add("hidden");
    resultArea.classList.remove("hidden");
    finalScoreDisplay.textContent = `你的分數: ${score} / ${randomQuestions.length}`;
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
    resultArea.classList.add("hidden");
    startArea.classList.remove("hidden");
  }
});
