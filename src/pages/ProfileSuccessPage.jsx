import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function ProfileSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  // Get the profile ID from location state
  const profileId = location.state?.profileId;
  
  useEffect(() => {
    // Create countdown timer for automatic redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Redirect to find doctors page after countdown
      navigate('/find-doctors');
    }
  }, [countdown, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Successfully Added!</h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Thank you for submitting your professional profile. Your information has been successfully saved and is now visible to potential patients.
            </p>
            
            <div className="text-gray-500 mb-8">
              <p>You will be redirected to the Find Doctors page in {countdown} seconds...</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {profileId && (
                <Link 
                  to={`/doctor/${profileId}`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
                >
                  View Your Profile
                </Link>
              )}
              
              <Link 
                to="/find-doctors" 
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition duration-300"
              >
                Browse All Doctors
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default ProfileSuccessPage;