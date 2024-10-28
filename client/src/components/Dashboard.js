import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/authContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPinModal, setShowPinModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  const features = [
    {
      title: "Easy Creation",
      description: "Build detailed property listings with our user-friendly interface.",
      icon: "📝"
    },
    {
      title: "Google Maps Integration",
      description: "Showcase exact property locations with integrated maps.",
      icon: "🗺️"
    },
    {
      title: "WhatsApp Optimized",
      description: "Share listings that preview perfectly on WhatsApp.",
      icon: "💬"
    },
    {
      title: "Performance Tracking",
      description: "Monitor views, shares, and engagement for each listing.",
      icon: "📊"
    }
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const checkAuthAndRedirect = () => {
    const headers = getAuthHeaders();
    if (!headers) {
      logout();
      navigate('/');
      return false;
    }
    return true;
  };

  const fetchProperties = async () => {
    const headers = getAuthHeaders();
    if (!headers) {
      logout();
      navigate('/');
      return;
    }

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URI}/user-properties`,
        { headers }
      );

      setProperties(response.data.properties || []);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setError(error.response?.data?.message || 'Error fetching properties');
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  const handleSecurityToggle = async (property, isSecure) => {
    const headers = getAuthHeaders();
    if (!headers) {
      logout();
      navigate('/');
      return;
    }

    if (isSecure) {
      setSelectedProperty(property);
      setShowPinModal(true);
      setPin('');
      setPinError('');
    } else {
      try {
        await axios.put(
          `${process.env.REACT_APP_URI}/update-property`,
          {
            id: property._id,
            secure: false,
            accessCode: ''
          },
          { headers }
        );
        await fetchProperties();
        alert(`Property visibility changed to public: ${property.title}`);
      } catch (error) {
        console.error('Error updating property security:', error);
        if (error.response?.status === 401) {
          logout();
          navigate('/');
        } else {
          alert('Failed to update property security settings');
        }
      }
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    
    const headers = getAuthHeaders();
    if (!headers) {
      logout();
      navigate('/');
      return;
    }

    if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
      setPinError('Please enter a valid 4-digit pin');
      return;
    }

    try {
      await axios.put(
        `${process.env.REACT_APP_URI}/update-property`,
        {
          id: selectedProperty._id,
          secure: true,
          accessCode: pin
        },
        { headers }
      );
      await fetchProperties();
      setShowPinModal(false);
      alert(`Property visibility changed to private: ${selectedProperty.title}`);
    } catch (error) {
      console.error('Error updating property security:', error);
      if (error.response?.status === 401) {
        logout();
        navigate('/');
      } else {
        setPinError('Failed to update security settings. Please try again.');
      }
    }
  };

  const PinModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Set Access Pin</h2>
        <p className="text-gray-600 mb-4">
          Enter a 4-digit pin to make private: {selectedProperty?.title}
        </p>
        <form onSubmit={handlePinSubmit}>
          <input
            type="text"
            inputMode="numeric"
            autoFocus
            value={pin}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 4);
              setPin(value);
            }}
            placeholder="Enter 4-digit pin"
            className="w-full px-4 py-2 border rounded-md mb-4 text-center text-2xl tracking-wider"
            style={{ letterSpacing: '0.5em' }}
          />
          {pinError && (
            <p className="text-red-500 text-sm mb-4">{pinError}</p>
          )}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowPinModal(false);
                fetchProperties();
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Set Pin
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderPropertyCard = (property) => (
    <div 
      key={property._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-[150px]"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 overflow-ellipsis flex-1">
            {property.title || 'Untitled Property'}
          </h3>
          <label className="inline-flex items-center cursor-pointer ml-4">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={property.secure}
              onChange={(e) => handleSecurityToggle(property, e.target.checked)}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600">
            </div>
            <span className="ms-3 text-sm font-medium text-gray-700">
              {property.secure ? 'Private' : 'Public'}
            </span>
          </label>
        </div>
        <button
          onClick={() => handleViewDetails(property._id)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors mt-auto w-full sm:w-auto self-end"
        >
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">LANDX.IN</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L12.586 6H7a1 1 0 1 1 0-2h8a1 1 0 0 1 1 1v8a1 1 0 1 1-2 0V7.414z" 
                clipRule="evenodd" 
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Property Listings
          </h2>
          <p className="text-lg md:text-xl text-white mb-8 max-w-2xl mx-auto">
            Create, share, and track real estate listings in seconds. Optimized
            for WhatsApp and social media sharing across India.
          </p>
          <button 
            onClick={() => navigate('/createproperty')}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-md font-medium transition-colors"
          >
            Create Your Listing
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-blue-500 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Property Listings */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Your Properties</h2>
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.length > 0 ? (
              properties.map(renderPropertyCard)
            ) : (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600 mb-4">No properties found.</p>
                <button 
                  onClick={() => navigate('/createproperty')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Create Your First Listing
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pin Modal */}
      {showPinModal && <PinModal />}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center mt-16">
        <p>© 2024 LANDX.IN. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;