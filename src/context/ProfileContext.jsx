import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/profiles');
        setProfiles(response.data);
      } catch (error) {
        console.error('Error fetching profiles:', error);
      }
    };
    fetchProfiles();
  }, []);

  const addProfile = async (profileData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfiles([...profiles, { ...profileData, id: response.data.profileId }]);
      return response.data.profileId;
    } catch (error) {
      console.error('Error adding profile:', error);
      throw error;
    }
  };

  const getProfileById = (id) => {
    return profiles.find(profile => profile.id === id);
  };

  return (
    <ProfileContext.Provider value={{ profiles, addProfile, getProfileById }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfiles() {
  return useContext(ProfileContext);
}