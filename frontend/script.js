document.addEventListener('DOMContentLoaded', () => {
  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const feedbackElement = document.getElementById('feedback');
  const scoreElement = document.getElementById('score');
  const submitBtn = document.getElementById('submit-btn');
  const nextBtn = document.getElementById('next-btn');

  let currentQuestionIndex = -1;
  let score = 0;

  function fetchNextQuestion() {
      currentQuestionIndex++; // Increment current question index before fetching next question
      fetch('http://localhost:3000/question')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => {
              const { question } = data;
              displayQuestion(question);
          })
          .catch(error => console.error('Error fetching question:', error));
  }

  function displayQuestion(question) {
      questionElement.textContent = question.question;
      optionsElement.innerHTML = '';

      question.options.forEach((option, index) => {
          const button = document.createElement('button');
          button.textContent = option;
          button.addEventListener('click', () => checkAnswer(index));
          optionsElement.appendChild(button);
      });
  }

  function checkAnswer(selectedOption) {
      const data = { questionIndex: currentQuestionIndex, selectedOption };
      fetch('http://localhost:3000/check-answer', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
          const { isCorrect, feedback } = data;
          feedbackElement.textContent = feedback;
          if (isCorrect) {
              score += 10;
          }
          updateScore();
      })
      .catch(error => console.error('Error checking answer:', error));
  }

  function updateScore() {
      scoreElement.textContent = `Score: ${score}`;
  }

  function handleSubmit() {
      // You can add more logic here if needed
      feedbackElement.textContent = '';
  }

  function handleNext() {
      fetchNextQuestion();
      feedbackElement.textContent = '';
  }

  submitBtn.addEventListener('click', handleSubmit);
  nextBtn.addEventListener('click', handleNext);

  // Initial load
  fetchNextQuestion();
});
