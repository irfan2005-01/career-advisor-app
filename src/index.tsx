import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- MODERN AESTHETIC STYLES FOR THE WEB APP ---
const style = document.createElement('style');
style.innerHTML = `
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  --tech-blue: #0A1128;
  --neon-cyan: #00F5FF;
  --neon-purple: #BF00FF;
  --dark-surface: #1A1A2E;
  --light-surface: #2D2D44;
  --text-primary: #FFFFFF;
  --text-secondary: #B2B2B2;
  --success: #00CC99;
  --warning: #FF9900;
  --error: #FF3366;
  --shadow-glow: 0 0 15px rgba(191, 0, 255, 0.3);
  --shadow-deep: 0 10px 30px rgba(0, 0, 0, 0.3);
}

* {
  box-sizing: border-box;
}

body {
  font-family: 'Poppins', 'Segoe UI', Arial, sans-serif;
  color: var(--text-primary);
  background: var(--tech-blue);
  margin: 0;
  padding: 0;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 10% 20%, rgba(191, 0, 255, 0.1) 0%, transparent 20%),
    radial-gradient(circle at 90% 80%, rgba(0, 245, 255, 0.1) 0%, transparent 20%);
  pointer-events: none;
  z-index: -1;
}

#root {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(10px);
  padding: 1.2rem 3rem;
  box-shadow: var(--shadow-glow);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

header h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
}

header nav {
  display: flex;
  gap: 1.5rem;
}

header nav button {
  color: var(--text-primary);
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

header nav button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.5s;
}

header nav button:hover::before {
  left: 100%;
}

header nav button:hover {
  color: var(--neon-cyan);
}

header nav button.active {
  background: rgba(0, 245, 255, 0.1);
  color: var(--neon-cyan);
}

main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  overflow-y: auto;
}

.card-container {
  background: rgba(45, 45, 68, 0.7);
  backdrop-filter: blur(10px);
  padding: 3rem;
  border-radius: 16px;
  box-shadow: var(--shadow-deep);
  max-width: 800px;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.card-container::before {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  z-index: -1;
  background: linear-gradient(45deg, var(--neon-purple), transparent, var(--neon-cyan));
  border-radius: 18px;
  animation: border-glow 3s linear infinite;
}

@keyframes border-glow {
  0% { opacity: 0.3; }
  50% { opacity: 0.7; }
  100% { opacity: 0.3; }
}

.form-group {
  margin-bottom: 1.8rem;
  width: 100%;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  text-align: left;
  font-weight: 500;
  color: var(--text-secondary);
}

input[type="text"], input[type="password"] {
  padding: 1rem 1.2rem;
  background: rgba(26, 26, 46, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  width: 100%;
  box-sizing: border-box;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: var(--text-primary);
}

input[type="text"]:focus, input[type="password"]:focus {
  border-color: var(--neon-cyan);
  outline: none;
  box-shadow: 0 0 10px rgba(0, 245, 255, 0.3);
}

input[type="text"]::placeholder, input[type="password"]::placeholder {
  color: rgba(178, 178, 178, 0.6);
}

button.primary {
  background: var(--primary-gradient);
  color: white;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

button.primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(rgba(255, 255, 255, 0.2), transparent);
  transform: translateY(-100%);
  transition: transform 0.3s ease;
}

button.primary:hover::before {
  transform: translateY(0);
}

button.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.6);
}

h1 {
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

p {
  color: var(--text-secondary);
  margin-top: 0;
}

.page-section {
  width: 100%;
  text-align: left;
}

.item-card {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 12px;
  padding: 1.8rem;
  margin-top: 1.5rem;
  text-align: left;
  width: 100%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(0, 245, 255, 0.2);
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 1.2rem;
}

.skill-tag {
  background: var(--secondary-gradient);
  color: var(--text-primary);
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.fade-in {
  animation: fadeIn 0.5s ease forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
}

.dashboard-card {
  background: rgba(26, 26, 46, 0.6);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  border-color: rgba(191, 0, 255, 0.2);
}

.dashboard-card h3 {
  margin-top: 0;
  color: var(--neon-cyan);
}

.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  opacity: 0.1;
  background: 
    repeating-linear-gradient(0deg, transparent, transparent 50px, 
    rgba(0, 245, 255, 0.2) 50px, rgba(0, 245, 255, 0.2) 51px),
    repeating-linear-gradient(90deg, transparent, transparent 50px, 
    rgba(191, 0, 255, 0.2) 50px, rgba(191, 0, 255, 0.2) 51px);
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-top: 0.8rem;
}

.progress-fill {
  height: 100%;
  background: var(--success);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.connection-line {
  position: absolute;
  background: var(--neon-purple);
  height: 2px;
  transform-origin: 0 0;
  z-index: -1;
}

.pulse {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(0, 245, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(0, 245, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(0, 245, 255, 0); }
}

@media (max-width: 768px) {
  header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  header nav {
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .card-container {
    padding: 2rem 1.5rem;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
`;
document.head.appendChild(style);

// --- REDUX STATE MANAGEMENT ---

// Define types for the state and actions
interface UserState {
  isLoggedIn: boolean;
}

interface Profile {
  name: string;
  skills: string[];
  interests: string[];
}

interface ProfileState {
  profile: Profile;
}

interface Career {
  id: number;
  title: string;
  description: string;
  requiredSkills: string[];
  matchPercentage: number;
}

interface CareerState {
  careers: Career[];
}

interface AppState {
  user: UserState;
  profile: ProfileState;
  career: CareerState;
}

type Action = { type: string; payload?: any };
type Reducer<S> = (state: S, action: Action) => S;

interface Slice<S> {
  name: string;
  initialState: S;
  reducers: { [key: string]: Reducer<S> };
}

interface StoreReducers {
  user: Slice<UserState>;
  profile: Slice<ProfileState>;
  career: Slice<CareerState>;
}

const userSlice: Slice<UserState> = {
  name: 'user',
  initialState: { isLoggedIn: false },
  reducers: {
    login: (state) => { return { ...state, isLoggedIn: true }; },
    logout: (state) => { return { ...state, isLoggedIn: false }; },
  },
};

const initialProfile: Profile = {
  name: '',
  skills: ['Figma', 'Python', 'User Research', 'JavaScript'],
  interests: ['Technology', 'Design', 'Data', 'Development'],
};

const calculateMatchPercentage = (career: Career, profileSkills: string[]): number => {
  const matchingSkills = career.requiredSkills.filter(skill => 
    profileSkills.includes(skill)
  ).length;
  
  return Math.round((matchingSkills / career.requiredSkills.length) * 100);
};

const profileSlice: Slice<ProfileState> = {
  name: 'profile',
  initialState: { profile: initialProfile },
  reducers: {
    setProfile: (state, action) => { 
      const updatedProfile = { ...state.profile, ...action.payload };
      return { ...state, profile: updatedProfile }; 
    },
  },
};

const mockCareers: Career[] = [
  { 
    id: 1, 
    title: 'UX/UI Designer', 
    description: 'Focuses on creating intuitive and user-friendly interfaces.', 
    requiredSkills: ['Figma', 'Sketch', 'User Research', 'Prototyping', 'Wireframing'],
    matchPercentage: 0
  },
  { 
    id: 2, 
    title: 'Data Scientist', 
    description: 'Analyzes and interprets complex digital data.', 
    requiredSkills: ['Python', 'R', 'Machine Learning', 'SQL', 'Data Visualization'],
    matchPercentage: 0
  },
  { 
    id: 3, 
    title: 'Frontend Developer', 
    description: 'Builds interactive and responsive web applications.', 
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript'],
    matchPercentage: 0
  },
  { 
    id: 4, 
    title: 'Full Stack Engineer', 
    description: 'Works on both frontend and backend development.', 
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'API Design'],
    matchPercentage: 0
  },
];

// Calculate initial match percentages
mockCareers.forEach(career => {
  career.matchPercentage = calculateMatchPercentage(career, initialProfile.skills);
});

const careerSlice: Slice<CareerState> = {
  name: 'career',
  initialState: { careers: mockCareers },
  reducers: {
    setCareers: (state, action) => { return { ...state, careers: action.payload }; },
  },
};

const createStore = (reducer: StoreReducers) => {
  let state: AppState = {
    user: reducer.user.initialState,
    profile: reducer.profile.initialState,
    career: reducer.career.initialState,
  };
  const listeners: (() => void)[] = [];

  const getState = () => state;
  const dispatch = (action: Action) => {
    const nextState = { ...state };
    const [sliceName, reducerName] = action.type.split('/');

    switch (sliceName) {
      case 'user':
        nextState.user = userSlice.reducers[reducerName](state.user, action);
        break;
      case 'profile':
        nextState.profile = profileSlice.reducers[reducerName](state.profile, action);
        break;
      case 'career':
        nextState.career = careerSlice.reducers[reducerName](state.career, action);
        break;
    }

    state = nextState;
    listeners.forEach(listener => listener());
  };

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  };

  return { getState, dispatch, subscribe };
};

const store = createStore({
  user: userSlice,
  profile: profileSlice,
  career: careerSlice,
});

// --- REACT HOOKS (MOCK IMPLEMENTATIONS) ---

const useDispatch = () => store.dispatch;
const useSelector = <T,>(selector: (state: AppState) => T): T => {
  const [state, setState] = useState(selector(store.getState()));
  useEffect(() => {
    const unsubscribe = store.subscribe(() => { setState(selector(store.getState())); });
    return () => unsubscribe();
  }, [selector]);
  return state;
};

// --- COMPONENTS ---
interface ComponentProps {
  setPage: (page: string) => void;
  currentPage: string;
}

const Homepage: React.FC<ComponentProps> = ({ setPage }) => (
  <div className="card-container fade-in">
    <h1>Your Tech Career Journey Awaits</h1>
    <p>Discover your path in the tech industry with personalized career recommendations and skills analysis.</p>
    <button className="primary pulse" onClick={() => setPage('login')}>Launch Career Advisor</button>
  </div>
);

const Login: React.FC<ComponentProps> = ({ setPage }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleLogin = () => {
    dispatch({ type: 'user/login' });
    setPage('dashboard');
  };
  return (
    <div className="card-container fade-in">
      <h1>Access Portal</h1>
      <div className="form-group">
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
      </div>
      <button className="primary" onClick={handleLogin}>Authenticate</button>
      <p style={{marginTop: '20px', fontSize: '0.9rem'}}>New user? <a href="#" onClick={() => setPage('signup')} style={{color: '#00F5FF', textDecoration: 'none'}}>Initialize Account</a></p>
    </div>
  );
};

const Signup: React.FC<ComponentProps> = ({ setPage }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const handleSignup = () => {
    dispatch({ type: 'user/login' }); 
    dispatch({ type: 'profile/setProfile', payload: { ...initialProfile, name: username } });
    setPage('dashboard');
  };
  return (
    <div className="card-container fade-in">
      <h1>Account Initialization</h1>
      <div className="form-group">
        <label>Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Create your username" />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create secure password" />
      </div>
      <button className="primary" onClick={handleSignup}>Initialize System</button>
      <p style={{marginTop: '20px', fontSize: '0.9rem'}}>Existing user? <a href="#" onClick={() => setPage('login')} style={{color: '#00F5FF', textDecoration: 'none'}}>Access Portal</a></p>
    </div>
  );
};

const Dashboard: React.FC<ComponentProps> = ({ setPage }) => {
  const profile = useSelector((state) => state.profile.profile);
  return (
    <div className="card-container fade-in">
      <h1>Welcome, {profile.name || 'Tech Explorer'}!</h1>
      <p>Your career dashboard is ready. Select an option to continue.</p>
      
      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => setPage('careers')}>
          <h3>Career Explorer</h3>
          <p>Discover paths that match your skills</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setPage('skills')}>
          <h3>Skills Analyzer</h3>
          <p>Identify skills to develop</p>
        </div>
        
        <div className="dashboard-card" onClick={() => setPage('profile')}>
          <h3>Profile Settings</h3>
          <p>Customize your information</p>
        </div>
      </div>
    </div>
  );
};

const CareerExplorer: React.FC<ComponentProps> = ({ setPage }) => {
  const careers = useSelector((state) => state.career.careers);
  const profile = useSelector((state) => state.profile.profile);
  
  return (
    <div className="card-container fade-in page-section">
      <h1>Career Explorer</h1>
      <p style={{ textAlign: 'center' }}>Discover career paths that match your skill profile.</p>
      
      {careers.map((career) => (
        <div key={career.id} className="item-card">
          <h3>{career.title}</h3>
          <p>{career.description}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
            <span style={{ marginRight: '1rem', color: '#00F5FF', fontWeight: '500' }}>
              Match: {career.matchPercentage}%
            </span>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div 
                className="progress-fill" 
                style={{ width: `${career.matchPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <h4 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#B2B2B2' }}>Required Skills:</h4>
          <div className="skills-list">
            {career.requiredSkills.map((skill, index) => (
              <span 
                key={index} 
                className="skill-tag"
                style={{ 
                  opacity: profile.skills.includes(skill) ? 1 : 0.6 
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const SkillsAnalyzer: React.FC<ComponentProps> = ({ setPage }) => {
  const profile = useSelector((state) => state.profile.profile);
  const careers = useSelector((state) => state.career.careers);
  
  const getSkillsGap = () => {
    const allRequiredSkills = new Set(careers.flatMap(c => c.requiredSkills));
    const skillsYouHave = new Set(profile.skills);
    return Array.from(allRequiredSkills).filter(skill => !skillsYouHave.has(skill));
  };
  
  const skillsToLearn = getSkillsGap();
  
  return (
    <div className="card-container fade-in page-section">
      <h1>Skills Analyzer</h1>
      <p style={{ textAlign: 'center' }}>Identify skills to develop for career advancement.</p>
      
      <div className="item-card">
        <h3>Your Current Skills</h3>
        <div className="skills-list">
          {profile.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
      
      <div className="item-card">
        <h3>Skills to Develop</h3>
        {skillsToLearn.length > 0 ? (
          <>
            <p>These skills will increase your career options:</p>
            <div className="skills-list">
              {skillsToLearn.map((skill, index) => (
                <span key={index} className="skill-tag" style={{ background: 'var(--warning)' }}>{skill}</span>
              ))}
            </div>
          </>
        ) : (
          <p>Your skill set matches all required skills in our database. Excellent!</p>
        )}
      </div>
    </div>
  );
};

const Profile: React.FC<ComponentProps> = ({ setPage }) => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile.profile);
  const [name, setName] = useState(profile.name);
  
  const handleSave = () => {
    dispatch({ type: 'profile/setProfile', payload: { ...profile, name } });
    setPage('dashboard');
  };
  
  return (
    <div className="card-container fade-in">
      <h1>Profile Configuration</h1>
      
      <div className="form-group">
        <label>Display Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      
      <div className="page-section">
        <h3>Your Skills</h3>
        <div className="skills-list">
          {profile.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
      
      <button className="primary" style={{ marginTop: '20px' }} onClick={handleSave}>
        Save Configuration
      </button>
    </div>
  );
};

const Header: React.FC<ComponentProps> = ({ setPage, currentPage }) => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  
  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
    setPage('homepage');
  };
  
  return (
    <header>
      <h1>Career Advisor</h1>
      <nav>
        {isLoggedIn ? (
          <>
            <button 
              className={currentPage === 'dashboard' ? 'active' : ''}
              onClick={() => setPage('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={currentPage === 'careers' ? 'active' : ''}
              onClick={() => setPage('careers')}
            >
              Careers
            </button>
            <button 
              className={currentPage === 'skills' ? 'active' : ''}
              onClick={() => setPage('skills')}
            >
              Skills
            </button>
            <button 
              className={currentPage === 'profile' ? 'active' : ''}
              onClick={() => setPage('profile')}
            >
              Profile
            </button>
            <button onClick={handleLogout}>Log Out</button>
          </>
        ) : (
          <>
            <button 
              className={currentPage === 'homepage' ? 'active' : ''}
              onClick={() => setPage('homepage')}
            >
              Home
            </button>
            <button 
              className={currentPage === 'login' ? 'active' : ''}
              onClick={() => setPage('login')}
            >
              Login
            </button>
          </>
        )}
      </nav>
    </header>
  );
};

// Background pattern component
const TechBackground: React.FC = () => {
  return <div className="tech-background"></div>;
};

// --- MAIN APPLICATION COMPONENT ---
const App: React.FC = () => {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [currentPage, setCurrentPage] = useState('homepage');
  
  const pageComponent = () => {
    if (!isLoggedIn) {
      if (currentPage === 'login') return <Login setPage={setCurrentPage} currentPage={currentPage} />;
      if (currentPage === 'signup') return <Signup setPage={setCurrentPage} currentPage={currentPage} />;
      return <Homepage setPage={setCurrentPage} currentPage={currentPage} />;
    }
    
    switch (currentPage) {
      case 'dashboard': return <Dashboard setPage={setCurrentPage} currentPage={currentPage} />;
      case 'careers': return <CareerExplorer setPage={setCurrentPage} currentPage={currentPage} />;
      case 'skills': return <SkillsAnalyzer setPage={setCurrentPage} currentPage={currentPage} />;
      case 'profile': return <Profile setPage={setCurrentPage} currentPage={currentPage} />;
      default: return <Dashboard setPage={setCurrentPage} currentPage={currentPage} />;
    }
  };
  
  return (
    <div className="app-container">
      <TechBackground />
      <Header setPage={setCurrentPage} currentPage={currentPage} />
      <main>{pageComponent()}</main>
    </div>
  );
};

const root = createRoot(document.getElementById('root') || document.body.appendChild(document.createElement('div')));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
