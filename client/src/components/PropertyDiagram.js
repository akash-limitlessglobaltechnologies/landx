import React from 'react';

const PropertyDiagram = ({ measurements, unit }) => {
  return (
    <div className="relative w-full max-w-2xl mx-auto mt-8">
      <svg 
        viewBox="0 0 400 500"
        className="w-full h-auto border border-gray-200 rounded-lg bg-white"
      >
        {/* Main plot */}
        <rect
          x="50"
          y="50"
          width="300"
          height="300"
          fill="#f0f9ff"
          stroke="blue"
          strokeWidth="3"
        />
        
        {/* Width measurement */}
        <line x1="40" y1="30" x2="360" y2="30" stroke="blue" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <text x="200" y="25" textAnchor="middle" fill="#1a56db" fontSize="14">
          {measurements.frontage} {unit}
        </text>
        
        {/* Left depth measurement */}
        <line x1="30" y1="40" x2="30" y2="360" stroke="blue" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
        <text 
          x="20" 
          y="200" 
          textAnchor="middle" 
          transform="rotate(-90, 20, 200)"
          fill="#1a56db"
          fontSize="14"
        >
          {measurements.leftDepth} {unit}
        </text>

        {/* Right side measurement if provided */}
        {measurements.rightDepth && (
          <>
            <line x1="370" y1="40" x2="370" y2="360" stroke="blue" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
            <text 
              x="380" 
              y="200" 
              textAnchor="middle" 
              transform="rotate(90, 380, 200)"
              fill="#1a56db"
              fontSize="14"
            >
              {measurements.rightDepth} {unit}
            </text>
          </>
        )}

        {/* Back width if provided */}
        {measurements.backWidth && (
          <>
            <line x1="40" y1="370" x2="360" y2="370" stroke="blue" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
            <text x="200" y="385" textAnchor="middle" fill="#1a56db" fontSize="14">
              {measurements.backWidth} {unit}
            </text>
          </>
        )}

        {/* Road */}
        <g transform="translate(0, 400)">
          <rect width="400" height="60" fill="#94a3b8" />
          <line x1="20" y1="30" x2="380" y2="30" stroke="white" strokeWidth="4" strokeDasharray="20,20" />
          <text x="200" y="50" textAnchor="middle" fill="white" fontSize="14">ROAD</text>
        </g>

        {/* Direction compass */}
        <g transform="translate(350, 440)">
          <circle cx="0" cy="0" r="20" fill="white" stroke="#1a56db" strokeWidth="2" />
          <text x="0" y="-5" textAnchor="middle" fill="#1a56db" fontSize="14" fontWeight="bold">N</text>
          <polygon points="0,-15 -5,-8 5,-8" fill="#1a56db" />
        </g>

        {/* Markers for arrows */}
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="blue" />
          </marker>
        </defs>
      </svg>
    </div>
  );
};

export default PropertyDiagram;