// App.jsx
import { Routes, Route } from 'react-router-dom';
import PhysioConnectHomepage from './pages/Home';
import Navbar from './components/Navbar';
import AddProfilePage from './pages/ProfilePage'

function App() {
  return (
    
      <Routes>
        {/* Define the root route to show your PhysioConnect homepage */}
        <Route path="/" element={<PhysioConnectHomepage />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/profilepage" element={<AddProfilePage />} />
        
     
        
      </Routes>
    
  );
}

export default App;