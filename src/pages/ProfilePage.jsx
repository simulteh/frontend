import React from 'react';
import ProfileInfo from '../components/ProfileInfo';
import DownloadSection from '../components/DownloadSection';
import GradesTable from '../components/GradesTable';
import '../ProfilePage.css'; // Обновленный путь к CSS файлу

const ProfilePage = () => {
  return (
    <div className="profile">
      <div className="container">
        <h2>Личный кабинет</h2>
        <ProfileInfo />
        <DownloadSection />
        <GradesTable />
      </div>
    </div>
  );
};

export default ProfilePage;