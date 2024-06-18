/**
 * * Library imports
 */
// ? https://www.npmjs.com/package/react-router-dom
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import React, { useState, useEffect } from 'react';
/**
 * * Route/Component imports
 */
import Homepage from './views/Home'
import Navbar from './components/Navbar'
import About from './views/About'
import PictureConverter from './views/PictureConverter';
import ComingSoon from './views/ComingSoon';
import Footer from './components/Footer';
import Login from './views/Login';
import Register from './views/Register';
import VideoDownsizing from './views/VideoDownsizing';
import FileConverter from './views/FileConverter';
import History from './views/History';
import { AuthProvider } from './components/AuthContext';
import AdminPage from './views/AdminPage';

function App() {
  //admin logic
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setLoggedIn(true);
      setIsAdmin(decodedToken.isAdmin);
    }
  }, []);
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="picture-converter" element={<PictureConverter/>}/>
          <Route path="/soon" element={<ComingSoon/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/video-downsizing" element={<VideoDownsizing/>}/>
          <Route path="/file-converter" element={<FileConverter/>}/>
          <Route path="/history" element={<History/>}/>
          {loggedIn && isAdmin && <Route path="/admin" element={<AdminPage />} />}
        </Routes>
      </div>
      <Footer/>
    </Router>
    </AuthProvider>
  )
}

export default App
