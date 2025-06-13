// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome'; // импорт нового приветственного экрана
import CourseCard from './components/CourseCard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/course" element={<CourseCard />} />
    </Routes>
  );
}

export default App;
