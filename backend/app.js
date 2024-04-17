const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const questionsData = JSON.parse(fs.readFileSync(__dirname + '/questions.json', 'utf8'));
const questions = questionsData.questions;

let currentQuestionIndex = 0;

app.get('/question', (req, res) => {
    if (currentQuestionIndex >= questions.length) {
        // Reset currentQuestionIndex to 0 if it reaches the end of the question list
        currentQuestionIndex = 0;
    }

    const question = questions[currentQuestionIndex];
    res.json({ question, questionIndex: currentQuestionIndex });

    // Increment currentQuestionIndex for the next request
    currentQuestionIndex++;
});

app.post('/check-answer', (req, res) => {
  const { questionIndex, selectedOption } = req.body;
  const question = questions[questionIndex];
  if (!question || selectedOption === undefined || isNaN(parseInt(selectedOption)) || parseInt(selectedOption) < 0 || parseInt(selectedOption) >= question.options.length) {
      res.status(400).json({ error: 'Invalid request. Please provide valid question index and selected option.' });
      return;
  }

  const isCorrect = question.answer === parseInt(selectedOption);
  const correctAnswer = question.options[question.answer]; // Retrieve the correct answer

  let feedback;
  if (isCorrect) {
      feedback = 'Correct! Good job.';
  } else {
      feedback = `Incorrect. The correct answer is: ${correctAnswer}`;
  }

  // Include the correct answer in the response
  res.json({ isCorrect, correctAnswer, feedback });
});


app.post('/submit-answers', (req, res) => {
    const userAnswers = req.body;
    let score = 0;

    for (let i = 0; i < userAnswers.length; i++) {
        const question = questions[userAnswers[i].questionIndex];
        if (question && userAnswers[i].selectedOption >= 0 && userAnswers[i].selectedOption < question.options.length) {
            if (question.answer === userAnswers[i].selectedOption) {
                score += 10;
            }
        }
    }

    res.json({ score });
});

app.get('/questions', (req, res) => {
    res.json(questionsData);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found. Please check your request.' });
}); 

// Error handling middleware for unexpected errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error. Please try again later.' });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});