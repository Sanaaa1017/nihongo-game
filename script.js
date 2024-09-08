document.addEventListener("DOMContentLoaded", function () {
  const startArea = document.getElementById("start-area");
  const gameArea = document.getElementById("game-area");
  const resultArea = document.getElementById("result-area");
  const startBtn = document.getElementById("start");
  const submitBtn = document.getElementById("submit");
  const restartBtn = document.getElementById("restart");
  const questionNumber = document.getElementById("question-number");
  const questionText = document.getElementById("question");
  const inputAnswer = document.getElementById("answer");
  const scoreDisplay = document.getElementById("score-value");
  const timerDisplay = document.getElementById("time-left");
  const feedbackShow = document.getElementById("feedback");
  const finalScoreShow = document.getElementById("final-score");
  const answerTable = document.getElementById("answer-table");
  const hiraAllCheckbox = document.getElementById("hira-all");
  const hiraSeionCheckbox = document.getElementById("hira-seion");
  const hiraDakuonCheckbox = document.getElementById("hira-dakuon");
  const hiraHandakuonCheckbox = document.getElementById("hira-handakuon");
  const hiraYouonCheckbox = document.getElementById("hira-youon");
  const kataAllCheckbox = document.getElementById("kata-all");
  const kataSeionCheckbox = document.getElementById("kata-seion");
  const kataDakuonCheckbox = document.getElementById("kata-dakuon");
  const kataHandakuonCheckbox = document.getElementById("kata-handakuon");
  const kataYouonCheckbox = document.getElementById("kata-youon");

  let score = 0;
  let NowQuestionIndex = 0;
  let timer;
  let timeLeft = 60; // 計時器時間
  let userAnswers = []; // 儲存回答答案和結果
  let randomQuestions; // 隨機排序的題目
  let hiraSeion = [];
  let hiraDakuon = [];
  let hiraHandakuon = [];
  let hiraYouon = [];
  let kataSeion = [];
  let kataDakuon = [];
  let kataHanakuon = [];
  let kataYouon = [];

  fetch("hatsuon.json")
    .then((response) => response.json()) //把資料轉成JSON格式
    .then((data) => {
      hiraSeion = data.hiraSeion;
      hiraDakuon = data.hiraDakuon;
      hiraHandakuon = data.hiraHandakuon;
      hiraYouon = data.hiraYouon;
      kataSeion = data.kataSeion;
      kataDakuon = data.kataDakuon;
      kataHanakuon = data.kataHanakuon;
      kataYouon = data.kataYouon;
      // console.log(data.hiraHandakuon);
    })
    .catch((error) => console.error("Error loading questions:", error));

  // 平假名 checkbox 操作
  // 監聽全選選項狀態 => 更新個別選項
  hiraAllCheckbox.addEventListener("change", function () {
    const isChecked = hiraAllCheckbox.checked;
    hiraSeionCheckbox.checked = isChecked;
    hiraDakuonCheckbox.checked = isChecked;
    hiraHandakuonCheckbox.checked = isChecked;
    hiraYouonCheckbox.checked = isChecked;
    updateHiraAllCheckbox();
  });
  // 檢查個別選項狀態 => 更新全選選項狀態
  function updateHiraAllCheckbox() {
    const HiraCheckboxes = [
      hiraSeionCheckbox,
      hiraDakuonCheckbox,
      hiraHandakuonCheckbox,
      hiraYouonCheckbox,
    ];
    // 選中所有個別選項 => 全選選項選中
    const allChecked = HiraCheckboxes.every((checkbox) => checkbox.checked);
    hiraAllCheckbox.checked = allChecked;
    // 當個別選項沒有全部都被選中，但至少有一個被選中時 => 全選選項狀態為不確定
    hiraAllCheckbox.indeterminate =
      !allChecked && HiraCheckboxes.some((checkbox) => checkbox.checked);
  }
  // 當任何個別選項狀態改變時 => 更新全選選項
  [
    hiraSeionCheckbox,
    hiraDakuonCheckbox,
    hiraHandakuonCheckbox,
    hiraYouonCheckbox,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", updateHiraAllCheckbox);
  });

  // 片假名 checkbox 操作
  kataAllCheckbox.addEventListener("change", function () {
    const isChecked = kataAllCheckbox.checked;
    kataSeionCheckbox.checked = isChecked;
    kataDakuonCheckbox.checked = isChecked;
    kataHandakuonCheckbox.checked = isChecked;
    kataYouonCheckbox.checked = isChecked;
    updateKataAllCheckbox();
  });

  function updateKataAllCheckbox() {
    const kataCheckboxes = [
      kataSeionCheckbox,
      kataDakuonCheckbox,
      kataHandakuonCheckbox,
      kataYouonCheckbox,
    ];
    const allChecked = kataCheckboxes.every((checkbox) => checkbox.checked);
    kataAllCheckbox.checked = allChecked;
    kataAllCheckbox.indeterminate =
      !allChecked && kataCheckboxes.some((checkbox) => checkbox.checked);
  }

  [
    kataSeionCheckbox,
    kataDakuonCheckbox,
    kataHandakuonCheckbox,
    kataYouonCheckbox,
  ].forEach((checkbox) => {
    checkbox.addEventListener("change", updateKataAllCheckbox);
  });

  startBtn.addEventListener("click", startGame);
  submitBtn.addEventListener("click", checkAnswer);
  restartBtn.addEventListener("click", restartGame);

  function startGame() {
    startArea.classList.add("hidden");
    gameArea.classList.remove("hidden");
    // 選取題目範圍 => 合併所選題目為一個陣列
    let selectedQuestions = [];
    if (hiraSeionCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraSeion);
    }
    if (hiraDakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraDakuon);
    }
    if (hiraHandakuonCheckbox.checked) {
      selectedQuestions = selectedQuestions.concat(hiraHandakuon);
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
    // 倒數計時器
    timer = setInterval(updateTimer, 1000);
  }
  // 隨機排列陣列裡面的元素(Fisher-Yates Shuffle)
  function shuffleArray(arr) {
    let currentIndex = arr.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // 交換元素
      temporaryValue = arr[currentIndex];
      arr[currentIndex] = arr[randomIndex];
      arr[randomIndex] = temporaryValue;
      // console.log(`交換 ${currentIndex} 和 ${randomIndex}:`, arr);
    }
    return arr;
  }
  // 顯示當前問題
  function showQuestion() {
    if (NowQuestionIndex < randomQuestions.length) {
      questionNumber.textContent = `題數: ${NowQuestionIndex + 1}/${
        randomQuestions.length
      }`;
      questionText.textContent = randomQuestions[NowQuestionIndex].question;
      inputAnswer.value = "";
      feedbackShow.textContent = "";
      // 可直接輸入答案,不需要再點擊輸入框
      inputAnswer.focus();
    } else {
      finishGame();
    }
  }
  // 按下Enter鍵提交答案
  inputAnswer.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
  // 檢查答案是否正確，回饋顯示
  function checkAnswer() {
    const userAnswer = inputAnswer.value.trim().toLowerCase();
    const correctAnswer = randomQuestions[NowQuestionIndex].answer;
    // 檢查正確答案是否為一個數組，如果是的話用 includes 方法檢查;如果不是數組的話直接比較輸入答案和正確答案
    const isCorrect = Array.isArray(correctAnswer)
      ? correctAnswer.includes(userAnswer)
      : userAnswer === correctAnswer;

    if (isCorrect) {
      score++;
      feedbackShow.innerHTML =
        '<span style="color: green;">答對了!!你好棒</span>';
    } else {
      feedbackShow.innerHTML =
        '<span style="color: red;">答錯囉~再接再厲</span>';
    }

    feedbackShow.innerHTML += `<div>正確答案: ${
      Array.isArray(correctAnswer) ? correctAnswer.join(" / ") : correctAnswer
    }</div>`;

    // 將回答和結果記錄到userAnswers陣列
    userAnswers.push({
      question: randomQuestions[NowQuestionIndex].question,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      isCorrect: isCorrect,
    });

    scoreDisplay.textContent = score;
    NowQuestionIndex++;

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
    finalScoreShow.textContent = `你的分數: ${score} / ${randomQuestions.length}`;
    showAnswerTable();
  }
  // 顯示答案表格
  function showAnswerTable() {
    answerTable.innerHTML = "";
    // 製作表頭
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
    NowQuestionIndex = 0;
    timeLeft = 60;
    userAnswers = []; // 清除回答記錄
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    resultArea.classList.add("hidden");
    startArea.classList.remove("hidden");
  }

  AnimalAnimation();

  function AnimalAnimation() {
    const leftAnimal = document.querySelector(".animal.left");
    const rightAnimal = document.querySelector(".animal.right");

    // 左右動畫
    gsap.to(leftAnimal, {
      x: -100,
      duration: 3,
      repeat: -1, // 無限次重複
      yoyo: true, // 動畫來回播放
      ease: "power1.inOut",
    });

    gsap.to(rightAnimal, {
      x: 100,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    });

    // 上下動畫
    gsap.to([leftAnimal, rightAnimal], {
      y: 20,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
});
