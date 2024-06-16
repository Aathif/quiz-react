import React from 'react';
import { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom'

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
          if (!isAnswerSubmitted){
            setScore((prev) => prev - 1);
            setIncorrectAnswers((prev) => prev - 1);
            handleNextClick()
          }
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
      if (selectedAnswer == displayedQuestion[`Option${displayedQuestion.Answer}`]) {
        setScore((prev) => prev + 1);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setScore((prev) => prev - 1);
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
        Your Score is :- 
        <h5 data-testid={'score'}>{score}</h5>
        <p data-testid={'correct-question'}>Total Correct :- {correctAnswers}</p>
        <p data-testid={'incorrect-question'}>Total InCorrect :- {Math.abs(incorrectAnswers)}</p>
            
      </div>
    );
  }
 

  const currentQuestion = questions[id -1];
  const displayedQuestion = currentQuestion.questionbank[currentQuestionIndex];
  
  return (
    <div>
      <div>
      <h5 data-testid={'title'}>{id}</h5>
        <p data-testid={`question`}>{displayedQuestion.Question}</p>
        <div>
            <input 
                type='radio' 
                onClick={() => handleAnswerClick(displayedQuestion.Option1)} 
                data-testid={"option-1"} 
                name={'answer'}
                checked={selectedAnswer === displayedQuestion.Option1}
                value={displayedQuestion.Option1}
            >
            </input>
            <label htmlFor={displayedQuestion.Option1}>{displayedQuestion.Option1}</label>

            <input 
                type='radio'
                checked={selectedAnswer === displayedQuestion.Option2}
                onClick={() => handleAnswerClick(displayedQuestion.Option2)} 
                data-testid={"option-2"} 
                name={'answer'} 
                value={displayedQuestion.Option2}>
            </input>
            <label htmlFor={displayedQuestion.Option2}>{displayedQuestion.Option2}</label>
            
            <input 
                type='radio'
                checked={selectedAnswer === displayedQuestion.Option3}
                onClick={() => handleAnswerClick(displayedQuestion.Option3)} 
                data-testid={"option-3"} 
                name={'answer'} 
                value={displayedQuestion.Option3}>
            </input>
            <label htmlFor={displayedQuestion.Option3}>{displayedQuestion.Option3}</label>
            
            <input 
                type='radio'
                checked={selectedAnswer === displayedQuestion.Option4}
                onClick={() => handleAnswerClick(displayedQuestion.Option4)} 
                data-testid={"option-4"} 
                name={'answer'} 
                value={displayedQuestion.Option4}>
            </input>
            <label htmlFor={displayedQuestion.Option4}>{displayedQuestion.Option4}</label>
        </div>

        <button data-testid={'ok'} onClick={handleOkClick} disabled={isAnswerSubmitted || !selectedAnswer}>
          OK
        </button>
        {
          !isAnswerSubmitted? 
        <button data-testid={'next'} onClick={handleNextClick} disabled={true}>
          Next
        </button> :
        <button data-testid={'next'} onClick={handleNextClick}>
          Next
        </button>

        }
        {isAnswerSubmitted && (
          <p data-testid={'validate-answer'} style={{color: selectedAnswer === displayedQuestion[`Option${displayedQuestion.Answer}`] ? 'green': 'red'}}>
            {selectedAnswer == displayedQuestion[`Option${displayedQuestion.Answer}`]
                ? 'Your Answer is correct'
                : `Your Answer is wrong, Correct answer is ${displayedQuestion.Answer}`
            }
          </p>
        )}
        {isTimeUp && !isAnswerSubmitted && <p>Time is up!</p>}
        <p>Time left: {timeLeft} seconds</p>
      </div>
    </div>
  );
  }
  
