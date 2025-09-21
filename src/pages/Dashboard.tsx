import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { mockProfile } from '../assets/mockData';

const Dashboard = () => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  return (
    <div className="page-container fade-in">
      <h1>Dashboard</h1>
      <h2>Welcome, {profile?.name || mockProfile.name}!</h2>
      <p>Here is an overview of your profile and recent activity.</p>
    </div>
  );
};

export default Dashboard;