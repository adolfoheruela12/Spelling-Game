let words = [];
let quizWords = [];
let currentWord = null;
let currentIndex = 0;
let score = 0;
let totalWords = 10; // will be set after loading data

// Load JSON database
fetch('words.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load data/words.json');
    return response.json();
  })
  .then(data => {
    words = data || [];
    if (words.length === 0) {
      document.body.innerHTML = '<p style="padding:20px;">No words found in data/words.json. Add some entries and refresh.</p>';
      return;
    }
    // set totalWords to the smaller of 10 or available words
    totalWords = Math.min(10, words.length);
    startQuiz();
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `<p style="padding:20px;color:red;">Error loading words.json: ${err.message}</p>`;
  });

function startQuiz() {
  // Randomly select `totalWords` unique words
  quizWords = shuffleArray(words).slice(0, totalWords);
  currentIndex = 0;
  score = 0;
  loadWord();
}

function loadWord() {
  currentWord = quizWords[currentIndex];
  document.getElementById("progress").textContent = `Word ${currentIndex + 1} of ${totalWords}`;
  document.getElementById("result").textContent = "";
  document.getElementById("answer").value = "";
  // ensure play button enabled
  document.getElementById("play-btn").disabled = false;
}

document.getElementById("play-btn").addEventListener("click", () => {
  if (!currentWord) return;
  const audio = new Audio(`audio/${currentWord.audio}`);
  audio.play().catch(err => {
    console.warn('Audio play failed:', err);
    // optional: show a small message
    document.getElementById("result").textContent = "Unable to play audio (check file path).";
    document.getElementById("result").style.color = "orange";
  });
});

document.getElementById("check-btn").addEventListener("click", () => {
  if (!currentWord) return;
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

  // prevent double-submits while waiting
  document.getElementById("check-btn").disabled = true;
  setTimeout(() => {
    currentIndex++;
    if (currentIndex < totalWords) {
      document.getElementById("check-btn").disabled = false;
      loadWord();
    } else {
      showFinalScore();
    }
  }, 1000);
});

function showFinalScore() {
  document.getElementById("progress").style.display = "none";
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("check-btn").style.display = "none";
  document.getElementById("answer").style.display = "none";

  const final = document.getElementById("final-score");
  final.style.display = "block";
  final.textContent = `🎉 You scored ${score}/${totalWords}!`;

  document.getElementById("result").textContent = "";
}

function shuffleArray(array) {
  // Fisher–Yates shuffle is better than sort(() => ...)
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
