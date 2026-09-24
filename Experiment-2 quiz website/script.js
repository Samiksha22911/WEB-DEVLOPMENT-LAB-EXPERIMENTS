/* =========================
   START QUIZ
========================= */

function startQuiz() {

    const playerName =
        document.getElementById("playerName").value.trim();

    const category =
        document.getElementById("category").value;

    const difficulty =
        document.getElementById("difficulty").value;


    if (playerName === "") {

        alert("Please enter your name.");

        return;
    }


    // Store quiz settings

    localStorage.setItem(
        "quizPlayerName",
        playerName
    );

    localStorage.setItem(
        "quizCategory",
        category
    );

    localStorage.setItem(
        "quizDifficulty",
        difficulty
    );


    // Start quiz

    window.location.href = "quiz.html";
}



/* =========================
   SAVE LEADERBOARD SCORE
========================= */

function saveScore(
    playerName,
    score,
    totalQuestions,
    timeTaken
) {

    let leaderboard =
        JSON.parse(
            localStorage.getItem("leaderboard")
        ) || [];


    const newEntry = {

        name: playerName,

        score: score,

        total: totalQuestions,

        time: timeTaken,

        date: new Date().toLocaleDateString()

    };


    leaderboard.push(newEntry);


    // Sort by score first
    // Then by time

    leaderboard.sort(function(a, b) {

        if (b.score !== a.score) {

            return b.score - a.score;

        }

        return a.time - b.time;

    });


    // Keep top 10

    leaderboard =
        leaderboard.slice(0, 10);


    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );
}



/* =========================
   DISPLAY LEADERBOARD
========================= */

function displayLeaderboard() {

    const tableBody =
        document.getElementById(
            "leaderboardBody"
        );


    if (!tableBody) {
        return;
    }


    const leaderboard =
        JSON.parse(
            localStorage.getItem("leaderboard")
        ) || [];


    tableBody.innerHTML = "";


    if (leaderboard.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    No scores yet. Play a quiz!
                </td>
            </tr>
        `;

        return;
    }


    leaderboard.forEach(function(entry, index) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>${escapeHTML(entry.name)}</td>

            <td>
                ${entry.score}/${entry.total}
            </td>

            <td>
                ${entry.time}s
            </td>

            <td>
                ${entry.date}
            </td>

        `;


        tableBody.appendChild(row);

    });
}



/* =========================
   CLEAR LEADERBOARD
========================= */

function clearLeaderboard() {

    const confirmDelete =
        confirm(
            "Are you sure you want to clear the leaderboard?"
        );


    if (!confirmDelete) {
        return;
    }


    localStorage.removeItem(
        "leaderboard"
    );


    displayLeaderboard();
}



/* =========================
   SECURITY HELPER
========================= */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;
}



/* =========================
   LOAD LEADERBOARD
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        displayLeaderboard();

    }
);