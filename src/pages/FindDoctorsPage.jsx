import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useProfiles } from '../context/ProfileContext';

function FindDoctorsPage() {
  const { profiles } = useProfiles();
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    searchTerm: ''
  });
  
  // Get unique specialties and locations for filter dropdowns
  const specialties = [...new Set(profiles.map(profile => profile.specialty))];
  const locations = [...new Set(profiles.map(profile => {
    // Extract city from location
    const locationParts = profile.location.split(',');
    return locationParts.length > 1 ? locationParts[1].trim() : locationParts[0].trim();
  }))];

  // Apply filters whenever profiles or filter values change
  useEffect(() => {
    let result = [...profiles];
    
    // Apply specialty filter
    if (filters.specialty) {
      result = result.filter(profile => profile.specialty === filters.specialty);
    }
    
    // Apply location filter (partial match on city)
    if (filters.location) {
      result = result.filter(profile => profile.location.includes(filters.location));
    }
    
    // Apply search term (match on name, specialty, or qualifications)
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(profile => 
        profile.name.toLowerCase().includes(searchLower) ||
        profile.specialty.toLowerCase().includes(searchLower) ||
        profile.qualifications.toLowerCase().includes(searchLower) ||
        profile.about?.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredProfiles(result);
  }, [profiles, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      specialty: '',
      location: '',
      searchTerm: ''
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Find a Physiotherapist</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse through our network of qualified physiotherapists and find the right specialist for your needs.
            </p>
          </div>
          
          {/* Filters */}
          <div className="mb-10 bg-white p-6 rounded-lg shadow-md">
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="searchTerm" className="block text-gray-700 font-medium mb-2">Search</label>
                <input
                  type="text"
                  id="searchTerm"
                  name="searchTerm"
                  value={filters.searchTerm}
                  onChange={handleFilterChange}
                  placeholder="Search by name, specialty..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="specialty" className="block text-gray-700 font-medium mb-2">Specialty</label>
                <select
                  id="specialty"
                  name="specialty"
                  value={filters.specialty}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Location</label>
                <select
                  id="location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition duration-300"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.length > 0 ? (
              filteredProfiles.map(profile => (
                <div key={profile.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
                  <div className="h-48 bg-gray-200 relative">
                    {profile.photoUrl ? (
                      <img 
                        src={profile.photoUrl} 
                        alt={profile.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">{profile.name}</h2>
                    <p className="text-blue-600 font-medium mb-2">{profile.specialty}</p>
                    <p className="text-gray-600 mb-4">{profile.qualifications}</p>
                    
                    <div className="flex items-start mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-gray-600">{profile.location}</p>
                    </div>
                    
                    <div className="flex items-start mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-600">{profile.experience} Experience</p>
                    </div>
                    
                    <Link
                      to={`/doctor/${profile.id}`}
                      className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition duration-300"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                {profiles.length === 0 ? (
                  <>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No profiles yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to add your professional profile.</p>
                    <Link
                      to="/add-profile"
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                    >
                      Add Your Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No matches found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search filters</p>
                    <button 
                      onClick={clearFilters}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                    >
                      Clear All Filters
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
          
          {/* Call to action for professionals */}
          {filteredProfiles.length > 0 && (
            <div className="mt-12 bg-blue-50 border border-blue-100 rounded-lg p-6 md:p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">Are you a physiotherapist?</h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our growing network of professionals and connect with patients in need of your expertise.
              </p>
              <Link
                to="/add-profile"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
              >
                Add Your Profile
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default FindDoctorsPage;