import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import VocabBank from './components/VocabBank';
import Watching from './components/Watching';
import './App.css';

const RedirectToProperPage = () => {
  const token = localStorage.getItem('token');
  return token ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/vocab-bank" element={<VocabBank />} />
        <Route path="/watching" element={<Watching />} />
        <Route path="/" element={<RedirectToProperPage />} />
      </Routes>
    </Router>
  );
}

export default App;
