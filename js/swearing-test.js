const questions = [
    {
        question: "Если человека назвали мордофиля, то это…",
        answers: [
            { text: "Значит, что он тщеславный.", correct: true, explanation: "Ну зачем же вы так... В Этимологическом словаре русского языка Макса Фасмера поясняется, что мордофилей называют чванливого человека." },
            { text: "Значит, что у него лицо как у хряка.", correct: false },
            { text: "Значит, что чумазый.", correct: false }
        ]
    },
    {
        question: "«Да этот Ярополк — фуфлыга!» Что не так с Ярополком?",
        answers: [
            { text: "Он маленький и невзрачный.", correct: true, explanation: "Точно! Словарь Даля говорит, что фуфлыгой называют невзрачного малорослого человека." },
            { text: "Он тот еще алкоголик.", correct: false },
            { text: "Он не держит свое слово.", correct: false }
        ]
    },
    {
        question: "Если человека прозвали пятигузом, значит, он…",
        answers: [
            { text: "Не держит слово.", correct: true, explanation: "Может сесть сразу на пять стульев. Согласно Этимологическому словарю русского языка Макса Фасмера, пятигуз — это ненадежный, непостоянный человек." },
            { text: "Изменяет жене.", correct: false },
            { text: "Без гроша в кармане.", correct: false }
        ]
    },
    {
        question: "Кто такой шлындра?",
        answers: [
            { text: "Обманщик.", correct: false },
            { text: "Нытик.", correct: false },
            { text: "Бродяга.", correct: true, explanation: "В Словаре русского арго «шлындрать» означает бездельничать, шляться." }
        ]
    }
];

let currentQuestionIndex = 0;
let correctAnswers = 0;
let hasAnswered = false;
let quizFinished = false; 

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        document.getElementById("question-container").innerHTML = '';  
        document.getElementById("end-message").classList.remove("hidden");  
        document.getElementById("stat-container").innerHTML = `Вы ответили правильно на ${correctAnswers} из ${questions.length} вопросов.`;
        document.getElementById("stat-container").classList.remove("hidden");
        
        showAllQuestionsForReview();
        quizFinished = true;  
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    const shuffledAnswers = shuffleArray(currentQuestion.answers);

    const questionBlock = document.createElement("div");
    questionBlock.classList.add("question-block");
    questionBlock.innerHTML = `<h2>${currentQuestionIndex + 1}. ${currentQuestion.question}</h2>`;

    //добавляем маркер для правильного/неправильного ответа
    const answerMarker = document.createElement("div");
    answerMarker.classList.add("answer-marker");
    questionBlock.appendChild(answerMarker);

    //добавляем вопрос в контейнер вопросов
    document.getElementById("question-container").appendChild(questionBlock);

    const answerContainer = document.getElementById("answer-container");
    answerContainer.innerHTML = ''; // Очищаем предыдущие ответы

    shuffledAnswers.forEach(answer => {
        const answerBlock = document.createElement("div");
        answerBlock.classList.add("answer");
        answerBlock.innerText = answer.text;
        
        answerBlock.addEventListener("click", () => handleAnswerClick(answer, answerBlock, questionBlock, answerMarker, shuffledAnswers));
        
        answerContainer.appendChild(answerBlock);
    });
}

function handleAnswerClick(answer, answerBlock, questionBlock, answerMarker, shuffledAnswers) {
    if (hasAnswered) return; //предотвращаем повторный выбор ответа
    hasAnswered = true;

    const answers = document.querySelectorAll(".answer");
    questionBlock.classList.add("shake"); 

    if (answer.correct) {
        correctAnswers++;
        questionBlock.classList.add("correct");
        answerMarker.innerHTML = `<div class="correct-answer-mark">✔</div>`;
        answerBlock.innerHTML += `<p>${answer.explanation}</p>`;

        setTimeout(() => {
            answers.forEach(ans => {
                if (!ans.innerHTML.includes(answer.text)) {
                    ans.classList.add("slide-down");
                }
            });

            setTimeout(() => {
                answerBlock.classList.add("slide-down"); //сдвигаем правильный ответ вниз
                setTimeout(() => {
                    currentQuestionIndex++;
                    hasAnswered = false;
                    loadQuestion();
                }, 500); 
            }, 2500);
        }, 500); 
    } else {
        questionBlock.classList.add("incorrect");
        answerMarker.innerHTML = `<div class="incorrect-answer-mark">✘</div>`;

        setTimeout(() => {
            answers.forEach(ans => ans.classList.add("slide-down"));  
            setTimeout(() => {
                currentQuestionIndex++;
                hasAnswered = false;
                loadQuestion();
            }, 500);
        }, 1500);
    }
}

//функция вывода вопросов для просмотра
function showAllQuestionsForReview() {
    const questionContainer = document.getElementById("quiz-container"); 

    questionContainer.innerHTML = '';

    // блок статистики
    const statContainer = document.createElement("div");
    statContainer.id = "stat-container";
    statContainer.innerHTML = `Вы ответили правильно на ${correctAnswers} из ${questions.length} вопросов.`;
    questionContainer.appendChild(statContainer); 

    questions.forEach((question, index) => {
        const questionReviewBlock = document.createElement("div");
        questionReviewBlock.classList.add("question-review");
        questionReviewBlock.innerHTML = `<h2>${index + 1}. ${question.question}</h2>`;
        //возможность кликнуть на вопрос и увидеть правильный ответ
        questionReviewBlock.addEventListener("click", () => {
            //показать объяснение текущего вопроса
            const explanation = document.createElement("div");
            explanation.classList.add("explanation");
            const correctAnswer = question.answers.find(answer => answer.correct);
            explanation.innerHTML = `<p><strong>Правильный ответ:</strong> ${correctAnswer.text}<br><em>${correctAnswer.explanation}</em></p>`;

            // Если объяснение уже открыто, убираем его
            const existingExplanation = questionReviewBlock.querySelector(".explanation");
            if (existingExplanation) {
                questionReviewBlock.removeChild(existingExplanation);
            } else {
                // убираем объяснения из всех других вопросов
                const otherExplanations = questionContainer.querySelectorAll(".explanation");
                otherExplanations.forEach(explanation => {
                    explanation.remove();
                });

                questionReviewBlock.appendChild(explanation); //добавляем объяснение к текущему вопросу
            }
        });

        questionContainer.appendChild(questionReviewBlock);
    });
}

shuffleArray(questions);

loadQuestion();
