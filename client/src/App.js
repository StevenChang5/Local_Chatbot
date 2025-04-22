import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './auth/Register';
import Login from './auth/Login';

import Home from './pages';
import Profile from './pages/profile'


function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
