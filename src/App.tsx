import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getFunctions } from 'firebase/functions';
import { setLogLevel } from 'firebase/firestore';

// --- Global Variables Provided by the Canvas Environment ---
// The app ID, Firebase config, and auth token are injected by the platform.
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;

// --- Type Definitions ---
interface Profile {
  education?: string;
  experience?: string;
  skills?: string[];
  interests?: string[];
  aspirations?: string;
}

interface Recommendation {
  career: string;
  description: string;
  skillsToDevelop: string[];
}

const SkillsAssessment = ({ profile, setProfile }: { profile: Profile, setProfile: React.Dispatch<React.SetStateAction<Profile>> }) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile.skills || []);

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

  const toggleSkill = (skill: string) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setSelectedSkills(updatedSkills);
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
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


const App = () => {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [profile, setProfile] = useState<Profile>({});
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // --- Firebase Init and Auth Listener ---
  useEffect(() => {
    setLogLevel('debug'); // Enable debug logging for Firestore

    const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);

    const authenticateUser = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined') {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error('Firebase authentication failed:', error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthReady(true);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'data');
        onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setProfile(docSnap.data() as Profile);
          }
        });
      } else {
        setIsAuthReady(true);
      }
    });

    authenticateUser();
    return () => unsubscribe();
  }, []);

  // --- Gemini Integration ---
  const fetchRecommendations = async () => {
    if (!profile.interests || !profile.skills || profile.interests.length === 0 || profile.skills.length === 0) {
      setMessage("Please fill out your profile with interests and skills to get recommendations.");
      return;
    }

    setLoading(true);
    setMessage('');

    const prompt = `Based on a user with the following profile:
    Interests: ${profile.interests.join(', ')}
    Skills: ${profile.skills.join(', ')}
    Educational Background: ${profile.education || 'N/A'}
    Work Experience: ${profile.experience || 'N/A'}
    Career Aspirations: ${profile.aspirations || 'N/A'}

    Provide 3 personalized career recommendations and 3 skills development pathways for each recommendation. Format the response as a JSON array of objects, with each object having 'career', 'description', and 'skillsToDevelop' properties.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              "career": { "type": "STRING" },
              "description": { "type": "STRING" },
              "skillsToDevelop": {
                "type": "ARRAY",
                "items": { "type": "STRING" }
              }
            },
            "propertyOrdering": ["career", "description", "skillsToDevelop"]
          }
        }
      }
    };

    const apiKey = "";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      const rawText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        setRecommendations(JSON.parse(rawText));
      } else {
        setMessage('No recommendations found. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setMessage('Failed to get recommendations. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Profile Management ---
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'skills' || name === 'interests') {
      const arrayValue = value.split(',').map(s => s.trim()).filter(s => s !== '');
      setProfile(prev => ({ ...prev, [name]: arrayValue }));
    } else {
      setProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const saveProfile = async () => {
    if (!userId) {
      setMessage("Please wait, authentication is not ready yet.");
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const db = getFirestore(); // Get a fresh instance to avoid closure issues
      const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'profile', 'data');
      await setDoc(userDocRef, profile, { merge: true });
      setMessage("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      setMessage("Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components ---
  const Dashboard = () => (
    <div className="p-8 space-y-8 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Welcome!</h1>
      <p className="text-center text-lg">
        This app will help you find the perfect career and the skills you need to succeed.
        Start by updating your profile.
      </p>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => setActivePage('profile')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Update Profile
        </button>
        <button
          onClick={() => {
            fetchRecommendations();
            setActivePage('recommendations');
          }}
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out"
        >
          Get Recommendations
        </button>
      </div>

      {message && <p className="text-center mt-4 text-sm text-red-500 dark:text-red-400">{message}</p>}
    </div>
  );

  const Profile = () => (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Your Profile</h1>
      <div className="max-w-xl mx-auto space-y-4">
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Educational Background:</label>
          <input
            type="text"
            name="education"
            value={profile.education || ''}
            onChange={handleProfileChange}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Work Experience:</label>
          <textarea
            name="experience"
            value={profile.experience || ''}
            onChange={handleProfileChange}
            rows={3}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Skills (comma-separated):</label>
          <input
            type="text"
            name="skills"
            value={(profile.skills || []).join(', ')}
            onChange={handleProfileChange}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Interests (comma-separated):</label>
          <input
            type="text"
            name="interests"
            value={(profile.interests || []).join(', ')}
            onChange={handleProfileChange}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col">
          <label className="mb-2 font-medium">Career Aspirations:</label>
          <input
            type="text"
            name="aspirations"
            value={profile.aspirations || ''}
            onChange={handleProfileChange}
            className="p-3 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={saveProfile}
          disabled={loading}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
        {message && <p className="text-center mt-4 text-sm text-green-500 dark:text-green-400">{message}</p>}
      </div>
    </div>
  );

  const Recommendations = () => (
    <div className="p-8 space-y-6 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center text-blue-600 dark:text-blue-400">Career Recommendations</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-4 text-lg">Generating recommendations...</p>
        </div>
      ) : message ? (
        <p className="text-center text-lg text-red-500 dark:text-red-400">{message}</p>
      ) : recommendations.length === 0 ? (
        <p className="text-center text-lg">
          No recommendations found. Please ensure your profile is complete and try generating them again.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-600 transition duration-300 ease-in-out transform hover:scale-105">
              <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">{rec.career}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{rec.description}</p>
              <h3 className="text-xl font-semibold mb-2">Skills to Develop:</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                {rec.skillsToDevelop.map((skill, skillIndex) => (
                  <li key={skillIndex}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => setActivePage('dashboard')}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (activePage) {
      case 'profile':
        return <Profile />;
      case 'skills-assessment':
        return <SkillsAssessment profile={profile} setProfile={setProfile} />;
      case 'recommendations':
        return <Recommendations />;
      case 'dashboard':
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="font-sans antialiased bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-blue-600 text-white shadow-lg dark:bg-blue-800">
        <nav className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="text-xl font-bold">Career Advisor</span>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <button
              onClick={() => setActivePage('dashboard')}
              className={`py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out ${activePage === 'dashboard' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActivePage('profile')}
              className={`py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out ${activePage === 'profile' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActivePage('skills-assessment')}
              className={`py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out ${activePage === 'skills-assessment' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Skills
            </button>
            <button
              onClick={() => {
                fetchRecommendations();
                setActivePage('recommendations');
              }}
              className={`py-2 px-4 rounded-lg font-medium transition duration-300 ease-in-out ${activePage === 'recommendations' ? 'bg-white text-blue-600' : 'hover:bg-blue-500'}`}
            >
              Recommendations
            </button>
          </div>
        </nav>
      </header>
      <main className="container mx-auto px-4 py-8">
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
