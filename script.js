// ===== НАСТРОЙКИ =====

// SHA-256 хэш пароля
// (как получить — ниже)
const PASSWORD_HASH =
  "a4963c50cd25fdf92fee9178af3655b0eaff2938adc1fa0e074d25e6f456fd74";

// загадки
const questions = [
  {
    text: "James Buchanan-?? The President of the United States?",
    answer: "15"
  },
  {
    text: "Второй месяц года?",
    answer: "2"
  },
  {
    text: "Текущий год?",
    answer: "2026"
  }
];

// =====================

let currentStep = Number(localStorage.getItem("step")) || 0;

// DOM
const passwordScreen = document.getElementById("password-screen");
const quizScreen = document.getElementById("quiz-screen");
const finalScreen = document.getElementById("final-screen");
const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer-input");
const answerError = document.getElementById("answer-error");
const passwordError = document.getElementById("password-error");
const dayEl = document.getElementById("day");
const monthEl = document.getElementById("month");
const yearEl = document.getElementById("year");

// автологин
if (localStorage.getItem("access") === "true") {
  passwordScreen.classList.remove("active");
  showQuiz();
}

// SHA-256
async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// проверка пароля
async function checkPassword() {
  const input = document.getElementById("password-input").value.trim();

  if (!input) {
    passwordError.textContent = "Введите пароль";
    return;
  }

  const hashed = await sha256(input);

  if (hashed === PASSWORD_HASH) {
    localStorage.setItem("access", "true");
    passwordError.textContent = "";
    passwordScreen.classList.remove("active");
    showQuiz();
  } else {
    passwordError.textContent = "Неверный пароль 💔";
  }
}

// показать загадку
function showQuiz() {
updateDateProgress();
  if (currentStep >= questions.length) {
    showFinal();
    return;
  }

  quizScreen.classList.add("active");
  questionTitle.textContent = questions[currentStep].text;
}

// отправка ответа
function submitAnswer() {
  const value = answerInput.value.trim();

  if (!value) {
    answerError.textContent = "Напиши число 🙂";
    return;
  }

  if (value === questions[currentStep].answer) {
    currentStep++;
    localStorage.setItem("step", currentStep);
    answerInput.value = "";
    answerError.textContent = "";
    showQuiz();
  } else {
    answerError.textContent = "Подумай ещё 😉";
  }
}

// финал
function showFinal() {
  // Показываем дату на секунду
  updateDateProgress(); // дата уже заполнена
  quizScreen.classList.remove("active");
  finalScreen.classList.remove("active"); // скрываем финальный экран на секундочку

  overlay.classList.add("active"); // затемнение

  setTimeout(() => {
    overlay.classList.remove("active");
    finalScreen.classList.add("active");
    document.body.classList.add("heartbeat"); // запускаем пульс

    // Построчно появление текста
    const lines = document.querySelectorAll(".final-line");
    lines.forEach((line, index) => {
      setTimeout(() => line.classList.add("visible"), index * 800); 
    });
  }, 1000); // 1 секунда для демонстрации даты
}

function updateDateProgress() {
  if (currentStep >= 1) {
    dayEl.textContent = "15";
    dayEl.classList.add("filled");
  }
  if (currentStep >= 2) {
    monthEl.textContent = "02";
    monthEl.classList.add("filled");
  }
  if (currentStep >= 3) {
    yearEl.textContent = "2026";
    yearEl.classList.add("filled");
  }
}