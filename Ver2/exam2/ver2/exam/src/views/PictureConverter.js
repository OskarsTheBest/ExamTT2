import React, { useRef, useState, useContext } from 'react';
import '../css/PictureConverter.css';
import AuthContext from '../components/AuthContext'; // Import the AuthContext
import Cookies from 'js-cookie'; // Import js-cookie

function PictureConverter() {
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputWidth, setOutputWidth] = useState('');
  const [outputHeight, setOutputHeight] = useState('');
  const [outputName, setOutputName] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext); // Use AuthContext to check if the user is authenticated

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const validateNumber = (value, fieldName) => {
    if (value && isNaN(value)) {
      setError(`${fieldName} must be a number.`);
      return false;
    }
    const numericValue = parseInt(value, 10);
    if (numericValue < 0) {
      setError(`${fieldName} cannot be a negative value.`);
      return false;
    }
    return true;
  };

  const validateInputs = () => {
    setError('');
    return validateNumber(outputWidth, 'Width') && validateNumber(outputHeight, 'Height');
  };

  const handleConvertAndDownload = async () => {
    if (!file || !validateInputs()) {
      setError('No image file selected.');
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
    formData.append('image', file);
    formData.append('format', outputFormat);   
    formData.append('width', outputWidth);
    formData.append('height', outputHeight);
    formData.append('name', outputName);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch('http://localhost:5000/api/convert-image', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Error processing image.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${outputName || 'converted_image'}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
        // Update user history

    } catch (error) {
      setError('Failed to convert image.');
    }
  };

  return (
    <div className="App">
      <h1>Picture Converter</h1>
      <div className="upload-container">
        {!uploadedImage && (
          <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
            <label className="file-upload-label">Upload a picture (PNG, JPG, etc.):</label>
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleFileChange} />
          </div>
        )}
        {uploadedImage && (
          <div className="image-preview visible">
            <p>Original Image:</p>
            <img src={uploadedImage} className="original-image" alt="Original" />
          </div>
        )}
      </div>
      <div className="conversion-panel">
        {uploadedImage && (
          <div className="options-container">
            <p>Choose conversion options:</p>
            <div className="option">
              <label htmlFor="outputFormat">Convert to:</label>
              <select id="outputFormat" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                <option value="png">PNG</option>
                <option value="jpg">JPG</option>
              </select>
            </div>

            <div className="option">
              <label htmlFor="outputWidth">Width:</label>
              <input type="text" id="outputWidth" placeholder="e.g., 300" value={outputWidth} onChange={(e) => setOutputWidth(e.target.value)} />
            </div>

            <div className="option">
              <label htmlFor="outputHeight">Height:</label>
              <input type="text" id="outputHeight" placeholder="e.g., 200" value={outputHeight} onChange={(e) => setOutputHeight(e.target.value)} />
            </div>

            <div className="option">
              <label htmlFor="outputName">Output Name:</label>
              <input type="text" id="outputName" placeholder="e.g., converted_image" value={outputName} onChange={(e) => setOutputName(e.target.value)} />
            </div>

            {error && <p className="error-message">{error}</p>}

            <button className="button" onClick={handleConvertAndDownload}>
              Convert & Download
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PictureConverter;
