import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Welcome from './components/Welcome'; // импорт вашего компонента Welcome
import CourseInfo from './components/CourseInfo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/course" element={<CourseInfo />} />
    </Routes>
  );
}

export default App;
