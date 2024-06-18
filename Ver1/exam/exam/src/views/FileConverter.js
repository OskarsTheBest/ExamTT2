import React, { useState } from 'react';
import axios from 'axios';

function FileConverter() {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileConvert = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', 'pdf');
    formData.append('name', file.name.split('.')[0]); // Assuming the file has an extension

    try {
      const response = await axios.post('http://localhost:5000/api/convert-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // Important: indicates that the response should be treated as a Blob
      });

      // Create a URL for the blob object
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      // Create a link to download the file
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', `${file.name.split('.')[0]}.pdf`);
      document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.parentNode.removeChild(fileLink);
    } catch (error) {
      console.error('Error converting file:', error);
      alert('Failed to convert file.');
    }
  };

  return (
    <div>
      <h1>Convert File to PDF</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileConvert}>Convert to PDF</button>
    </div>
  );
}

export default FileConverter;
