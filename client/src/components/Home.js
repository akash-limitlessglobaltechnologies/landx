import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleCreateListing = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-500">LANDX.IN</div>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/signin')}
              className="px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              Sign In
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow bg-gradient-to-r from-blue-500 via-teal-500 to-green-500">
        <div className="max-w-4xl mx-auto text-center px-4 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Transform Your Property Listings
          </h1>
          <p className="text-lg md:text-xl text-white mb-8">
            Create, share, and track real estate listings in seconds. Optimized 
            for WhatsApp and social media sharing across India.
          </p>
          <button
            onClick={handleCreateListing}
            className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Create Your Listing
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Easy Creation */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Easy Creation
              </h3>
              <p className="text-gray-600">
                Build detailed property listings with our user-friendly interface.
              </p>
            </div>

            {/* Google Maps Integration */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Google Maps Integration
              </h3>
              <p className="text-gray-600">
                Showcase exact property locations with integrated maps.
              </p>
            </div>

            {/* WhatsApp Optimized */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                WhatsApp Optimized
              </h3>
              <p className="text-gray-600">
                Share listings that preview perfectly on WhatsApp.
              </p>
            </div>

            {/* Performance Tracking */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-500 mb-4">
                Performance Tracking
              </h3>
              <p className="text-gray-600">
                Monitor views, shares, and engagement for each listing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>&copy; 2024 LANDX.IN. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;