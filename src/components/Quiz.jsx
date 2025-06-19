import { useState, useEffect } from 'react';
import '../style/Quiz.css';

export const Quiz = () => {
  const questions = [
    {
      question: "Почему степень окисления +3 для железа устойчивее, чем степень окисления +2?",
      options: [
        "Из-за наполовину заполненного d-подуровня",
        "Из-за меньшего радиуса иона",
        "Из-за высокой электроотрицательности",
        "Это неверно, +2 устойчивее"
      ],
      correctAnswer: "Из-за наполовину заполненного d-подуровня"
    },
    {
      question: "Какой метод React используется для обработки событий?",
      options: [
        "addEventListener()",
        "onClick={}",
        "handleEvent()",
        "window.event"
      ],
      correctAnswer: "onClick={}"
    },
    {
      question: "Что такое 'замыкание' в JavaScript?",
      options: [
        "Способ закрыть браузер",
        "Функция + её лексическое окружение",
        "Метод для завершения программы",
        "Специальный оператор"
      ],
      correctAnswer: "Функция + её лексическое окружение"
    },
    {
      question: "Какой тег HTML используется для создания списка?",
      options: [
        "<div>",
        "<list>",
        "<ul> или <ol>",
        "<table>"
      ],
      correctAnswer: "<ul> или <ol>"
    },
    {
      question: "Какой оператор используется для строгого равенства в JavaScript?",
      options: [
        "==",
        "===",
        "=",
        "equals()"
      ],
      correctAnswer: "==="
    },
    {
      question: "Что делает метод Array.map()?",
      options: [
        "Изменяет исходный массив",
        "Создаёт новый массив, преобразуя элементы",
        "Фильтрует элементы",
        "Сортирует массив"
      ],
      correctAnswer: "Создаёт новый массив, преобразуя элементы"
    },
    {
      question: "Какой элемент периодической таблицы имеет символ 'Au'?",
      options: [
        "Аргон",
        "Алюминий",
        "Золото",
        "Серебро"
      ],
      correctAnswer: "Золото"
    },
    {
      question: "Чем вы хотите заниматься: frontend, backend или fullstack?",
      options: [
        "frontend",
        "backend",
        "fullstack",
      ],
      correctAnswer: "frontend"
    }
  ];

  // Остальной код остаётся без изменений
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (!timerActive) return;

    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else {
        setTimerActive(false);
        setResult(`⏱ Время вышло! Правильный ответ: ${questions[currentQuestionIndex].correctAnswer}`);
        setTimeout(goToNextQuestion, 1500);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, timerActive]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setResult(null);
      setTimeLeft(10);
      setTimerActive(true);
    }
  };

  const handleAnswer = (selectedOption) => {
    setTimerActive(false);
    
    if (selectedOption === questions[currentQuestionIndex].correctAnswer) {
      setResult("✅ Правильно!");
      setScore(score + 1);
    } else {
      setResult(`❌ Неправильно! Правильный ответ: ${questions[currentQuestionIndex].correctAnswer}`);
    }

    setTimeout(goToNextQuestion, 1500);
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="quiz">
      <div className="progress">Вопрос {currentQuestionIndex + 1} из {questions.length}</div>
      <div className="timer-container">
        <div className="timer-bar" style={{ width: `${(timeLeft / 10) * 100}%` }}></div>
        <div className="timer-text">{timeLeft} сек</div>
      </div>
      <h1>{currentQuestion.question}</h1>
      <div className="options">
        {currentQuestion.options.map((option, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(option)}
            disabled={result !== null}
          >
            {option}
          </button>
        ))}
      </div>
      {result && <div className="result">{result}</div>}
      
      {currentQuestionIndex === questions.length - 1 && result && (
        <div className="score">Ваш результат: {score} из {questions.length}</div>
      )}
    </div>
  );
}