import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import PhysioConnectHomepage from './pages/Home';
import FindDoctorsPage from './pages/FindDoctorsPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import AppointmentPage from './pages/AppointmentPage';
import AddProfilePage from './pages/ProfilePage';
import ProfileSuccessPage from './pages/ProfileSuccessPage';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import DoctorDashboard from './components/DoctorDashBoard';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        
          <Routes>
            <Route path="/" element={<PhysioConnectHomepage />} />
            <Route path="/find-doctors" element={<FindDoctorsPage />} />
            <Route path="/doctor/:id" element={<DoctorDetailPage />} />
            <Route path="/book-appointment/:id" element={<PrivateRoute role="patient"><AppointmentPage /></PrivateRoute>} />
            <Route path="/add-profile" element={<PrivateRoute role="doctor"><AddProfilePage /></PrivateRoute>} />
            <Route path="/profilesuccess" element={<PrivateRoute role="doctor"><ProfileSuccessPage /></PrivateRoute>} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<PrivateRoute role="doctor"><DoctorDashboard /></PrivateRoute>} />
          </Routes>
        
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;