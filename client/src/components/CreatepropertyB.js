import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreatePropertyB = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    features: [],
    nearbyPlaces: [''],
    locationLink: '',
    measurements: {
      frontage: '',
      backWidth: '',
      leftDepth: '',
      rightDepth: '',
    },
    unit: 'feet',
    direction: '',
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formError, setFormError] = useState('');

  const commonFeatures = [
    'Corner Plot', 'Park Facing', 'Main Road', 'Water Connection',
    'Electricity', 'Gated Community', 'Ready for Construction',
    'Security', 'Street Lights'
  ];

  const directions = [
    { value: 'N', label: 'North Facing' },
    { value: 'NE', label: 'North-East Facing' },
    { value: 'E', label: 'East Facing' },
    { value: 'SE', label: 'South-East Facing' },
    { value: 'S', label: 'South Facing' },
    { value: 'SW', label: 'South-West Facing' },
    { value: 'W', label: 'West Facing' },
    { value: 'NW', label: 'North-West Facing' }
  ];

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const handleNearbyPlaceChange = (index, value) => {
    const updatedPlaces = [...formData.nearbyPlaces];
    updatedPlaces[index] = value;
    setFormData(prev => ({ ...prev, nearbyPlaces: updatedPlaces }));
  };

  const handleAddNearbyPlace = () => {
    setFormData(prev => ({
      ...prev,
      nearbyPlaces: [...prev.nearbyPlaces, '']
    }));
  };

  const handleRemoveNearbyPlace = (index) => {
    setFormData(prev => ({
      ...prev,
      nearbyPlaces: prev.nearbyPlaces.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setFormError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('Please login to create a property');
        return;
      }

      const propertyData = {
        title: formData.title,
        rawJson: {
          description: formData.description,
          price: formData.price ? Number(formData.price) : 0,
          features: formData.features,
          nearbyPlaces: formData.nearbyPlaces.filter(place => place.trim()),
          measurements: {
            frontage: formData.measurements.frontage || '0',
            backWidth: formData.measurements.backWidth || formData.measurements.frontage || '0',
            leftDepth: formData.measurements.leftDepth || '0',
            rightDepth: formData.measurements.rightDepth || formData.measurements.leftDepth || '0',
          },
          unit: formData.unit,
          direction: formData.direction,
          locationLink: formData.locationLink
        }
      };

      const response = await fetch(`${process.env.REACT_APP_URI}/create-property`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create property');
      }

      setShowSuccess(true);
      
      // Redirect after animation
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating property:', error);
      setFormError(error.message || 'Failed to create property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Created Successfully!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-8 py-6">
            <h1 className="text-2xl font-bold text-blue-500">Create Property</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Basic Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Basic Information</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {commonFeatures.map((feature) => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureToggle(feature)}
                      className="rounded text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Measurements Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Measurements</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Front Width <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.measurements.frontage}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      measurements: { ...prev.measurements, frontage: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Back Width
                  </label>
                  <input
                    type="number"
                    value={formData.measurements.backWidth}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      measurements: { ...prev.measurements, backWidth: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Left Depth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.measurements.leftDepth}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      measurements: { ...prev.measurements, leftDepth: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Right Depth
                  </label>
                  <input
                    type="number"
                    value={formData.measurements.rightDepth}
                    onChange={e => setFormData(prev => ({
                      ...prev,
                      measurements: { ...prev.measurements, rightDepth: e.target.value }
                    }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit of Measurement
                  </label>
                  <select
                    value={formData.unit}
                    onChange={e => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="feet">Feet</option>
                    <option value="meters">Meters</option>
                    <option value="yards">Yards</option>
                    <option value="gaj">Gaj</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plot Direction
                  </label>
                  <select
                    value={formData.direction}
                    onChange={e => setFormData(prev => ({ ...prev, direction: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select direction</option>
                    {directions.map((dir) => (
                      <option key={dir.value} value={dir.value}>
                        {dir.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Location</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Google Maps Location
                </label>
                <textarea
                  value={formData.locationLink}
                  onChange={e => setFormData(prev => ({ ...prev, locationLink: e.target.value }))}
                  placeholder="Paste Google Maps embed link or iframe code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                />
              </div>
            </div>

            {/* Nearby Places Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">Nearby Places</h3>
              {formData.nearbyPlaces.map((place, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => handleNearbyPlaceChange(index, e.target.value)}
                    placeholder="Enter nearby place"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNearbyPlace(index)}
                      className="text-red-500 hover:text-red-600 px-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
             <button
                type="button"
                onClick={handleAddNearbyPlace}
                className="text-blue-500 hover:text-blue-600 inline-flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add Another Place
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {formError}
              </div>
            )}

            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  } text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Property...
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Property
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-gray-600">
          <p>© 2024 LANDX.IN. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default CreatePropertyB;