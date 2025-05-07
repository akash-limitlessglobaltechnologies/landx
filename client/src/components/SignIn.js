import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/authContext';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

function Signin() {
  console.log("hye",process.env.REACT_APP_URI)
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();


  const handleLandx = () => {
    navigate('/');
  };

  const handleSignin = async () => {
    if (phone && pin) {
      try {
      
        const response = await fetch(`${process.env.REACT_APP_URI}/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            phoneNumber: `+${phone}`, // phone will already include country code
            pin 
          }),
        });

        const data = await response.json();
        if (response.ok) {
          login(data.token);
          navigate('/dashboard', { state: { properties: data.properties } });
        } else {
          alert(data.message || 'Error logging in');
        }
      } catch (error) {
        alert('An error occurred: ' + error.message);
      }
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="p-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-blue-500" onClick={handleLandx}>LANDX.IN</h1>
        </div>
      </nav>

      <div className="relative bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full backdrop-blur-lg bg-opacity-95">
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
            Sign In
          </h2>

          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Phone Number
          </label>
          <PhoneInput
            country={'in'} // Default country
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

          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="pin">
            4-Digit Pin
          </label>
          <input
            type="password"
            id="pin"
            placeholder="Enter your 4-digit pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full px-4 py-3 mb-6 border border-gray-200 rounded-lg text-gray-700"
            maxLength={4}
          />

          <button
            onClick={handleSignin}
            className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>

          <div className="text-center mt-4">
            <Link to="/forget-pin" className="text-blue-500 hover:underline text-sm">
              Forgot PIN?
            </Link>
          </div>

          <div className="text-center mt-4">
            <p className="text-gray-700">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Sign Up
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

export default Signin;