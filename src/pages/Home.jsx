import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust path as needed

function PhysioConnectHomepage() {
  const navigate = useNavigate();
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const updateNavbarHeight = () => {
      // Select the header element from the Navbar component
      const header = document.querySelector('header');
      if (header) {
        const height = header.offsetHeight;
        setNavbarHeight(height);
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
      }
    };

    // Initial calculation
    updateNavbarHeight();

    // Update on resize
    window.addEventListener('resize', updateNavbarHeight);
    return () => window.removeEventListener('resize', updateNavbarHeight);
  }, []);

  const handleAddProfileClick = (e) => {
    e.preventDefault();
    navigate('/add-profile');
  };

  const handleFindDoctorsClick = (e) => {
    e.preventDefault();
    navigate('/find-doctors');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main style={{ paddingTop: 'var(--navbar-height, 64px)' }}>
        {/* Hero Section */}
        <section className="relative bg-gray-900 text-white h-80 sm:h-96 md:h-[500px]">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-60" 
            style={{ 
              backgroundImage: "url('https://via.placeholder.com/1600x800')", // Use a reliable placeholder
            }}
          ></div>

          <div className="container mx-auto px-4 py-12 sm:py-16 relative z-10 h-full flex items-center">
            <div className="max-w-full sm:max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">Find The Right Physiotherapist Near You</h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">Connect with qualified physiotherapists in your area. Book appointments online and start your recovery journey today.</p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a 
                  href="#" 
                  onClick={handleFindDoctorsClick}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-medium transition duration-300 text-sm sm:text-base"
                >
                  Find Doctors
                </a>
                <a 
                  href="#" 
                  onClick={handleAddProfileClick}
                  className="bg-transparent border-2 border-white hover:bg-white hover:text-blue-800 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-medium transition duration-300 text-sm sm:text-base"
                >
                  Add Profile
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Why Choose PhysioConnect</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {/* Feature 1 */}
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Certified Experts</h3>
                <p className="text-gray-600 text-sm sm:text-base">Our platform features only verified and certified physiotherapists with proven expertise.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Easy Booking</h3>
                <p className="text-gray-600 text-sm sm:text-base">Schedule appointments online at your convenience without any hassle.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-blue-50 p-4 sm:p-6 rounded-lg text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Verified Reviews</h3>
                <p className="text-gray-600 text-sm sm:text-base">Read authentic patient reviews to choose the best physiotherapist for your needs.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">How PhysioConnect Works</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Our simple process makes it easy to find the right physiotherapist and book your appointment online.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Step 1 */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white font-bold text-lg sm:text-xl">1</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Find a Physiotherapist</h3>
                <p className="text-gray-600 text-sm sm:text-base">Search for qualified physiotherapists in your area who specialize in your condition.</p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white font-bold text-lg sm:text-xl">2</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Schedule an Appointment</h3>
                <p className="text-gray-600 text-sm sm:text-base">Select a convenient date and time that works for your schedule.</p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 text-white font-bold text-lg sm:text-xl">3</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Start Your Recovery</h3>
                <p className="text-gray-600 text-sm sm:text-base">Meet with your physiotherapist and begin your personalized treatment plan.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Top Physiotherapists Section */}
        <section className="py-10 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Meet Our Top Physiotherapists</h2>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">Our team of highly qualified physiotherapists is dedicated to providing exceptional care and personalized treatment plans.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
              {/* Doctor 1 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 sm:h-64 bg-gray-200">
                  <img src="https://via.placeholder.com/400x320" alt="Dr. Sarah Johnson" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">Dr. Sarah Johnson</h3>
                  <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">Orthopedic Physiotherapy</p>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-yellow-500 mr-1 text-sm sm:text-base">★</span>
                    <span className="font-medium text-sm sm:text-base">4.9</span>
                  </div>
                  <a href="#" className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition duration-300 text-sm sm:text-base">View Profile</a>
                </div>
              </div>

              {/* Doctor 2 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 sm:h-64 bg-gray-200">
                  <img src="https://via.placeholder.com/400x320" alt="Dr. Michael Chen" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">Dr. Michael Chen</h3>
                  <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">Neurological Rehabilitation</p>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-yellow-500 mr-1 text-sm sm:text-base">★</span>
                    <span className="font-medium text-sm sm:text-base">4.8</span>
                  </div>
                  <a href="#" className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition duration-300 text-sm sm:text-base">View Profile</a>
                </div>
              </div>

              {/* Doctor 3 */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <div className="h-48 sm:h-64 bg-gray-200">
                  <img src="https://via.placeholder.com/400x320" alt="Dr. Emily Rodriguez" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-1">Dr. Emily Rodriguez</h3>
                  <p className="text-gray-600 mb-2 sm:mb-3 text-sm sm:text-base">Pediatric Physiotherapy</p>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span className="text-yellow-500 mr-1 text-sm sm:text-base">★</span>
                    <span className="font-medium text-sm sm:text-base">4.9</span>
                  </div>
                  <a href="#" className="block text-center bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition duration-300 text-sm sm:text-base">View Profile</a>
                </div>
              </div>
            </div>

            <div className="text-center mt-8 sm:mt-10">
              <a 
                href="#" 
                className="inline-block bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium transition duration-300 text-sm sm:text-base"
              >
                View All Physiotherapists
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">&copy; 2025 PhysioConnect. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default PhysioConnectHomepage;
