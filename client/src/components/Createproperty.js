import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  PropertyBasicInfo  from './PropertyBasicInfo';

import PropertyMeasurements from './PropertyMeasurements';

import SuccessAnimation from './SuccessAnimation';
import PropertySummary from './PropertySummary';
import { PropertyLocation } from './PropertyLocation';



const CreateProperty = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  

  const handleLandx = () => {
    navigate('/dashboard');
  };
  // Basic Info State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState(['']);
  
  // Location State
  const [locationLink, setLocationLink] = useState('');
  
  // Measurements State
  const [measurements, setMeasurements] = useState({
    frontage: '',
    backWidth: '',
    leftDepth: '',
    rightDepth: '',
  });
  const [unit, setUnit] = useState('feet');
  const [direction, setDirection] = useState('');
  const [area, setArea] = useState(0);

  const handleNext = () => {
    setFormError('');
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setFormError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        setFormError('Please login to create a property');
        return;
      }

      const propertyData = {
        title: title || '',
        rawJson: {
          description: description || '',
          price: price ? Number(price) : 0,
          features: features || [],
          nearbyPlaces: (nearbyPlaces || []).filter(place => place.trim()),
          measurements: {
            frontage: measurements.frontage || '0',
            backWidth: measurements.backWidth || measurements.frontage || '0',
            leftDepth: measurements.leftDepth || '0',
            rightDepth: measurements.rightDepth || measurements.leftDepth || '0',
          },
          unit: unit || 'feet',
          direction: direction || '',
          area: area || 0,
          locationLink: locationLink || ''
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PropertyBasicInfo
            title={title}
            setTitle={setTitle}
            description={description}
            setDescription={setDescription}
            price={price}
            setPrice={setPrice}
            features={features}
            setFeatures={setFeatures}
            nearbyPlaces={nearbyPlaces}
            setNearbyPlaces={setNearbyPlaces}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <PropertyLocation
            locationLink={locationLink}
            setLocationLink={setLocationLink}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <PropertyMeasurements
            measurements={measurements}
            setMeasurements={setMeasurements}
            unit={unit}
            setUnit={setUnit}
            direction={direction}
            setDirection={setDirection}
            area={area}
            setArea={setArea}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 4:
        return (
          <PropertySummary
            propertyData={{
              title, description, price, features, nearbyPlaces,
              locationLink, measurements, unit, direction, area
            }}
          />
        );
      default:
        return null;
    }
  };

  if (showSuccess) {
    return <SuccessAnimation />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-500" onClick={handleLandx}>LANDX.IN</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    currentStep >= step ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {step === 1 && 'Details'}
                    {step === 2 && 'Location'}
                    {step === 3 && 'Measurements'}
                    {step === 4 && 'Summary'}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative mt-2">
              <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full">
                <div 
                  className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-300"
                  style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-8">Create Your Property</h2>
          
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
              {formError}
            </div>
          )}

          {renderStep()}

          {currentStep === 4 && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={handlePrevious}
                className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                Previous
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`${
                  loading 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white px-8 py-2 rounded-md transition-colors flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating...
                  </>
                ) : (
                  'Create Property'
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-center mt-16">
        <p>© 2024 LANDX.IN. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CreateProperty;