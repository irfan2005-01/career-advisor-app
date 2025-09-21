import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

// You will also need to install the Tailwind CSS for this to work
// npm install -D tailwindcss postcss autoprefixer
// npx tailwindcss init -p

// --- Global Variables Provided by the Canvas Environment ---
// The app ID, Firebase config, and auth token are injected by the platform.
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

interface Profile {
  name: string;
  experience: string;
  skills: string;
  interests: string;
  aspirations: string;
}

interface Recommendations {
  careerRecommendation: string;
  skillsGapAnalysis: string[];
  learningPlan: string;
}

const App: React.FC = () => {
  const [db, setDb] = useState<any>(null);
  const [auth, setAuth] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
        if (user) {
          setUserId(user.uid);
          setIsAuthReady(true);
        } else {
          try {
            if (initialAuthToken) {
              await signInWithCustomToken(authInstance, initialAuthToken);
            } else {
              await signInAnonymously(authInstance);
            }
          } catch (error) {
            console.error("Firebase auth error:", error);
          }
        }
      });

      return () => unsubscribe();
    } catch (e) {
      console.error("Firebase initialization failed:", e);
    }
  }, []);

  useEffect(() => {
    if (db && userId) {
      const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'profile', 'data');
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.data) {
            setProfile(data.data as Profile);
          }
          if (data && data.recommendations) {
            setRecommendations(data.recommendations as Recommendations);
          }
        } else {
          console.log("No profile data found for this user.");
          setProfile(null);
          setRecommendations(null);
        }
      }, (error) => {
        console.error("Error fetching user profile:", error);
      });

      return () => unsubscribe();
    }
  }, [db, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !userId) {
      console.error("Firebase not initialized or user not authenticated.");
      return;
    }

    const form = e.target as HTMLFormElement;
    const newProfile: Profile = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      experience: (form.elements.namedItem('experience') as HTMLInputElement).value,
      skills: (form.elements.namedItem('skills') as HTMLInputElement).value,
      interests: (form.elements.namedItem('interests') as HTMLInputElement).value,
      aspirations: (form.elements.namedItem('aspirations') as HTMLInputElement).value,
    };

    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'artifacts', appId, 'users', userId, 'profile', 'data');
      await setDoc(userDocRef, {
        data: newProfile,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      await fetchRecommendations(newProfile, userDocRef);
    } catch (error) {
      console.error("Error saving profile or fetching recommendations:", error);
      setIsLoading(false);
    }
  };

  const fetchRecommendations = async (profile: Profile, userDocRef: any) => {
    const prompt = `Act as a world-class career and skills advisor. Based on the following user profile, provide a personalized career recommendation, a skills gap analysis, and a tailored learning plan.

    User Profile:
    - Name: ${profile.name}
    - Work Experience: ${profile.experience}
    - Skills: ${profile.skills}
    - Interests: ${profile.interests}
    - Career Aspirations: ${profile.aspirations}

    Please provide the response in a structured JSON format with three fields:
    1. "careerRecommendation": A single paragraph with a career path recommendation.
    2. "skillsGapAnalysis": A list of specific skills the user needs to acquire to reach their aspirations.
    3. "learningPlan": A step-by-step plan for developing the necessary skills, including resources.
    `;

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              "careerRecommendation": { "type": "STRING" },
              "skillsGapAnalysis": {
                "type": "ARRAY",
                "items": { "type": "STRING" },
              },
              "learningPlan": { "type": "STRING" },
            },
          },
        },
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0) {
        const text = result.candidates[0].content?.parts?.[0]?.text;
        if (text) {
          const parsedJson = JSON.parse(text);
          await setDoc(userDocRef, { recommendations: parsedJson }, { merge: true });
          setRecommendations(parsedJson);
        } else {
          console.error("API response content is empty.");
        }
      } else {
        console.error("No candidates found in API response.");
      }
    } catch (error) {
      console.error("API call failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-950 text-white flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800 p-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-purple-400">Career Advisor</h1>
        <nav className="flex space-x-4">
          <button className="text-white font-semibold hover:text-purple-400 transition-colors focus:outline-none">
            Home
          </button>
          <button className="bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors focus:outline-none">
            Login
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex justify-center items-center p-4 md:p-8">
        <div className="container w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Panel (Form & Recommendations) */}
          <div className="bg-gray-900 shadow-xl rounded-2xl p-6 md:p-10">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-400 mb-2">
              Career & Skills Advisor
            </h1>
            <p className="text-center text-gray-400 mb-6">
              Get personalized career advice powered by Gemini.
            </p>
            <p className="text-center text-gray-500 text-sm mb-4 break-words">
              <span className="font-bold">Your User ID:</span> {userId || 'Loading...'}
            </p>
            {isAuthReady && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  defaultValue={profile?.name || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                />
                <textarea
                  name="experience"
                  rows={3}
                  placeholder="Work Experience (e.g., '5 years as a software developer...')"
                  defaultValue={profile?.experience || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                ></textarea>
                <textarea
                  name="skills"
                  rows={3}
                  placeholder="Your Skills (e.g., 'JavaScript, Python, Project Management...')"
                  defaultValue={profile?.skills || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                ></textarea>
                <textarea
                  name="interests"
                  rows={3}
                  placeholder="Your Interests (e.g., 'Data science, AI, UX design...')"
                  defaultValue={profile?.interests || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                ></textarea>
                <textarea
                  name="aspirations"
                  rows={3}
                  placeholder="Your Career Aspirations (e.g., 'To become a team lead...')"
                  defaultValue={profile?.aspirations || ''}
                  className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 font-bold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    isLoading
                      ? 'bg-purple-800 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></div>
                      <span className="ml-2">Generating...</span>
                    </div>
                  ) : (
                    'Get My Personalized Advice'
                  )}
                </button>
              </form>
            )}

            {recommendations && (
              <div className="bg-gray-800 rounded-lg p-6 mt-8">
                <h2 className="text-2xl md:text-3xl font-bold text-purple-400 mb-4">
                  Your Personalized Plan
                </h2>

                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-purple-300">
                    Career Recommendation
                  </h3>
                  <p className="text-gray-300">{recommendations.careerRecommendation}</p>
                </div>

                <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-purple-300">
                    Skills Gap Analysis
                  </h3>
                  <ul className="list-disc list-inside text-gray-300 space-y-2">
                    {recommendations.skillsGapAnalysis.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-xl font-semibold mb-2 text-purple-300">
                    Tailored Learning Plan
                  </h3>
                  <div className="prose prose-invert max-w-none text-gray-300">
                    <p>{recommendations.learningPlan}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel (Login/Splash) */}
          <div className="flex flex-col space-y-8">
            <div className="bg-gradient-to-br from-purple-800 to-indigo-800 shadow-xl rounded-2xl p-6 text-center text-white">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Your Tech Career Journey Awaits
              </h2>
              <p className="text-sm md:text-base text-gray-300 mb-6">
                Discover your path in the tech industry with personalized career recommendations and skills analysis.
              </p>
              <button className="bg-white text-purple-800 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-gray-200 transition-colors focus:outline-none">
                Launch Career Advisor
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
