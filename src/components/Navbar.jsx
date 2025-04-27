import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  return (
    <header className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          PhysioConnect
        </Link>

        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
            />
          </svg>
        </button>

        <nav className={`md:flex md:items-center ${isOpen ? 'block' : 'hidden'} absolute md:static top-full left-0 right-0 bg-gray-900 md:bg-transparent p-4 md:p-0`}>
          <div className="flex flex-col md:flex-row md:space-x-6">
            <Link
              to="/find-doctors"
              className="py-2 md:py-0 hover:text-blue-300 transition duration-300"
              onClick={() => setIsOpen(false)}
            >
              Find Doctors
            </Link>
            {user ? (
              <>
                {user.role === 'doctor' && (
                  <>
                    <Link
                      to="/add-profile"
                      className="py-2 md:py-0 hover:text-blue-300 transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Add Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="py-2 md:py-0 hover:text-blue-300 transition duration-300"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                  </>
                )}
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsOpen(false);
                  }}
                  className="py-2 md:py-0 hover:text-blue-300 transition duration-300 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="py-2 md:py-0 hover:text-blue-300 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="py-2 md:py-0 hover:text-blue-300 transition duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;