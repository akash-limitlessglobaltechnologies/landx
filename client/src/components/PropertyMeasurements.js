import React from 'react';
import PropertyDiagram from './PropertyDiagram';


const PropertyMeasurements = ({
  measurements,
  setMeasurements,
  unit,
  setUnit,
  direction,
  setDirection,
  area,
  onNext,
  onPrevious
}) => {
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

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-gray-700 text-sm font-semibold mb-2">
          Plot Measurements *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Front Width *</label>
            <input
              type="number"
              value={measurements.frontage}
              onChange={(e) => setMeasurements({...measurements, frontage: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Front width"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Back Width</label>
            <input
              type="number"
              value={measurements.backWidth}
              onChange={(e) => setMeasurements({...measurements, backWidth: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Back width (optional)"
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Left Depth *</label>
            <input
              type="number"
              value={measurements.leftDepth}
              onChange={(e) => setMeasurements({...measurements, leftDepth: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Left side depth"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Right Depth</label>
            <input
              type="number"
              value={measurements.rightDepth}
              onChange={(e) => setMeasurements({...measurements, rightDepth: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Right side depth (optional)"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Unit of Measurement
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="feet">Feet</option>
            <option value="meters">Meters</option>
            <option value="yards">Yards</option>
            <option value="gaj">Gaj</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Plot Direction
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
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

      {measurements.frontage && measurements.leftDepth && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Plot Diagram</h3>
          <PropertyDiagram measurements={measurements} unit={unit} />
          <p className="mt-4 text-center text-gray-600">
            Total Area: {area} square {unit}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-6">
        <button
          onClick={onPrevious}
          className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={!measurements.frontage || !measurements.leftDepth}
          className={`${
            measurements.frontage && measurements.leftDepth
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-gray-400 cursor-not-allowed'
          } text-white px-6 py-2 rounded-md transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PropertyMeasurements;