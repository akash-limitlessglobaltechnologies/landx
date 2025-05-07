// PropertyDetails.js
import React from 'react';
import PropertyDiagram from './PropertyDiagram';

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

const PropertyDetails = ({ propertyData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Property Details */}
      <div className="lg:col-span-2 space-y-6">
        {/* Basic Details */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{propertyData.title}</h1>
          <p className="text-gray-600 mb-4">{propertyData.rawJson?.description}</p>
          <p className="text-2xl font-bold text-blue-600">
            {propertyData.rawJson?.price ? `₹${propertyData.rawJson.price.toLocaleString()}` : 'Price on request'}
          </p>
        </div>

        {/* Property Measurements */}
        {propertyData.measurements && Object.keys(propertyData.measurements).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Measurements</h2>
            <div className="mb-6">
              <PropertyDiagram 
                measurements={propertyData.measurements}
                unit={propertyData.unit}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Front Width</p>
                <p className="font-semibold">{propertyData.measurements.frontage} {propertyData.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Back Width</p>
                <p className="font-semibold">{propertyData.measurements.backWidth} {propertyData.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Left Depth</p>
                <p className="font-semibold">{propertyData.measurements.leftDepth} {propertyData.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Right Depth</p>
                <p className="font-semibold">{propertyData.measurements.rightDepth} {propertyData.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Area</p>
                <p className="font-semibold">{propertyData.area} square {propertyData.unit}</p>
              </div>
              <div>
                <p className="text-gray-600">Direction</p>
                <p className="font-semibold">{directions[propertyData.direction]}</p>
              </div>
            </div>
          </div>
        )}

        {/* Features */}
        {propertyData.features?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Features</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {propertyData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nearby Places */}
        {propertyData.nearbyPlaces?.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Nearby Places</h2>
            <div className="grid grid-cols-2 gap-4">
              {propertyData.nearbyPlaces.map((place, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{place}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Map */}
      {propertyData.locationLink && (
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <iframe
                src={propertyData.locationLink}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Property Location"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;