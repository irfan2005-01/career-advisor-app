import React, { useState } from 'react';

// Hardcoded list of skills for demonstration
const skillsList = [
  'React',
  'TypeScript',
  'JavaScript',
  'HTML',
  'CSS',
  'Tailwind CSS',
  'Node.js',
  'Python',
  'SQL',
  'Cloud Computing',
];

const SkillsAssessment: React.FC = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prevSkills) =>
      prevSkills.includes(skill)
        ? prevSkills.filter((s) => s !== skill)
        : [...prevSkills, skill]
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
      <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center text-teal-400">Skills Assessment</h1>
        <p className="text-center mb-6 text-gray-400">Select the skills you currently have.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillsList.map((skill) => (
            <div
              key={skill}
              onClick={() => toggleSkill(skill)}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedSkills.includes(skill)
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              <span className="font-semibold">{skill}</span>
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill)}
                onChange={() => {}} // onChange is required for controlled component
                className="form-checkbox h-5 w-5 text-teal-500 rounded-full cursor-pointer"
              />
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold mb-2 text-teal-400">Your Selected Skills:</h2>
          <p className="text-gray-400">{selectedSkills.length > 0 ? selectedSkills.join(', ') : 'No skills selected yet.'}</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsAssessment;

// This empty export statement makes the file a module to avoid TS1208 errors
export {};
