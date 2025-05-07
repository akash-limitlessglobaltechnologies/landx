import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Helper function to extract src URL from iframe string
const extractSrcFromIframe = (iframeString) => {
  if (!iframeString) return '';
  const srcMatch = iframeString.match(/src="([^"]+)"/);
  return srcMatch ? srcMatch[1] : '';
};

const PropertySummary = ({ propertyData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [copySuccess, setCopySuccess] = useState(false);

  // Get the full URL of the current page
  const currentUrl = window.location.origin + location.pathname;

  const {
    title,
    description,
    price,
    features,
    nearbyPlaces,
    measurements,
    unit,
    direction,
    area,
    locationLink
  } = propertyData;

  // Extract the src URL from the iframe string
  const locationSrc = extractSrcFromIframe(locationLink);

  const directions = {
    'N': 'North Facing',
    'NE': 'North-East Facing',
    'E': 'East Facing',
    'SE': 'South-East Facing',
    'S': 'South Facing',
    'SW': 'South-West Facing',
    'W': 'West Facing',
    'NW': 'North-West Facing'
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopySuccess(true);
      
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsAppShare = () => {
    const encodedUrl = encodeURIComponent(currentUrl);
    const whatsappUrl = `https://web.whatsapp.com/send?text=Check out this property: ${encodedUrl}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderSection = (title, content) => (
    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">{content}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto">
        {/* Navigation and Share Buttons */}
        <div className="flex flex-wrap justify-between items-center mb-6">
          {/* Left side - Back Button */}
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

          {/* Right side - Share Buttons */}
          <div className="flex gap-3">
            {/* Copy Link Button */}
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

            {/* WhatsApp Share Button */}
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

        {/* Success Message Popup */}
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

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>

          <div className="p-6">
            {/* Basic Information */}
            {renderSection("Description",
              <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            )}

            {renderSection("Price",
              <p className="text-2xl font-bold text-green-600">
                ₹{Number(price).toLocaleString()}
              </p>
            )}

            {/* Features */}
            {features?.length > 0 && renderSection("Features",
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Measurements */}
            {renderSection("Property Dimensions",
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Front Width:</span>
                    <span className="font-medium">{measurements.frontage} {unit}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Back Width:</span>
                    <span className="font-medium">{measurements.backWidth || measurements.frontage} {unit}</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600">Left Depth:</span>
                    <span className="font-medium">{measurements.leftDepth} {unit}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600">Right Depth:</span>
                    <span className="font-medium">{measurements.rightDepth || measurements.leftDepth} {unit}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Area and Direction */}
            {renderSection("Additional Details",
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Total Area</p>
                  <p className="text-xl font-bold text-blue-800">{area} sq. {unit}</p>
                </div>
                {direction && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">Direction</p>
                    <p className="text-xl font-bold text-green-800">{directions[direction]}</p>
                  </div>
                )}
              </div>
            )}

            {/* Nearby Places */}
            {nearbyPlaces?.length > 0 && renderSection("Nearby Places",
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {nearbyPlaces.filter(place => place.trim()).map((place, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{place}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Location Map */}
            {locationSrc && renderSection("Location",
              <div className="w-full h-96 rounded-lg overflow-hidden border border-gray-200">
                <iframe
                  src={locationSrc}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="Property Location"
                  className="rounded-lg"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>
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
};

export default PropertySummary;