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
            const response = await axios.post('http://localhost:5000/api/convert-video', formData);

            setDownloadLink(response.data.url);
        } catch (error) {
            console.error('Error uploading video:', error);
            setError('Error uploading video.');
        }
    };

    return (
        <div>
            <h1>Video Downsizing Tool</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="video">Upload Video:</label>
                    <input type="file" id="video" accept="video/*" onChange={handleFileChange} />
                </div>
                <div>
                    <label htmlFor="resolution">Resolution:</label>
                    <select id="resolution" value={resolution} onChange={handleResolutionChange}>
                        <option value="1080p">1080p</option>
                        <option value="720p">720p</option>
                        <option value="480p">480p</option>
                        <option value="360p">360p</option>
                        <option value="240p">240p</option>
                        <option value="144p">144p</option>
                    </select>
                </div>
                <button type="submit">Downsize Video</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {downloadLink && (
                <div>
                    <a href={downloadLink} target="_blank" rel="noopener noreferrer">Download Downsized Video</a>
                </div>
            )}
        </div>
    );
}

export default VideoDownsizing;
