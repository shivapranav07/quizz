 // quiz.js

// Function to fetch questions from the backend
async function fetchQuestions() {
  try {
      const response = await fetch('http://localhost:3000/questions'); // Assuming your backend server is running on localhost port 3000
      const data = await response.json();

      return data.questions; // Assuming the response contains an array of questions
  } catch (error) {
      console.error('Error fetching questions:', error);
      return []; // Return an empty array in case of an error
  }
}

// Function to display question and options
function displayQuestion(question) {
  document.getElementById('question').textContent = question.question;
  const options = question.options.map((option, index) => `<input type="radio" name="option" value="${index}"><label>${option}</label><br>`);
  document.getElementById('options').innerHTML = options.join('');
}

// Function to fetch and display next question
async function getNextQuestion() {
  const questions = await fetchQuestions();
  if (questions.length > 0) {
      const currentIndex = parseInt(document.getElementById('question-index').value);
      const nextIndex = (currentIndex + 1) % questions.length; // Loop back to the beginning if reached the end
      document.getElementById('question-index').value = nextIndex;
      displayQuestion(questions[nextIndex]);
      document.getElementById('answer').textContent = '';
  } else {
      console.error('No questions found');
  }
}

// Function to handle form submission
document.getElementById('options-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
      alert('Please select an option');
      return;
  }
  const questionIndex = parseInt(document.getElementById('question-index').value);
  const response = await fetch('http://localhost:3000/check-answer', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          questionIndex,
          selectedOption: selectedOption.value
      })
  });
  const data = await response.json();
  if (data.isCorrect) {
      document.getElementById('answer').textContent = 'Correct! Good job.';
  } else {
      const correctAnswer = data.correctAnswer;
      document.getElementById('answer').textContent = `Incorrect. The correct answer is: ${correctAnswer}`;
  }
});

// Function to handle click on "Next" button
document.getElementById('next-btn').addEventListener('click', getNextQuestion);

// Initial fetch of questions and display of the first question
fetchQuestions().then(questions => {
  if (questions.length > 0) {
      document.getElementById('question-index').value = 0;
      displayQuestion(questions[0]);
  } else {
      console.error('No questions found');
  }
});
