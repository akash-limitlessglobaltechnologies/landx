import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/authContext';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function Signup() {
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLandx = () => {
    navigate('/');
  };

  const handleSendOtp = async () => {
    if (phone) {
      try {
        const response = await fetch(`${process.env.REACT_APP_URI}/signup`, {
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
          setOtpSent(true);
        } else {
          alert(data.message || 'Failed to send OTP');
        }
      } catch (error) {
        alert('Error sending OTP: ' + error.message);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp) {
      try {
        const response = await fetch(`${process.env.REACT_APP_URI}/signup`, {
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
          setOtpVerified(true);
        } else {
          alert(data.message || 'Invalid or expired OTP');
        }
      } catch (error) {
        alert('Error verifying OTP: ' + error.message);
      }
    }
  };

  const validatePins = () => {
    if (pin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return false;
    }
    if (pin !== confirmPin) {
      setPinError('PINs do not match');
      return false;
    }
    setPinError('');
    return true;
  };

  const handleSignup = async () => {
    if (!validatePins()) {
      return;
    }

    if (pin && username) {
      try {
        const response = await fetch(`${process.env.REACT_APP_URI}/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phoneNumber: `+${phone}`,
            pin,
            username 
          }),
        });

        const data = await response.json();
        if (response.ok) {
          login(data.token);
          navigate('/createproperty', { state: { properties: data.properties } });
        } else {
          alert(data.message || 'Error during signup');
        }
      } catch (error) {
        alert('Error during signup: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-500"  onClick={handleLandx}>LANDX.IN</h1>
        </div>
      </nav>

      <div className="relative bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-lg bg-opacity-95">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Sign Up
          </h2>

          {!otpSent ? (
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
                onClick={handleSendOtp}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Send OTP
              </button>
            </>
          ) : !otpVerified ? (
            <>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="otp">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg text-gray-700"
                maxLength={6}
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Verify OTP
              </button>
              <button
                onClick={() => {
                  setOtpSent(false);
                  setOtp('');
                }}
                className="w-full mt-4 bg-transparent border border-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Change Phone Number
              </button>
            </>
          ) : (
            <>
              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="username">
                Name
              </label>
              <input
                type="text"
                id="username"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg text-gray-700"
              />

              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="pin">
                Set 4-Digit login Pin for you account
              </label>
              <input
                type="password"
                id="pin"
                placeholder="Enter your 4-digit pin"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setPinError('');
                }}
                className="w-full px-4 py-3 mb-4 border border-gray-200 rounded-lg text-gray-700"
                maxLength={4}
                pattern="\d*"
              />

              <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="confirmPin">
                Confirm Pin 4_digit pin
              </label>
              <input
                type="password"
                id="confirmPin"
                placeholder="Confirm your 4-digit pin"
                value={confirmPin}
                onChange={(e) => {
                  setConfirmPin(e.target.value);
                  setPinError('');
                }}
                className="w-full px-4 py-3 mb-2 border border-gray-200 rounded-lg text-gray-700"
                maxLength={4}
                pattern="\d*"
              />

              {pinError && (
                <p className="text-red-500 text-sm mb-4">{pinError}</p>
              )}

              <button
                onClick={handleSignup}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Sign Up
              </button>
            </>
          )}
          
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Already have an account?{' '}
              <Link to="/signin" className="text-blue-500 hover:underline">
                Sign In
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

export default Signup;