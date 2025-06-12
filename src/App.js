import React from 'react';
import CourseCard from './components/CourseCard';

function App() {
  return (
    <div style={{ padding: 40, backgroundColor: '#f0f0f5', minHeight: '100vh' }}>
      <CourseCard
        mainTitle="Курс Введение в React"
        courseTitle="Введение в React"
        previewTitle="Превью курса Введение в React"
        description="Изучите основы React, включая компоненты, хуки и маршрутизацию."
        author="Салимзода Мирзо"
        duration="4 недели"
        level="Начальный"
        image="https://avatars.mds.yandex.net/i?id=7050631ec0f1268f0a3a4dee20aabcc9479fb433-5451533-images-thumbs&n=13"
        courseUrl="https://example.com/courses/react-intro"
      />
    </div>
  );
}

export default App;
