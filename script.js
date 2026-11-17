(() => {
  "use strict";

  const ADMIN_CODE = "ahojdigisvet";
  const STORAGE_KEY = "digipeersQuizStats_v1";
  const EMPTY_STATS = { gamesPlayed: 0, averagePercent: 0 };
  let memoryStats = { ...EMPTY_STATS };
  let storageAvailable = true;
  const storageNote = document.getElementById("storageNote");

  function formatPercent(value) {
    return Number(value).toLocaleString("sk-SK", { maximumFractionDigits: 1 }) + " %";
  }

  function readStats() {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (!saved) return { ...EMPTY_STATS };
      const parsed = JSON.parse(saved);
      const gamesPlayed = Number(parsed.gamesPlayed);
      const averagePercent = Number(parsed.averagePercent);
      if (!Number.isFinite(gamesPlayed) || !Number.isFinite(averagePercent) || gamesPlayed < 0 || averagePercent < 0) return { ...EMPTY_STATS };
      return { gamesPlayed, averagePercent };
    } catch (error) {
      storageAvailable = false;
      return { ...memoryStats };
    }
  }

  function writeStats(stats) {
    memoryStats = { ...stats };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryStats));
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
    }
    if (storageNote) storageNote.hidden = storageAvailable;
  }

  function refreshStorageStatus() {
    try {
      window.localStorage.getItem(STORAGE_KEY);
      storageAvailable = true;
    } catch (error) {
      storageAvailable = false;
    }
    if (storageNote) storageNote.hidden = storageAvailable;
  }

  function initQuiz() {
    const questions = window.QUIZ_QUESTIONS || [];
    const startButton = document.getElementById("startButton");
    const questionCounter = document.getElementById("questionCounter");
    const questionText = document.getElementById("questionText");
    const optionsList = document.getElementById("optionsList");
    const nextButton = document.getElementById("nextButton");
    const progressFill = document.getElementById("progressFill");
    const progressPercent = document.getElementById("progressPercent");
    const progressTrack = document.getElementById("progressTrack");
    const screens = {
      start: document.getElementById("startScreen"),
      quiz: document.getElementById("quizScreen"),
      result: document.getElementById("resultScreen")
    };
    let questionIndex = 0;
    let selectedAnswers = [];

    function showScreen(name) {
      Object.entries(screens).forEach(([screenName, element]) => {
        const active = screenName === name;
        element.classList.toggle("is-active", active);
        element.setAttribute("aria-hidden", String(!active));
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function beginQuiz() {
      if (questions.length === 0) {
        window.alert("Pridaj aspoň jednu otázku do súboru questions.js.");
        return;
      }
      questionIndex = 0;
      selectedAnswers = Array(questions.length).fill(null);
      renderQuestion();
      showScreen("quiz");
    }

    function renderQuestion() {
      const current = questions[questionIndex];
      questionCounter.textContent = "Otázka " + (questionIndex + 1) + " z " + questions.length;
      questionText.textContent = current.question;
      const percentDone = Math.round((questionIndex / questions.length) * 100);
      progressFill.style.width = percentDone + "%";
      progressPercent.textContent = percentDone + " %";
      progressTrack.setAttribute("aria-valuenow", String(percentDone));
      optionsList.replaceChildren();
      current.options.forEach((optionText, optionIndex) => {
        const button = document.createElement("button");
        const selected = selectedAnswers[questionIndex] === optionIndex;
        button.type = "button";
        button.className = "option" + (selected ? " is-selected" : "");
        button.setAttribute("aria-pressed", String(selected));
        button.dataset.optionIndex = String(optionIndex);
        const letter = document.createElement("span");
        letter.className = "option-letter";
        letter.setAttribute("aria-hidden", "true");
        letter.textContent = String.fromCharCode(65 + optionIndex);
        const label = document.createElement("span");
        label.textContent = optionText;
        button.append(letter, label);
        optionsList.append(button);
      });
      nextButton.textContent = questionIndex === questions.length - 1 ? "Dokončiť kvíz" : "Ďalšia otázka";
      nextButton.disabled = selectedAnswers[questionIndex] === null;
    }

    function renderReview() {
      const reviewList = document.getElementById("reviewList");
      reviewList.replaceChildren();
      questions.forEach((question, index) => {
        const selected = selectedAnswers[index];
        const correct = selected === question.correctIndex;
        const item = document.createElement("article");
        item.className = "review-item " + (correct ? "is-correct" : "is-wrong");
        const title = document.createElement("p");
        title.className = "review-question";
        title.textContent = (index + 1) + ". " + question.question;
        const chosen = document.createElement("p");
        chosen.className = "review-answer";
        const chosenLabel = document.createElement("strong");
        chosenLabel.textContent = "Tvoja odpoveď: ";
        chosen.append(chosenLabel, document.createTextNode(selected === null ? "Bez odpovede" : question.options[selected]));
        const right = document.createElement("p");
        right.className = "review-answer";
        const rightLabel = document.createElement("strong");
        rightLabel.textContent = "Správna odpoveď: ";
        right.append(rightLabel, document.createTextNode(question.options[question.correctIndex]));
        const status = document.createElement("span");
        status.className = "review-status";
        status.textContent = correct ? "Správne" : "Nesprávne";
        item.append(title, chosen, right, status);
        reviewList.append(item);
      });
    }

    function finishQuiz() {
      const correctCount = questions.reduce((total, question, index) => total + (selectedAnswers[index] === question.correctIndex ? 1 : 0), 0);
      const score = (correctCount / questions.length) * 100;
      const previous = readStats();
      const gamesPlayed = previous.gamesPlayed + 1;
      const averagePercent = ((previous.averagePercent * previous.gamesPlayed) + score) / gamesPlayed;
      writeStats({ gamesPlayed, averagePercent });
      document.getElementById("finalScore").textContent = formatPercent(score);
      document.getElementById("scoreCaption").textContent = "Správne si odpovedal/a na " + correctCount + " z " + questions.length + " otázok.";
      renderReview();
      showScreen("result");
    }

    const heroLogo = document.querySelector(".hero-logo");
    if (heroLogo) {
      heroLogo.addEventListener("dblclick", () => {
        window.location.href = "admin.html";
      });
      heroLogo.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          window.location.href = "admin.html";
        }
      });
    }

    startButton.addEventListener("click", beginQuiz);
    optionsList.addEventListener("click", (event) => {
      const option = event.target.closest("[data-option-index]");
      if (!option) return;
      selectedAnswers[questionIndex] = Number(option.dataset.optionIndex);
      renderQuestion();
    });
    nextButton.addEventListener("click", () => {
      if (selectedAnswers[questionIndex] === null) return;
      if (questionIndex < questions.length - 1) {
        questionIndex += 1;
        renderQuestion();
      } else {
        finishQuiz();
      }
    });
    document.getElementById("restartButton").addEventListener("click", beginQuiz);
    document.getElementById("homeButton").addEventListener("click", () => showScreen("start"));
  }

  function initAdmin() {
    const form = document.getElementById("loginForm");
    const login = document.getElementById("adminLogin");
    const statsPanel = document.getElementById("adminStats");
    const codeInput = document.getElementById("adminCode");
    const error = document.getElementById("loginError");

    function showStats() {
      const stats = readStats();
      document.getElementById("gamesPlayed").textContent = String(stats.gamesPlayed);
      document.getElementById("averageScore").textContent = formatPercent(stats.averagePercent);
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (codeInput.value === ADMIN_CODE) {
        error.hidden = true;
        login.hidden = true;
        statsPanel.hidden = false;
        showStats();
      } else {
        error.hidden = false;
        codeInput.select();
      }
    });

    document.getElementById("logoutButton").addEventListener("click", () => {
      form.reset();
      error.hidden = true;
      statsPanel.hidden = true;
      login.hidden = false;
      codeInput.focus();
    });

    document.getElementById("resetStats").addEventListener("click", () => {
      if (!window.confirm("Ste si istý? Všetky uložené štatistiky sa vymažú.")) return;
      writeStats({ ...EMPTY_STATS });
      showStats();
    });
  }

  refreshStorageStatus();
  if (document.body.dataset.page === "quiz") initQuiz();
  if (document.body.dataset.page === "admin") initAdmin();
})();
