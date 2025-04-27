import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/appointments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load appointments');
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/appointment/${appointmentId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.map(a => a.id === appointmentId ? { ...a, status } : a));
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  if (!user || user.role !== 'doctor') {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-8">Doctor Dashboard</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {loading ? (
            <p>Loading appointments...</p>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Your Appointments</h2>
              {appointments.length === 0 ? (
                <p>No appointments scheduled.</p>
              ) : (
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2">Patient</th>
                      <th className="py-2">Date</th>
                      <th className="py-2">Time</th>
                      <th className="py-2">Reason</th>
                      <th className="py-2">Contact</th>
                      <th className="py-2">Status</th>
                      <th className="py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appointment => (
                      <tr key={appointment.id} className="border-b">
                        <td className="py-2">{appointment.patientName}</td>
                        <td className="py-2">{appointment.date}</td>
                        <td className="py-2">{appointment.time}</td>
                        <td className="py-2">{appointment.reason}</td>
                        <td className="py-2">{appointment.contactMethod}: {appointment.contactDetails}</td>
                        <td className="py-2">{appointment.status}</td>
                        <td className="py-2">
                          {appointment.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'accepted')}
                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'declined')}
                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="bg-gray-900 text-white py-12"></footer>
    </div>
  );
}

export default DoctorDashboard;