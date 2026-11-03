
// GAME VARIABLES

let score = 0;
let timeLeft = 90;
let timerInterval = null;
let sortedFiles = 0;
let draggedFile = null;
let gameEnded = false;

const totalFiles = 6;


// SCREEN NAVIGATION

function showInstructions() {
    clearInterval(timerInterval);
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("instructionsPage").classList.remove("hidden");
    document.getElementById("gamePage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
}

function showWelcome() {
    clearInterval(timerInterval);

    ["welcomePage", "instructionsPage", "gamePage", "resultPage"]
        .forEach(id => {
            document.getElementById(id).classList.add("hidden");
        });

    document.getElementById("welcomePage").classList.remove("hidden");
}


// START GAME

function startActivity() {
    document.getElementById("welcomePage").classList.add("hidden");
    document.getElementById("instructionsPage").classList.add("hidden");
    document.getElementById("resultPage").classList.add("hidden");
    document.getElementById("gamePage").classList.remove("hidden");

    restartGame();
}


// RESET GAME

function restartGame() {
    clearInterval(timerInterval);

    score = 0;
    timeLeft = 90;
    sortedFiles = 0;
    gameEnded = false;

    document.getElementById("gamePage").classList.remove("hidden");
    document.getElementById("resultPage").classList.add("hidden");

    document.getElementById("score").textContent = score;
    document.getElementById("timer").textContent = "01:30";
    document.getElementById("progressText").textContent = "0 / 6 FILES SORTED";
    document.getElementById("progressBar").style.width = "0%";
    document.getElementById("feedback").textContent =
        "✨ Your adventure is waiting!";

    // Reset files
    document.querySelectorAll(".file-card").forEach(file => {
        file.style.display = "flex";
        file.classList.remove("dragging");
    });

    // Reset robot capacities
    document.getElementById("tinyCount").textContent = "0 / 2";
    document.getElementById("mediumCount").textContent = "0 / 2";
    document.getElementById("largeCount").textContent = "0 / 2";

    document.querySelectorAll(".robot-drop").forEach(robot => {
        robot.classList.remove("drag-over");
    });

    setupDragAndDrop();

    timerInterval = setInterval(updateTimer, 1000);
}


// TIMER

function updateTimer() {
    if (gameEnded) return;

    timeLeft--;

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    document.getElementById("timer").textContent =
        String(minutes).padStart(2, "0") + ":" +
        String(seconds).padStart(2, "0");

    if (timeLeft <= 0) {
        finishGame();
    }
}


// DRAG AND DROP

function setupDragAndDrop() {

    const files = document.querySelectorAll(".file-card");
    const robots = document.querySelectorAll(".robot-drop");

    files.forEach(file => {

        file.addEventListener("dragstart", function(event) {

            if (gameEnded) {
                event.preventDefault();
                return;
            }

            draggedFile = file;
            file.classList.add("dragging");

            event.dataTransfer.setData(
                "text/plain",
                file.dataset.id
            );
        });

        file.addEventListener("dragend", function() {
            file.classList.remove("dragging");
        });

    });


    robots.forEach(robot => {

        robot.addEventListener("dragover", function(event) {
            event.preventDefault();

            if (!gameEnded) {
                robot.classList.add("drag-over");
            }
        });

        robot.addEventListener("dragleave", function() {
            robot.classList.remove("drag-over");
        });

        robot.addEventListener("drop", function(event) {
            event.preventDefault();

            robot.classList.remove("drag-over");

            if (gameEnded || !draggedFile) return;

            checkAnswer(draggedFile, robot);

            draggedFile = null;
        });

    });

}


// CHECK ANSWER

function checkAnswer(file, robot) {

    const correctType = file.dataset.type;
    const selectedType = robot.dataset.target;

    const feedback = document.getElementById("feedback");

    if (correctType === selectedType) {

        score += 10;
        sortedFiles++;

        file.style.display = "none";

        feedback.textContent =
            "🎉 Excellent! Correct storage. +10 points!";

        updateScore();
        updateCapacity(selectedType);
        updateProgress();

        if (sortedFiles === totalFiles) {
            finishGame();
        }

    } else {

        feedback.textContent =
            "❌ Oops! Wrong robot. Try another storage device!";

    }

}


// UPDATE SCORE

function updateScore() {
    document.getElementById("score").textContent = score;
}


// UPDATE ROBOT CAPACITY

function updateCapacity(type) {

    const count = document.querySelectorAll(
        `.file-card[data-type="${type}"][style*="display: none"]`
    ).length;

    const element = document.getElementById(type + "Count");

    element.textContent = count + " / 2";
}


// UPDATE PROGRESS

function updateProgress() {

    const percentage = (sortedFiles / totalFiles) * 100;

    document.getElementById("progressText").textContent =
        sortedFiles + " / 6 FILES SORTED";

    document.getElementById("progressBar").style.width =
        percentage + "%";
}


// FINISH GAME

function finishGame() {

    if (gameEnded) return;

    gameEnded = true;
    clearInterval(timerInterval);

    document.getElementById("gamePage").classList.add("hidden");
    document.getElementById("resultPage").classList.remove("hidden");

    document.getElementById("finalScore").textContent = score;

    document.getElementById("finalProgress").textContent =
        sortedFiles + " out of 6 files sorted correctly";

    if (sortedFiles === 6) {

        document.getElementById("resultTitle").textContent =
            "Amazing Work! 🏆";

        document.getElementById("resultMessage").textContent =
            "You are officially a Storage Master!";

    } else {

        document.getElementById("resultTitle").textContent =
            "Good Try! 🌟";

        document.getElementById("resultMessage").textContent =
            "Keep practising and become a Storage Master!";

    }
}

