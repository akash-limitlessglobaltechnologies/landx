import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../Context/authContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   // Update AuthContext to include logout functionality
   const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to signin page
  };

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

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          setLoading(false);
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_URI}/user-properties`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setProperties(response.data.properties);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'Error fetching properties');
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleViewDetails = (propertyId) => {
    navigate(`/property/${propertyId}`);
  };

  // Updated Property Card
  const renderPropertyCard = (property) => (
    <div 
      key={property._id}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-[150px]"
    >
      <div className="p-6 flex flex-col justify-between h-full">
        <h3 className="text-xl font-semibold text-gray-800 mb-4 line-clamp-2 overflow-ellipsis">
          {property.title || 'Untitled Property'}
        </h3>
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

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center mt-16">
        <p>© 2024 LANDX.IN. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;