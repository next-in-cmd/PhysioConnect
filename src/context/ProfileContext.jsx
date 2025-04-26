import { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ProfileContext = createContext();

// Custom hook to use the profile context
export const useProfiles = () => {
  return useContext(ProfileContext);
};

// Provider component
export const ProfileProvider = ({ children }) => {
  // Load profiles from localStorage on initial render
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem('doctorProfiles');
    return savedProfiles ? JSON.parse(savedProfiles) : [];
  });

  // Save profiles to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('doctorProfiles', JSON.stringify(profiles));
  }, [profiles]);

  // Add a new profile
  const addProfile = (profile) => {
    // Generate a unique ID for the profile
    const newProfile = {
      ...profile,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    setProfiles(prevProfiles => [...prevProfiles, newProfile]);
    return newProfile.id; // Return the ID of the newly created profile
  };

  // Get a profile by ID
  const getProfileById = (id) => {
    return profiles.find(profile => profile.id === id);
  };

  // Delete a profile
  const deleteProfile = (id) => {
    setProfiles(prevProfiles => prevProfiles.filter(profile => profile.id !== id));
  };

  const value = {
    profiles,
    addProfile,
    getProfileById,
    deleteProfile
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};