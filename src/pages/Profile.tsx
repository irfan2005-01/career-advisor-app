import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setProfile } from '../store/profileSlice';
import { mockProfile } from '../assets/mockData';

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedProfile = {
      ...(profile || mockProfile),
      name: e.target.value,
    };
    dispatch(setProfile(updatedProfile));
  };

  return (
    <div className="page-container fade-in">
      <h1>User Profile</h1>
      <label>
        Name:
        <input
          type="text"
          value={profile?.name || mockProfile.name}
          onChange={handleChange}
        />
      </label>
      <h3>Skills:</h3>
      <ul>
        {(profile?.skills || mockProfile.skills).map((skill, index) => (
          <li key={index}>{skill}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;