import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useProfiles } from '../context/ProfileContext';

function AppointmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProfileById } = useProfiles();
  const profile = getProfileById(id);
  
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [preferredContact, setPreferredContact] = useState('email');
  const [contactDetails, setContactDetails] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  
  // Get today's date in YYYY-MM-DD format for the date input min attribute
  const today = new Date().toISOString().split('T')[0];
  
  // For demo purposes, generate time slots for the selected date
  useEffect(() => {
    if (selectedDate) {
      // In a real app, you would fetch available slots from a backend
      const slots = generateTimeSlots(selectedDate);
      setAvailableTimeSlots(slots);
    } else {
      setAvailableTimeSlots([]);
    }
  }, [selectedDate]);
  
  // Helper function to generate time slots (9 AM to 5 PM)
  const generateTimeSlots = (date) => {
    // Convert selected date string to Date object
    const selectedDateObj = new Date(date);
    const dayOfWeek = selectedDateObj.getDay();
    
    // If weekend (0 = Sunday, 6 = Saturday), return empty array
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return [];
    }
    
    // For weekdays, generate slots from 9 AM to 5 PM, 30 minute intervals
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`);
      slots.push(`${hour}:30 ${hour >= 12 ? 'PM' : 'AM'}`);
    }
    
    // Randomly mark some slots as unavailable (for demo purposes)
    return slots.map(slot => ({
      time: slot,
      available: Math.random() > 0.3 // 70% of slots will be available
    }));
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setAppointmentSuccess(true);
      
      // Reset form
      setSelectedDate('');
      setSelectedTimeSlot('');
      setReason('');
      setContactDetails('');
    }, 1500);
  };
  
  // If profile not found, show error
  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-20">
          <div className="container mx-auto px-4 py-12 text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile Not Found</h1>
            <p className="text-gray-600 mb-8">The doctor profile you're looking for doesn't exist or has been removed.</p>
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
            onClick={() => navigate(`/doctor/${id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to doctor profile
          </button>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-blue-600 text-white p-6">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-white border-2 border-white mr-4 flex-shrink-0">
                  {profile.photoUrl ? (
                    <img 
                      src={profile.photoUrl} 
                      alt={profile.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold">Book Appointment with</h1>
                  <p className="text-xl">{profile.name} - {profile.specialty}</p>
                </div>
              </div>
            </div>
            
            {/* Success message */}
            {appointmentSuccess ? (
              <div className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Appointment Request Sent!</h2>
                <p className="text-gray-600 mb-6">
                  We've sent your appointment request to Dr. {profile.name.split(' ')[1]}. 
                  You'll receive a confirmation email shortly.
                </p>
                <div className="flex justify-center space-x-4">
                  <Link 
                    to={`/doctor/${id}`}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-300"
                  >
                    Back to Doctor Profile
                  </Link>
                  <button 
                    onClick={() => setAppointmentSuccess(false)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition duration-300"
                  >
                    Book Another Appointment
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 md:p-8">
                <form onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Date Selection */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="date">
                        Select a Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        min={today}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                      />
                      {selectedDate && (dayOfWeek(selectedDate) === 0 || dayOfWeek(selectedDate) === 6) && (
                        <p className="mt-2 text-red-500 text-sm">
                          The doctor is not available on weekends. Please select a weekday.
                        </p>
                      )}
                    </div>
                    
                    {/* Time Slot Selection */}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2" htmlFor="time-slot">
                        Select a Time Slot
                      </label>
                      <select
                        id="time-slot"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={selectedTimeSlot}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        disabled={!selectedDate || availableTimeSlots.length === 0}
                        required
                      >
                        <option value="">Select a time slot</option>
                        {availableTimeSlots.map((slot, index) => (
                          slot.available ? (
                            <option key={index} value={slot.time}>
                              {slot.time}
                            </option>
                          ) : (
                            <option key={index} value={slot.time} disabled className="text-gray-400">
                              {slot.time} (Unavailable)
                            </option>
                          )
                        ))}
                      </select>
                      {selectedDate && availableTimeSlots.length === 0 && (
                        <p className="mt-2 text-red-500 text-sm">
                          No time slots available for the selected date. Please select another date.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Reason for appointment */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="reason">
                      Reason for Appointment
                    </label>
                    <textarea
                      id="reason"
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Please briefly describe your symptoms or reason for the appointment"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  
                  {/* Contact preference */}
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      Preferred Contact Method
                    </label>
                    <div className="flex space-x-4">
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-blue-600"
                          name="contact-method"
                          value="email"
                          checked={preferredContact === 'email'}
                          onChange={() => setPreferredContact('email')}
                        />
                        <span className="ml-2">Email</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          className="form-radio text-blue-600"
                          name="contact-method"
                          value="phone"
                          checked={preferredContact === 'phone'}
                          onChange={() => setPreferredContact('phone')}
                        />
                        <span className="ml-2">Phone</span>
                      </label>
                    </div>
                  </div>
                  
                  {/* Contact details */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="contact-details">
                      {preferredContact === 'email' ? 'Your Email Address' : 'Your Phone Number'}
                    </label>
                    <input
                      type={preferredContact === 'email' ? 'email' : 'tel'}
                      id="contact-details"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={preferredContact === 'email' ? 'email@example.com' : '(123) 456-7890'}
                      value={contactDetails}
                      onChange={(e) => setContactDetails(e.target.value)}
                      required
                    />
                  </div>
                  
                  {/* Submit Button */}
                  <div className="text-center">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300 w-full md:w-auto"
                      disabled={isSubmitting || !selectedDate || !selectedTimeSlot || availableTimeSlots.length === 0}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : "Book Appointment"}
                    </button>
                  </div>
                </form>
              </div>
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

// Helper function to get day of week from date string
function dayOfWeek(dateString) {
  const date = new Date(dateString);
  return date.getDay(); // 0 = Sunday, 6 = Saturday
}

export default AppointmentPage;