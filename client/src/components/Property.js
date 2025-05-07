import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import PropertyDetails from './PropertyDetails';

const extractSrcFromIframe = (iframeString) => {
  if (!iframeString) return '';
  const srcMatch = iframeString.match(/src="([^"]+)"/);
  return srcMatch ? srcMatch[1] : '';
};

function Property() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  
  const [copySuccess, setCopySuccess] = useState(false);
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

  // Get the full URL of the current page
  const currentUrl = window.location.origin + location.pathname;

  // Fetch property data
  const fetchProperty = async (pinCode = '') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setLoading(false);
        return;
      }

      let url = `${process.env.REACT_APP_URI}/fetch-properties/${id}`;
      if (pinCode) {
        url += `?pin=${pinCode}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      // Check response status
      if (!response.ok) {
        if (response.status === 403 && data.secure) {
          setPinError('');
          setLoading(false);
          return;
        }
        if (response.status === 401) {
          setPinError('Invalid access code. Please try again.');
          setLoading(false);
          return;
        }
        throw new Error(data.message || 'Error fetching property');
      }

      // If we got here, we have valid property data
      setProperty(data);
      setLoading(false);
      setPinError('');
    } catch (error) {
      setError(error.message || 'Error fetching property details');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) {
      setPinError('Please enter a 4-digit access code');
      return;
    }
    setLoading(true);
    await fetchProperty(pin);
  };

  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  }, [currentUrl]);

  const handleWhatsAppShare = useCallback(() => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const whatsappUrl = `https://web.whatsapp.com/send?text=Check out this property: ${encodedUrl}`;
    window.open(whatsappUrl, '_blank');
  }, [currentUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // If we have property data, show it
  if (property) {
    const propertyData = {
      ...property,
      measurements: property.rawJson?.measurements || {},
      features: property.rawJson?.features || [],
      nearbyPlaces: property.rawJson?.nearbyPlaces || [],
      direction: property.rawJson?.direction || 'N',
      area: property.rawJson?.area || '',
      unit: property.rawJson?.unit || 'feet',
      locationLink: extractSrcFromIframe(property.rawJson?.locationLink || ''),
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              Back to Dashboard
            </button>

            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>

              <button
                onClick={handleWhatsAppShare}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                <svg 
                  className="h-5 w-5" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Share on WhatsApp
              </button>
            </div>
          </div>

          {copySuccess && (
            <div
              className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg"
              style={{
                animation: 'fadeInOut 2s ease-in-out'
              }}
            >
              Link copied to clipboard!
            </div>
          )}

          <PropertyDetails propertyData={propertyData} />
        </div>

        <style>{`
          @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(20px); }
            10% { opacity: 1; transform: translateY(0); }
            90% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(20px); }
          }
        `}</style>
      </div>
    );
  }

  // If no property and no error, show pin input
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Access Required</h2>
          <p className="text-gray-600 mt-2">Please enter the 4-digit access code to view this property</p>
        </div>

        <form onSubmit={handlePinSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="number"
              inputMode="numeric"
              placeholder="Enter access code"
              value={pin}
              onChange={(e) => {
                const value = e.target.value.slice(0, 4);
                setPin(value);
                setPinError('');
              }}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
            {pinError && (
              <p className="text-red-500 text-sm mt-2 text-center">{pinError}</p>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Property;