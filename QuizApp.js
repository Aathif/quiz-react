import React from 'react';
import {useParams} from 'react-router-dom'
import { useState, useEffect } from 'react';
import Question from '../components/Question';
import questionBank from '../api/questionBank.json'

export default function Quiz() {

    const {id} = useParams()
    
    
    const questions = questionBank
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [showFinalScore, setShowFinalScore] = useState(false);

  useEffect(() => {
    let timer;
    if (!isTimeUp && !isAnswerSubmitted) {
      timer = setTimeout(() => {
        if (timeLeft === 0) {
          setIsTimeUp(true);
        } else {
          setTimeLeft((prev) => prev - 1);
        }
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isTimeUp, isAnswerSubmitted]);

  const handleAnswerClick = (answer) => {
    if (!isAnswerSubmitted && !isTimeUp) {
      setSelectedAnswer(answer);
    }
  };

  const handleOkClick = () => {
    if (selectedAnswer && !isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      if (selectedAnswer === displayedQuestion[`Option${displayedQuestion.Answer}`]) {
        setScore((prev) => prev + 1);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setIncorrectAnswers((prev) => prev - 1);
      }
    }
  };

  const handleNextClick = () => {
    if (currentQuestionIndex + 1 < questions[id-1].questionbank.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(10);
      setIsTimeUp(false);
    } else {
      setShowFinalScore(true);
    }
  };

  if (showFinalScore) {
    return (
      <div>

        <h4>Thanks For attempting the test</h4>
        <h5 data-testid={'score'}>Your Score is :- {score}</h5>
        <p data-testid={'correct-question'}>Total Correct :- {correctAnswers}</p>
        <p data-testid={'incorrect-question'}>Total InCorrect :- {incorrectAnswers}</p>
            
      </div>
    );
  }
 
  console.log('currentQuestionIndex',currentQuestionIndex)
  console.log('questions',questions)

  const currentQuestion = questions[id -1];
  console.log('currentQuestion',currentQuestion)
  const displayedQuestion = currentQuestion.questionbank[currentQuestionIndex];
  
  return (
    <div>
      <div>
        <p data-testid={`question`}>{displayedQuestion.Question}</p>
        <div>
            <li>
            <input type='radio' onClick={() => handleAnswerClick(displayedQuestion.Option1)} data-testid={"option-1"} name={displayedQuestion.Option1} value={displayedQuestion.Option1}>
            </input>
                <label htmlFor={displayedQuestion.Option1}>{displayedQuestion.Option1}</label>
            <input type='radio' onClick={() => handleAnswerClick(displayedQuestion.Option2)} data-testid={"option-2"} name={displayedQuestion.Option2} value={displayedQuestion.Option2}>
            </input>
                <label htmlFor={displayedQuestion.Option2}>{displayedQuestion.Option2}</label>
            <input type='radio' onClick={() => handleAnswerClick(displayedQuestion.Option3)} data-testid={"option-3"} name={displayedQuestion.Option3} value={displayedQuestion.Option3}>
            </input>
                <label htmlFor={displayedQuestion.Option3}>{displayedQuestion.Option3}</label>
            <input type='radio' onClick={() => handleAnswerClick(displayedQuestion.Option4)} data-testid={"option-4"} name={displayedQuestion.Option4} value={displayedQuestion.Option4}>
            </input>
                <label htmlFor={displayedQuestion.Option4}>{displayedQuestion.Option4}</label>
            </li>
        </div>

        <button data-testid={'ok'} onClick={handleOkClick} disabled={isAnswerSubmitted || !selectedAnswer}>
          OK
        </button>
        <button data-testid={'next'} onClick={handleNextClick} disabled={!isAnswerSubmitted && !isTimeUp}>
          Next
        </button>
        {isAnswerSubmitted && (
          <p data-testid={'validate-answer'} style={{color: selectedAnswer === displayedQuestion[`Option${displayedQuestion.Answer}`] ? 'green': 'red'}}>
            {selectedAnswer === displayedQuestion[`Option${displayedQuestion.Answer}`]
                ? 'Your Answer is Correct!'
                : `Your Answer is wrong. Correct answer is ${displayedQuestion[`Option${displayedQuestion.Answer}`]}`
            }
          </p>
        )}
        {isTimeUp && !isAnswerSubmitted && <p>Time is up!</p>}
        <p>Time left: {timeLeft} seconds</p>
      </div>
    </div>
  );
  }
