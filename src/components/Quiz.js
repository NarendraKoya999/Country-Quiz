// src/components/Quiz.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Quiz.css'; // Import your custom CSS file

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userEngagement, setUserEngagement] = useState(0); // New state for user engagement

  useEffect(() => {
    // Load previous user engagement count from local storage
    const savedUserEngagement = localStorage.getItem('userEngagement');
    setUserEngagement(savedUserEngagement ? parseInt(savedUserEngagement, 10) : 0);

    // Fetch questions
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all');
      const countries = response.data;

      const filteredCountries = countries.filter(country => country.capital && country.flags);

      const quizQuestions = filteredCountries.slice(0, 10).map(country => {
        const isCapitalQuestion = Math.random() < 0.5;
        const question = isCapitalQuestion
          ? `What is the capital of ${country.name.common}?`
          : `Which country does this flag belong to?`;

        const correctAnswer = isCapitalQuestion ? country.capital[0] : country.name.common;

        const options = [correctAnswer, ...getRandomOptions(correctAnswer, filteredCountries)];

        return {
          question,
          options: shuffleArray(options),
          correctAnswer,
          isCapitalQuestion,
        };
      });

      setQuestions(quizQuestions);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAnswerSelection = (answer) => {
    if (quizCompleted) {
      // Do nothing if the quiz is already completed
      return;
    }

    setSelectedAnswer(answer);

    if (answer === questions[currentQuestion].correctAnswer) {
      setIsCorrect(true);
      setCorrectAnswersCount(correctAnswersCount + 1);
    } else {
      setIsCorrect(false);
    }

    // Increment user engagement counter
    const updatedUserEngagement = userEngagement + 1;
    setUserEngagement(updatedUserEngagement);

    // Save the updated count to local storage
    localStorage.setItem('userEngagement', updatedUserEngagement.toString());
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
      setIsCorrect(null);
    } else {
      // Quiz completed
      setQuizCompleted(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setIsCorrect(null);
    setCorrectAnswersCount(0);
    setQuizCompleted(false);
  };

  if (questions.length === 0) {
    return <div>Loading...</div>;
  }

  const currentQuestionData = questions[currentQuestion];

  if (quizCompleted) {
    const scorePercentage = (correctAnswersCount / questions.length) * 100;
    return (
      <div className="quiz-container">
        <div className="result-container">
          <h1 className="result-text">
            Your Score: {correctAnswersCount} out of {questions.length} ({scorePercentage.toFixed(2)}%)
          </h1>
          <button className="retry-button" onClick={handleRetry}>
            Restart Quiz
          </button>
        </div>
        {/* Display user engagement count here, outside of result containers */}
        <div className="user-engagement">
          User Engagement: {userEngagement}
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1 className="question">{currentQuestionData.question}</h1>
      <ul className="options-list">
        {currentQuestionData.options.map((option, index) => (
          <li key={index}>
            <button
              className={`option-button ${selectedAnswer === option ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
              onClick={() => handleAnswerSelection(option)}
              disabled={selectedAnswer !== ''}
            >
              {option}
            </button>
          </li>
        ))}
      </ul>
      {selectedAnswer !== '' && (
        <div className="feedback">
          {isCorrect ? (
            <p className="correct-feedback">Correct!</p>
          ) : (
            <p className="incorrect-feedback">
              Incorrect. The correct answer is {currentQuestionData.correctAnswer}.
            </p>
          )}
          {currentQuestion < questions.length - 1 ? (
            <button className="next-button" onClick={handleNextQuestion}>
              Next Question
            </button>
          ) : (
            <div className="result-container">
              <h1 className="result-text">
                Your Score: {correctAnswersCount} out of {questions.length}
              </h1>
              <button className="retry-button" onClick={handleRetry}>
                Restart Quiz
              </button>
            </div>
          )}
        </div>
      )}
      {/* Display user engagement count here, outside of result containers */}
      <div className="user-engagement">
        User Engagement: {userEngagement}
      </div>
    </div>
  );
};

// ... (unchanged functions and export)

const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

const getRandomOptions = (correctAnswer, countries) => {
  const options = [];
  while (options.length < 3) {
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const randomOption = randomCountry.capital[0] || randomCountry.name.common;

    if (randomOption !== correctAnswer && !options.includes(randomOption)) {
      options.push(randomOption);
    }
  }
  return options;
};

export default Quiz;
