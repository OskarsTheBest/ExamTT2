import React, { useState } from 'react';
import axios from 'axios';

function VideoDownsizing() {
    const [file, setFile] = useState(null);
    const [resolution, setResolution] = useState('720p');
    const [error, setError] = useState(null);
    const [downloadLink, setDownloadLink] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setDownloadLink(null);
        setError(null);
    };

    const handleResolutionChange = (event) => {
        setResolution(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            setError('Please select a video file.');
            return;
        }

        const formData = new FormData();
        formData.append('video', file);
        formData.append('resolution', resolution);

        try {
            const response = await axios.post('http://localhost:5000/api/convert-video', formData, {
                responseType: 'blob',
            });

            const fileURL = window.URL.createObjectURL(new Blob([response.data]));
            const fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', `${file.name.split('.')[0]}_downsized.${file.name.split('.').pop()}`);
            document.body.appendChild(fileLink);
            fileLink.click();
            fileLink.parentNode.removeChild(fileLink);
            setDownloadLink(fileURL);
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Error uploading video.');
        }
    };

    return (
        <div className="text-black min-h-screen flex flex-col items-center py-8">
            <h1 className="text-3xl text-white font-bold mb-6">Video Downsizing Tool</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg">
                <div className="mb-4">
                    <label htmlFor="video" className="block text-lg font-medium text-gray-300">Upload Video:</label>
                    <input type="file" id="video" accept="video/*" onChange={handleFileChange} className="mt-1 block w-full px-3 py-2 border text-white border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <div className="mb-6">
                    <label htmlFor="resolution" className="block text-lg font-medium text-gray-300">Resolution:</label>
                    <select id="resolution" value={resolution} onChange={handleResolutionChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                        <option value="240p">240p</option>
                        <option value="144p">144p</option>
                    </select>
                </div>
                <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Downsize Video</button>
            </form>
            {error && <p style={{ color: '#ff0000' }}>{error}</p>}
            {downloadLink && (
                <div className="mt-4">
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">Download Downsized Video</a>
                </div>
            )}
        </div>
    );
}

export default VideoDownsizing;
