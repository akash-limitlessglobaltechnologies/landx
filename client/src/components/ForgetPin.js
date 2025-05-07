import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function ForgetPin() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPin, setNewPin] = useState('');
  const [step, setStep] = useState(1); // Step 1: Phone, Step 2: OTP, Step 3: New PIN
  const [message, setMessage] = useState('');
  const [tempToken, setTempToken] = useState(''); // Store the temporary token
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLandx = () => {
    navigate('/');
  };

  const handleRequestOTP = async () => {
    if (!phone) {
      setMessage('Please enter your phone number');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URI}/forget-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: `+${phone}`
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        setStep(2); // Move to OTP verification step
      } else {
        setMessage(data.message || 'Error sending OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      setMessage('Please enter the OTP');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URI}/forget-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          phoneNumber: `+${phone}`,
          code: otp
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message);
        if (data.tempToken) {
          setTempToken(data.tempToken); // Save the temp token for the next step
        }
        setStep(3); // Move to new PIN step
      } else {
        setMessage(data.message || 'Error verifying OTP');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPin = async () => {
    if (!newPin) {
      setMessage('Please enter your new PIN');
      return;
    }

    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setMessage('PIN must be a 4-digit number');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_URI}/forget-pin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': tempToken ? `Bearer ${tempToken}` : '' // Include the temp token
        },
        body: JSON.stringify({ 
          phoneNumber: `+${phone}`,
          newPin
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessage(data.message || 'PIN reset successful! You will be redirected to sign in page.');
        // Redirect to signin page after 3 seconds
        setTimeout(() => {
          navigate('/signin');
        }, 3000);
      } else {
        setMessage(data.message || 'Error resetting PIN');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-500 cursor-pointer" onClick={handleLandx}>LANDX.IN</h1>
        </div>
      </nav>

      <div className="relative bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-lg bg-opacity-95">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Reset PIN
          </h2>

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-blue-50 text-blue-800 text-center">
              {message}
            </div>
          )}

          {step === 1 && (
            <>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Phone Number
              </label>
              <PhoneInput
                country={'in'} 
                value={phone}
                onChange={setPhone}
                inputStyle={{
                  width: '100%',
                  height: '45px',
                  fontSize: '16px',
                  paddingLeft: '48px',
                  marginBottom: '24px',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0'
                }}
                containerStyle={{
                  marginBottom: '24px'
                }}
                buttonStyle={{
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem 0 0 0.5rem',
                  backgroundColor: 'white'
                }}
              />

              <button
                onClick={handleRequestOTP}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter the OTP sent to your phone"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg text-gray-700"
              />

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="newPin">
                New 4-Digit PIN
              </label>
              <input
                type="password"
                id="newPin"
                placeholder="Enter new 4-digit PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg text-gray-700"
                maxLength={4}
              />

              <button
                onClick={handleResetPin}
                disabled={isLoading}
                className={`w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Resetting...' : 'Reset PIN'}
              </button>
            </>
          )}

          <div className="text-center mt-6">
            <p className="text-gray-700">
              <Link to="/signin" className="text-blue-500 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="bg-gray-800 text-white py-4 text-center">
        <p>© 2024 LANDX.IN. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ForgetPin;