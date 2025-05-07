import React from 'react';

const SuccessAnimation = () => {
  return (
    <div 
      className="fixed inset-0 bg-white flex items-center justify-center z-50"
      style={{
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <div className="text-center">
        <div className="mb-4 relative">
          <div 
            className="mx-auto h-16 w-16 relative"
            style={{
              animation: 'scaleIn 0.5s ease-out forwards'
            }}
          >
            <div className="relative">
              {/* Circle background */}
              <div 
                className="absolute inset-0 rounded-full bg-green-100"
                style={{
                  animation: 'pulseScale 2s infinite'
                }}
              />
              
              {/* Checkmark */}
              <svg
                className="relative h-16 w-16 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{
                  animation: 'drawCheck 0.5s ease-out forwards 0.2s'
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                  style={{
                    strokeDasharray: 50,
                    strokeDashoffset: 50
                  }}
                />
              </svg>
            </div>
          </div>
        </div>
        
        <h2 
          className="text-2xl font-bold text-gray-900 mb-2"
          style={{
            animation: 'slideUp 0.5s ease-out forwards 0.3s',
            opacity: 0,
            transform: 'translateY(10px)'
          }}
        >
          Property Created Successfully!
        </h2>
        
        <p 
          className="text-gray-600"
          style={{
            animation: 'slideUp 0.5s ease-out forwards 0.4s',
            opacity: 0,
            transform: 'translateY(10px)'
          }}
        >
          Redirecting to dashboard
          <span className="inline-block" style={{ animation: 'dots 1.5s infinite' }}>...</span>
        </p>

        <style jsx="true">{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @keyframes pulseScale {
            0% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.2); opacity: 0.1; }
            100% { transform: scale(1); opacity: 0.3; }
          }

          @keyframes drawCheck {
            from { stroke-dashoffset: 50; }
            to { stroke-dashoffset: 0; }
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dots {
            0% { transform: translateY(0); }
            25% { transform: translateY(-2px); }
            50% { transform: translateY(0); }
            75% { transform: translateY(-2px); }
            100% { transform: translateY(0); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SuccessAnimation;