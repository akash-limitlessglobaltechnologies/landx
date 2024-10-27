import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './components/Home';  // Import the Home component
import SignIn from './components/SignIn';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import Property from './components/Property';
import Createproperty from './components/Createproperty';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />  {/* Set Home as the default route */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/createproperty" element={<Createproperty />} />
        <Route path="/property/:id" element={<Property />} />
      </Routes>
    </Router>
  );
}

export default App;