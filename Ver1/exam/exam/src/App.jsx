/**
 * * Library imports
 */
// ? https://www.npmjs.com/package/react-router-dom
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Homepage/>} />
          <Route path="/about" element={<About/>} />
          <Route path="Picture-Converter" element={<PictureConverter/>}/>
          <Route path="/soon" element={<ComingSoon/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/video-downsizing" element={<VideoDownsizing/>}/>
          <Route path="/file-converter" element={<FileConverter/>}/>
        </Routes>
      </div>
      <Footer/>
    </Router>
    </AuthProvider>
  )
}

export default App
