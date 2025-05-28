document.addEventListener('DOMContentLoaded', function() {
    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let selectedOption = null;

    // Fetch questions from JSON file
    fetch('../../data/questionnaire.json')
        .then(response => response.json())
        .then(data => {
            questions = data.questions;
            displayQuestion();
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            document.getElementById('question-display').innerHTML =
                '<p class="error">Erreur lors du chargement des questions. Veuillez réessayer plus tard.</p>';
        });

    function displayQuestion() {
        const questionData = questions[currentQuestionIndex];
        const questionDisplay = document.getElementById('question-display');
        const optionsContainer = document.getElementById('options-container');

        // Reset display
        document.getElementById('feedback-container').innerHTML = '';
        document.getElementById('submit-btn').style.display = 'block';
        document.getElementById('next-btn').style.display = 'none';
        selectedOption = null;

        // Display question
        questionDisplay.innerHTML = `
                        <h3>Question ${currentQuestionIndex + 1}/${questions.length}</h3>
                        <p class="question-text">${questionData.question}</p>
                    `;

        // Display options
        optionsContainer.innerHTML = '';
        questionData.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.innerHTML = `
                            <input type="radio" id="option${index}" name="quiz-option" value="${option}">
                            <label for="option${index}">${option}</label>
                        `;
            optionsContainer.appendChild(optionElement);

            // Add event listener to track selected option
            const radioBtn = optionElement.querySelector(`#option${index}`);
            radioBtn.addEventListener('change', function() {
                selectedOption = option;
            });
        });

        // Update score display
        updateScoreDisplay();
    }

    function checkAnswer() {
        const questionData = questions[currentQuestionIndex];
        const feedbackContainer = document.getElementById('feedback-container');

        if (!selectedOption) {
            feedbackContainer.innerHTML = '<p class="warning">Veuillez sélectionner une réponse.</p>';
            return;
        }

        const isCorrect = selectedOption === questionData.correctAnswer;

        if (isCorrect) {
            score++;
            feedbackContainer.innerHTML = `
                            <p class="correct">Correct! ${questionData.explanation}</p>
                        `;
        } else {
            feedbackContainer.innerHTML = `
                            <p class="incorrect">Incorrect. La bonne réponse est: ${questionData.correctAnswer}</p>
                            <p>${questionData.explanation}</p>
                        `;
        }

        // Update buttons
        document.getElementById('submit-btn').style.display = 'none';

        if (currentQuestionIndex < questions.length - 1) {
            document.getElementById('next-btn').style.display = 'block';
        } else {
            feedbackContainer.innerHTML += `
                            <p class="quiz-complete">Quiz terminé! Votre score final: ${score}/${questions.length}</p>
                            <button id="restart-btn" class="quiz-btn">Recommencer</button>
                        `;

            document.getElementById('restart-btn').addEventListener('click', function() {
                currentQuestionIndex = 0;
                score = 0;
                displayQuestion();
            });
        }

        updateScoreDisplay();
    }

    function updateScoreDisplay() {
        document.getElementById('score-display').textContent = `Score: ${score}/${questions.length}`;
    }

    // Event listeners
    document.getElementById('submit-btn').addEventListener('click', checkAnswer);

    document.getElementById('next-btn').addEventListener('click', function() {
        currentQuestionIndex++;
        displayQuestion();
    });
});