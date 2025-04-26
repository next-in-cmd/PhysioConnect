import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useProfiles } from '../context/ProfileContext';

function AddProfilePage() {
  const navigate = useNavigate();
  const { addProfile } = useProfiles();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    specialty: '',
    qualifications: '',
    experience: '',
    about: '',
    photo: null,
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a URL for the file for preview (this is temporary)
      const photoUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoUrl: photoUrl // Save the URL for display
      }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.specialty.trim()) newErrors.specialty = 'Specialty is required';
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience details are required';
    
    return newErrors;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process the file for storage
      // In a real app, you'd upload this to a server
      // For now, we'll just keep the object URL
      
      // Add the profile using our context
      const profileId = addProfile(formData);
      
      // Show success message
      setSubmitSuccess(true);
      
      // Redirect to success page after a brief delay
      setTimeout(() => {
        navigate('/profilesuccess', { 
          state: { profileId } // Pass the ID to the success page
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel button
  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6 md:p-8">
            <h1 className="text-3xl font-bold text-center mb-8">Add Your Professional Profile</h1>
            
            {submitSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                <p className="text-center">Your profile has been successfully submitted! Redirecting...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errors.submit && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <p>{errors.submit}</p>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name*</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="Dr. John Smith"
                      />
                      {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="doctor@example.com"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">Phone Number*</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="block text-gray-700 font-medium mb-2">Practice Location*</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.location ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="123 Healing Ave, New York, NY"
                      />
                      {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                    </div>
                  </div>
                  
                  {/* Professional Information */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="specialty" className="block text-gray-700 font-medium mb-2">Specialty*</label>
                      <select
                        id="specialty"
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.specialty ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                      >
                        <option value="">Select Specialty</option>
                        <option value="Orthopedic Physiotherapy">Orthopedic Physiotherapy</option>
                        <option value="Neurological Rehabilitation">Neurological Rehabilitation</option>
                        <option value="Pediatric Physiotherapy">Pediatric Physiotherapy</option>
                        <option value="Sports Physiotherapy">Sports Physiotherapy</option>
                        <option value="Geriatric Physiotherapy">Geriatric Physiotherapy</option>
                        <option value="Cardiovascular Rehabilitation">Cardiovascular Rehabilitation</option>
                        <option value="Women's Health">Women's Health</option>
                        <option value="Other">Other</option>
                      </select>
                      {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="qualifications" className="block text-gray-700 font-medium mb-2">Qualifications*</label>
                      <input
                        type="text"
                        id="qualifications"
                        name="qualifications"
                        value={formData.qualifications}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.qualifications ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="DPT, FAAOMPT, etc."
                      />
                      {errors.qualifications && <p className="text-red-500 text-sm mt-1">{errors.qualifications}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="experience" className="block text-gray-700 font-medium mb-2">Years of Experience*</label>
                      <input
                        type="text"
                        id="experience"
                        name="experience"
                        value={formData.experience}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${errors.experience ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 border-gray-300'}`}
                        placeholder="10 years"
                      />
                      {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">Profile Photo</label>
                      <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.photoUrl && (
                        <div className="mt-2">
                          <img 
                            src={formData.photoUrl} 
                            alt="Profile preview" 
                            className="h-20 w-20 object-cover rounded-full"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* About Section */}
                <div>
                  <label htmlFor="about" className="block text-gray-700 font-medium mb-2">About You</label>
                  <textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your experience, approach to treatment, specializations, etc."
                  ></textarea>
                </div>
                
                <div className="flex items-center justify-between pt-4">
                  <button 
                    type="button" 
                    onClick={handleCancel}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition duration-300"
                  >
                    Cancel
                  </button>
                  
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default AddProfilePage;