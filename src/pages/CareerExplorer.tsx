import React from 'react';
import { mockCareers } from '../assets/mockData';

const CareerExplorer = () => {
  return (
    <div className="page-container fade-in">
      <h1>Career Explorer</h1>
      <h2>Recommended Careers:</h2>
      {mockCareers.map((career) => (
        <div key={career.id} className="card">
          <h3>{career.title}</h3>
          <p>{career.description}</p>
          <p>Required Skills: {career.requiredSkills.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default CareerExplorer;