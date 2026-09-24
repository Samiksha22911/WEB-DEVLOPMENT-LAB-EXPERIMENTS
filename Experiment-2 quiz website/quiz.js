/* =========================
   QUIZ VARIABLES
========================= */

let questions = [];

let currentQuestion = 0;

let score = 0;

let selectedAnswer = null;

let timerInterval;

let timeLeft = 15;

let totalTime = 0;

const QUESTION_TIME = 15;



/* =========================
   LOAD QUIZ
========================= */

async function loadQuiz() {

    const category =
        localStorage.getItem(
            "quizCategory"
        ) || "9";


    const difficulty =
        localStorage.getItem(
            "quizDifficulty"
        ) || "easy";


    const apiURL =
        `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;


    try {

        const response =
            await fetch(apiURL);


        if (!response.ok) {

            throw new Error(
                "Unable to fetch quiz."
            );

        }


        const data =
            await response.json();


        if (data.response_code !== 0) {

            throw new Error(
                "No questions available."
            );

        }


        questions =
            data.results.map(function(item) {

                const allAnswers = [

                    item.correct_answer,

                    ...item.incorrect_answers

                ];


                shuffleArray(allAnswers);


                return {

                    question:
                        decodeHTML(item.question),

                    correctAnswer:
                        decodeHTML(
                            item.correct_answer
                        ),

                    answers:
                        allAnswers.map(
                            decodeHTML
                        )

                };

            });


        document.getElementById(
            "totalQuestions"
        ).textContent =
            questions.length;


        showQuestion();


    } catch (error) {

        console.error(error);


        document.getElementById(
            "question"
        ).textContent =
            "Unable to load quiz questions.";


        document.getElementById(
            "options"
        ).innerHTML = `

            <p>
                ${error.message}
            </p>

            <button
                class="primary-btn"
                onclick="location.reload()"
            >
                Try Again
            </button>

        `;

    }

}



/* =========================
   SHOW QUESTION
========================= */

function showQuestion() {

    clearInterval(timerInterval);


    selectedAnswer = null;


    timeLeft = QUESTION_TIME;


    const question =
        questions[currentQuestion];


    document.getElementById(
        "questionNumber"
    ).textContent =
        currentQuestion + 1;


    document.getElementById(
        "question"
    ).textContent =
        question.question;


    const optionsContainer =
        document.getElementById(
            "options"
        );


    optionsContainer.innerHTML = "";


    question.answers.forEach(
        function(answer) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.textContent =
                answer;


            button.onclick =
                function() {

                    selectAnswer(
                        button,
                        answer
                    );

                };


            optionsContainer.appendChild(
                button
            );

        }
    );


    document.getElementById(
        "nextButton"
    ).disabled = true;


    updateProgress();


    startTimer();

}



/* =========================
   SELECT ANSWER
========================= */

function selectAnswer(
    button,
    answer
) {

    if (selectedAnswer !== null) {
        return;
    }


    selectedAnswer = answer;


    clearInterval(timerInterval);


    const correctAnswer =
        questions[
            currentQuestion
        ].correctAnswer;


    const optionButtons =
        document.querySelectorAll(
            ".option"
        );


    optionButtons.forEach(
        function(option) {

            option.disabled = true;


            if (
                option.textContent ===
                correctAnswer
            ) {

                option.classList.add(
                    "correct"
                );

            }

        }
    );


    if (
        answer ===
        correctAnswer
    ) {

        score++;


        button.classList.add(
            "correct"
        );

    } else {

        button.classList.add(
            "incorrect"
        );

    }


    document.getElementById(
        "nextButton"
    ).disabled = false;

}



/* =========================
   TIMER
========================= */

function startTimer() {

    updateTimerDisplay();


    timerInterval =
        setInterval(
            function() {

                timeLeft--;

                totalTime++;


                updateTimerDisplay();


                if (timeLeft <= 0) {

                    clearInterval(
                        timerInterval
                    );


                    timeUp();

                }

            },
            1000
        );

}



/* =========================
   TIMER DISPLAY
========================= */

function updateTimerDisplay() {

    document.getElementById(
        "timer"
    ).textContent =
        timeLeft;

}



/* =========================
   TIME UP
========================= */

function timeUp() {

    selectedAnswer = "TIME_UP";


    const correctAnswer =
        questions[
            currentQuestion
        ].correctAnswer;


    const optionButtons =
        document.querySelectorAll(
            ".option"
        );


    optionButtons.forEach(
        function(option) {

            option.disabled = true;


            if (
                option.textContent ===
                correctAnswer
            ) {

                option.classList.add(
                    "correct"
                );

            }

        }
    );


    document.getElementById(
        "nextButton"
    ).disabled = false;

}



/* =========================
   NEXT QUESTION
========================= */

function nextQuestion() {

    clearInterval(timerInterval);


    currentQuestion++;


    if (
        currentQuestion >=
        questions.length
    ) {

        finishQuiz();

        return;

    }


    showQuestion();

}



/* =========================
   UPDATE PROGRESS
========================= */

function updateProgress() {

    const progress =
        (
            currentQuestion /
            questions.length
        ) * 100;


    document.getElementById(
        "progressBar"
    ).style.width =
        progress + "%";

}



/* =========================
   FINISH QUIZ
========================= */

function finishQuiz() {

    clearInterval(timerInterval);


    const playerName =
        localStorage.getItem(
            "quizPlayerName"
        ) || "Player";


    saveScore(
        playerName,
        score,
        questions.length,
        totalTime
    );


    localStorage.setItem(
        "quizScore",
        score
    );


    localStorage.setItem(
        "quizTotal",
        questions.length
    );


    localStorage.setItem(
        "quizTime",
        totalTime
    );


    showResult();

}



/* =========================
   RESULT
========================= */

function showResult() {

    const container =
        document.querySelector(
            ".quiz-container"
        );


    container.innerHTML = `

        <section class="result-card">

            <h1>Quiz Completed!</h1>

            <p>
                Well done,
                <strong>
                    ${escapeHTML(
                        localStorage.getItem(
                            "quizPlayerName"
                        ) || "Player"
                    )}
                </strong>
            </p>


            <div class="result-score">

                ${score}/${questions.length}

            </div>


            <p>
                Total Time:
                ${totalTime} seconds
            </p>


            <br>


            <a
                href="leaderboard.html"
                class="primary-btn"
            >
                View Leaderboard
            </a>


            <a
                href="index.html"
                class="secondary-btn"
            >
                Play Again
            </a>

        </section>

    `;

}



/* =========================
   SHUFFLE ARRAY
========================= */

function shuffleArray(array) {

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ];

    }

}



/* =========================
   DECODE API HTML
========================= */

function decodeHTML(text) {

    const textarea =
        document.createElement(
            "textarea"
        );


    textarea.innerHTML = text;


    return textarea.value;

}



/* =========================
   START
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        if (
            document.getElementById(
                "question"
            )
        ) {

            loadQuiz();

        }

    }
);