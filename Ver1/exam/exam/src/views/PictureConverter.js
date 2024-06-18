import React, { useRef, useState } from 'react';
import '../css/PictureConverter.css';

function PictureConverter() {
  const fileInputRef = useRef(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('png');
  const [outputWidth, setOutputWidth] = useState('');
  const [outputHeight, setOutputHeight] = useState('');
  const [outputName, setOutputName] = useState('');
  const [error, setError] = useState('');

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
    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', outputFormat);
    formData.append('width', outputWidth);
    formData.append('height', outputHeight);
    formData.append('name', outputName);

    try {
      const response = await fetch('http://localhost:5000/api/convert-image', {
        method: 'POST',
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
