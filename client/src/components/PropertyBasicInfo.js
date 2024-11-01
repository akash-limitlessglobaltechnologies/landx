import React from 'react';

export const PropertyBasicInfo = ({
  title, setTitle,
  description, setDescription,
  price, setPrice,
  features, setFeatures,
  nearbyPlaces, setNearbyPlaces,
  onNext
}) => {
  const commonFeatures = [
    'Corner Plot',
    'Park Facing',
    'Main Road',
    'Water Connection',
    'Electricity',
    'Gated Community',
    'Ready for Construction',
    'Security',
    'Street Lights'
  ];

  const handleFeatureToggle = (feature) => {
    setFeatures(features.includes(feature)
      ? features.filter(f => f !== feature)
      : [...features, feature]
    );
  };

  const handleAddNearbyPlace = () => {
    setNearbyPlaces([...nearbyPlaces, '']);
  };

  const handleNearbyPlaceChange = (index, value) => {
    const updatedPlaces = [...nearbyPlaces];
    updatedPlaces[index] = value;
    setNearbyPlaces(updatedPlaces);
  };

  const handleRemoveNearbyPlace = (index) => {
    setNearbyPlaces(nearbyPlaces.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Property Title
          <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter property title"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            !title && 'border-gray-300 '
          }`}
          required
        />
        {!title && (
          <p className="mt-1 text-sm text-gray-700">
            Please enter a property title
          </p>
        )}
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Description
          <span className="text-gray-400 ml-1">(Optional)</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your property"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Price (₹)
          <span className="text-gray-400 ml-1">(Optional)</span>
        </label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter property price"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Features
          <span className="text-gray-400 ml-1">(Optional)</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {commonFeatures.map((feature) => (
            <label key={feature} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={features.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
                className="rounded text-blue-500"
              />
              <span className="text-sm">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Nearby Places
          <span className="text-gray-400 ml-1">(Optional)</span>
        </label>
        {nearbyPlaces.map((place, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={place}
              onChange={(e) => handleNearbyPlaceChange(index, e.target.value)}
              placeholder="Enter nearby place"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            {index > 0 && (
              <button
                onClick={() => handleRemoveNearbyPlace(index)}
                type="button"
                className="px-3 py-2 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          onClick={handleAddNearbyPlace}
          type="button"
          className="text-blue-500 hover:text-blue-600 mt-2"
        >
          + Add Another Place
        </button>
      </div>

      <div className="flex justify-between mt-6">
        <div className="text-sm text-gray-500">
          * Required field
        </div>
        <button
          onClick={onNext}
          disabled={!title}
          type="button"
          className={`px-6 py-2 rounded-md transition-colors ${
            title 
              ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyBasicInfo;