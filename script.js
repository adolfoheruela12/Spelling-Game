let words = [];
let quizWords = [];
let currentWord = null;
let currentIndex = 0;
let score = 0;

// Load JSON database
fetch('data/words.json')
  .then(response => response.json())
  .then(data => {
    words = data;
    startQuiz();
  });

function startQuiz() {
  // Randomly select 10 unique words
  quizWords = shuffleArray(words).slice(0, 10);
  currentIndex = 0;
  score = 0;
  loadWord();
}

function loadWord() {
  currentWord = quizWords[currentIndex];
  document.getElementById("progress").textContent = `Word ${currentIndex + 1} of 10`;
  document.getElementById("result").textContent = "";
  document.getElementById("answer").value = "";
}

document.getElementById("play-btn").addEventListener("click", () => {
  if (!currentWord) return;
  const audio = new Audio(`audio/${currentWord.audio}`);
  audio.play();
});

document.getElementById("check-btn").addEventListener("click", () => {
  const answer = document.getElementById("answer").value.trim().toLowerCase();
  const result = document.getElementById("result");

  if (answer === currentWord.word.toLowerCase()) {
    result.textContent = "✅ Correct!";
    result.style.color = "green";
    score++;
  } else {
    result.textContent = `❌ Wrong. Correct: ${currentWord.word}`;
    result.style.color = "red";
  }

  setTimeout(() => {
    currentIndex++;
    if (currentIndex < 10) {
      loadWord();
    } else {
      showFinalScore();
    }
  }, 1200);
});

function showFinalScore() {
  document.getElementById("progress").style.display = "none";
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("check-btn").style.display = "none";
  document.getElementById("answer").style.display = "none";

  const final = document.getElementById("final-score");
  final.style.display = "block";
  final.textContent = `🎉 You scored ${score}/10!`;

  document.getElementById("result").textContent = "";
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
