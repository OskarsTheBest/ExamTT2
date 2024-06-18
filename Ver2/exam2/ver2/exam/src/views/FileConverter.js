import React, { useRef, useState, useContext } from 'react';
import AuthContext from '../components/AuthContext'; // Import the AuthContext
import Cookies from 'js-cookie'; // Import js-cookie

function FileConverter() {
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [outputName, setOutputName] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext); // Use AuthContext to check if the user is authenticated

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedFile(e.target.result);
      reader.readAsDataURL(selectedFile);
      setFile(selectedFile);
    }
  };

  const handleConvertAndDownload = async () => {
    if (!file) {
      setError('No file selected.');
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
    formData.append('file', file);
    formData.append('format', outputFormat);
    formData.append('name', outputName);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch('http://localhost:5000/api/convert-file', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });
      if (!response.ok) {
        throw new Error('Error processing file.');
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${outputName || 'converted_file'}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to convert file.');
    }
  };

  return (
    <div className="App">
      <h1>File Converter</h1>
      <div className="upload-container">
        {!uploadedFile && (
          <div className="file-upload" onClick={() => fileInputRef.current?.click()}>
            <label className="file-upload-label">Upload a file:</label>
            <input type="file" ref={fileInputRef} accept="*" onChange={handleFileChange} />
          </div>
        )}
        {uploadedFile && (
          <div className="file-preview visible">
            <p>Original File:</p>
            <div>{file.name}</div>
          </div>
        )}
      </div>
      <div className="conversion-panel">
        {uploadedFile && (
          <div className="options-container">
            <p>Choose conversion options:</p>
            <div className="option">
              <label htmlFor="outputFormat">Convert to:</label>
              <select id="outputFormat" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)}>
                <option value="pdf">PDF</option>
              </select>
            </div>

            <div className="option">
              <label htmlFor="outputName">Output Name:</label>
              <input type="text" id="outputName" placeholder="e.g., converted_file" value={outputName} onChange={(e) => setOutputName(e.target.value)} />
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

export default FileConverter;
