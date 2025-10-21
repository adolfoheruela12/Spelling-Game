let words = [];
let quizWords = [];
let currentWord = null;
let currentIndex = 0;
let score = 0;
let totalWords = 10;
let allWordCount = 0;

// Load JSON database
fetch('data/words.json')
  .then(response => {
    if (!response.ok) throw new Error('Could not load data/words.json');
    return response.json();
  })
  .then(data => {
    words = data || [];
    allWordCount = words.length;

    if (words.length === 0) {
      document.body.innerHTML = '<p style="padding:20px;">No words found in data/words.json. Add some entries and refresh.</p>';
      return;
    }

    // Always show total word count
    document.getElementById("wordCount").textContent = `📚 Words in Database: ${allWordCount}`;

    // Start button
    document.getElementById("start-btn").addEventListener("click", () => {
      document.getElementById("intro-screen").style.display = "none";
      document.getElementById("quiz-section").style.display = "block";
      startQuiz();
    });

    // Quit button
    document.getElementById("quit-btn").addEventListener("click", handleQuit);
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `<p style="padding:20px;color:red;">Error loading words.json: ${err.message}</p>`;
  });

// ---------------------------
// QUIZ FUNCTIONS
// ---------------------------

function startQuiz() {
  totalWords = Math.min(10, words.length);
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
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("check-btn").disabled = false;
  document.getElementById("play-btn").disabled = false;
}

document.getElementById("play-btn").addEventListener("click", () => {
  if (!currentWord) return;
  const audio = new Audio(`audio/${currentWord.audio}`);
  audio.play().catch(err => {
    console.warn('Audio play failed:', err);
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

  document.getElementById("check-btn").disabled = true;
  document.getElementById("next-btn").style.display = "inline-block";
});

document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex++;
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("check-btn").disabled = false;

  if (currentIndex < totalWords) {
    loadWord();
  } else {
    showFinalScore();
  }
});

function showFinalScore() {
  document.getElementById("progress").style.display = "none";
  document.getElementById("play-btn").style.display = "none";
  document.getElementById("check-btn").style.display = "none";
  document.getElementById("next-btn").style.display = "none";
  document.getElementById("answer").style.display = "none";

  const final = document.getElementById("final-score");
  final.style.display = "block";
  final.textContent = `🎉 You scored ${score}/${totalWords}!`;
  document.getElementById("result").textContent = "";
}

// Quit function
function handleQuit() {
  const confirmQuit = confirm("Are you sure you want to quit the quiz?");
  if (confirmQuit) {
    // Reset everything and return to main menu
    document.getElementById("quiz-section").style.display = "none";
    document.getElementById("intro-screen").style.display = "block";
    document.getElementById("progress").style.display = "block";
    document.getElementById("play-btn").style.display = "inline-block";
    document.getElementById("check-btn").style.display = "inline-block";
    document.getElementById("answer").style.display = "inline-block";
    document.getElementById("final-score").style.display = "none";
    document.getElementById("result").textContent = "";
  }
}

// Shuffle helper
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
