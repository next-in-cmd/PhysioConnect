import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useProfiles } from '../context/ProfileContext';

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProfileById } = useProfiles();
  
  const profile = getProfileById(id);
  
  // If profile not found, show error or redirect
  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-8">The profile you're looking for doesn't exist or has been removed.</p>
            <Link 
              to="/find-doctors" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
            >
              Back to Find Doctors
            </Link>
          </div>
        </main>
        <footer className="bg-gray-900 text-white py-12"></footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          {/* Back button */}
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to results
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header with photo */}
            <div className="bg-blue-600 text-white p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-white border-4 border-white mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
                  {profile.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
                  <p className="text-xl mb-3">{profile.specialty}</p>
                  <p className="text-blue-100 mb-2">{profile.qualifications}</p>
                </div>
              </div>
            </div>
            
            {/* Details */}
            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Location</h3>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="text-gray-600">{profile.location}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Contact</h3>
                  <div className="flex items-start mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">{profile.email}</p>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-gray-600">{profile.phone}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Experience</h3>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-600">{profile.experience}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About</h2>
                <div className="prose max-w-none text-gray-600">
                  {profile.about ? (
                    <p>{profile.about}</p>
                  ) : (
                    <p className="text-gray-500 italic">No additional information provided.</p>
                  )}
                </div>
              </div>
              
              {/* Call to action */}
              <div className="mt-12 text-center">
                <a 
                  href={`mailto:${profile.email}?subject=Appointment Request`}
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 mx-2"
                >
                  Contact for Appointment
                </a>
                
                <Link 
                  to="/find-doctors" 
                  className="inline-block bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition duration-300 mx-2 mt-4 md:mt-0"
                >
                  View All Doctors
                </Link>
              </div>
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

export default DoctorDetailPage;