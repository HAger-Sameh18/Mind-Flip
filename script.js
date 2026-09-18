const startScreen = document.getElementById("startScreen");
const gameScreen = document.getElementById("gameScreen");
const winScreen = document.getElementById("winScreen");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const changeLevelBtn = document.getElementById("changeLevelBtn");

const easyBtn = document.getElementById("easyBtn");
const mediumBtn = document.getElementById("mediumBtn");
const hardBtn = document.getElementById("hardBtn");

const gameBoard = document.getElementById("gameBoard");

const timer = document.getElementById("timer");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");

const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");
const finalScore = document.getElementById("finalScore");

let firstCard = null;
let secondCard = null;
let lockBoard = false;

let moves = 0;
let score = 0;
let matchedCards = 0;
let seconds = 0;
let timerInterval = null;

let difficulty = "easy";

const allCards = [
    "🍎", "🍌", "🍓", "🍇",
    "🍊", "🍉", "🥝", "🍒"
];

easyBtn.addEventListener("click", function() {
    difficulty = "easy";
    selectDifficulty(easyBtn);
});

mediumBtn.addEventListener("click", function() {
    difficulty = "medium";
    selectDifficulty(mediumBtn);
});

hardBtn.addEventListener("click", function() {
    difficulty = "hard";
    selectDifficulty(hardBtn);
});

function selectDifficulty(button) {
    easyBtn.style.background = "#374151";
    mediumBtn.style.background = "#374151";
    hardBtn.style.background = "#374151";

    button.style.background = "#8b5cf6";
}

selectDifficulty(easyBtn);

startBtn.addEventListener("click", function() {
    startScreen.style.display = "none";
    gameScreen.style.display = "block";

    score = 0;
    scoreElement.textContent = "0";

    startGame();
});

restartBtn.addEventListener("click", function() {
    startGame();
});

changeLevelBtn.addEventListener("click", function() {
    clearInterval(timerInterval);

    gameScreen.style.display = "none";
    winScreen.style.display = "none";
    startScreen.style.display = "block";

    score = 0;
    scoreElement.textContent = "0";
});

playAgainBtn.addEventListener("click", function() {
    winScreen.style.display = "none";
    gameScreen.style.display = "block";

    startGame();
});

function startGame() {
    clearInterval(timerInterval);

    firstCard = null;
    secondCard = null;
    lockBoard = false;

    moves = 0;
    matchedCards = 0;
    seconds = 0;

    movesElement.textContent = "0";
    timer.textContent = "00:00";
    scoreElement.textContent = score;

    gameBoard.innerHTML = "";

    let numberOfPairs;

    if (difficulty === "easy") {
        numberOfPairs = 4;
    } else if (difficulty === "medium") {
        numberOfPairs = 6;
    } else {
        numberOfPairs = 8;
    }

    const selectedCards = allCards.slice(0, numberOfPairs);
    const cards = [...selectedCards, ...selectedCards];

    const shuffledCards = cards.sort(function() {
        return Math.random() - 0.5;
    });

    shuffledCards.forEach(function(card) {
        const cardElement = document.createElement("div");

        cardElement.classList.add("card");
        cardElement.textContent = "?";

        cardElement.addEventListener("click", function() {

            if (
                lockBoard ||
                cardElement === firstCard ||
                cardElement.classList.contains("matched")
            ) {
                return;
            }

            cardElement.textContent = card;

            if (firstCard === null) {
                firstCard = cardElement;
                return;
            }

            secondCard = cardElement;

            moves++;
            movesElement.textContent = moves;

            if (firstCard.textContent === secondCard.textContent) {

                firstCard.classList.add("matched");
                secondCard.classList.add("matched");

                score += 10;
                scoreElement.textContent = score;

                matchedCards += 2;

                firstCard = null;
                secondCard = null;

                if (matchedCards === cards.length) {
                    endGame();
                }

            } else {

                lockBoard = true;

                setTimeout(function() {
                    firstCard.textContent = "?";
                    secondCard.textContent = "?";

                    firstCard = null;
                    secondCard = null;
                    lockBoard = false;
                }, 1000);
            }
        });

        gameBoard.appendChild(cardElement);
    });

    startTimer();
} 

function startTimer() {
    timerInterval = setInterval(function() {
        seconds++;

        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;

        timer.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0");
    }, 1000);
}

function endGame() {
    clearInterval(timerInterval);

    finalTime.textContent = timer.textContent;
    finalMoves.textContent = moves;
    finalScore.textContent = score;

    setTimeout(function() {
        gameScreen.style.display = "none";
        winScreen.style.display = "block";
    }, 500);
}