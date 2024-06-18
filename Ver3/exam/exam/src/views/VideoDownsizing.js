import React, { useRef, useState, useContext } from 'react';
import AuthContext from '../components/AuthContext'; // Import the AuthContext
import Cookies from 'js-cookie'; // Import js-cookie

function VideoDownsizing() {
  const fileInputRef = useRef(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [video, setVideo] = useState(null);
  const [resolution, setResolution] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext); // Use AuthContext to check if the user is authenticated

  const handleVideoChange = (event) => {
    const selectedVideo = event.target.files[0];
    if (selectedVideo) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedVideo(e.target.result);
      reader.readAsDataURL(selectedVideo);
      setVideo(selectedVideo);
    }
  };

  const handleConvertAndDownload = async () => {
    if (!video || !resolution) {
      setError('No video or resolution selected.');
      return;
    }

    if (!isAuthenticated) {
      const usageCount = parseInt(Cookies.get('usageCount') || '0', 10);
      const lastUsed = Cookies.get('lastUsed');
      const now = new Date().getTime();
      const dayInMillis = 24 * 60 * 60 * 1000;

      if (lastUsed && now - lastUsed < dayInMillis && usageCount >= 5) {
        setError('You have reached the maximum number of uses for today. Please try again tomorrow.');
        return;
      }

      if (!lastUsed || now - lastUsed >= dayInMillis) {
        Cookies.set('usageCount', '1', { expires: 1 });
        Cookies.set('lastUsed', now, { expires: 1 });
      } else {
        Cookies.set('usageCount', (usageCount + 1).toString(), { expires: 1 });
      }
    }

    const formData = new FormData();
    formData.append('video', video);
    formData.append('resolution', resolution);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch('http://localhost:5000/api/downsize-video', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Error processing video.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `downsized_${video.name}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to downsize video.');
    }
  };

  return (
    <div className="App">
      <h1>Video Downsizing</h1>
      <div className="upload-container">
        {!uploadedVideo && (
          <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
            <label className="file-upload-label">Upload a video:</label>
            <input type="file" ref={fileInputRef} accept="video/mp4" onChange={handleVideoChange} />
          </div>
        )}
        {uploadedVideo && (
          <div className="file-preview visible">
            <p>Original Video:</p>
            <div>{video.name}</div>
          </div>
        )}
      </div>
      <div className="conversion-panel">
        {uploadedVideo && (
          <div className="options-container">
            <p>Choose resolution:</p>
            <div className="option">
              <label htmlFor="resolution">Resolution:</label>
              <select id="resolution" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                <option value="">Select resolution</option>
                <option value="nHD">640x360 (nHD)</option>
                <option value="FWVGA">854x480 (FWVGA)</option>
                <option value="qHD">960x540 (qHD)</option>
                <option value="WSVGA">1024x576 (WSVGA)</option>
                <option value="HD">1280x720 (HD)</option>
                <option value="FWXGA">1366x768 (FWXGA)</option>
                <option value="HD+">1600x900 (HD+)</option>
                <option value="FHD">1920x1080 (FHD)</option>
              </select>
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="button" onClick={handleConvertAndDownload}>
              Downsize & Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoDownsizing;
