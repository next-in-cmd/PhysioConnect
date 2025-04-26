// App.jsx
import { Routes, Route } from 'react-router-dom';
import PhysioConnectHomepage from './pages/Home';
import Navbar from './components/Navbar';
import AddProfilePage from './pages/ProfilePage'
import ProfileSuccessPage from'./pages/ProfileSuccessPage';
import { ProfileProvider } from './context/ProfileContext';
import FindDoctorsPage from './pages/FindDoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';



function App() {
  return (
    <ProfileProvider>
      <Routes>
        {/* Define the root route to show your PhysioConnect homepage */}
        <Route path="/" element={<PhysioConnectHomepage />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/profilepage" element={<AddProfilePage />} />
        <Route path="/profilesuccess" element={<ProfileSuccessPage />} />
        <Route path="/find-doctors" element={<FindDoctorsPage />} />
        <Route path="/doctor/:id" element={<DoctorDetailPage />} />
     
        
      </Routes>
    </ProfileProvider>
  );
}

export default App;