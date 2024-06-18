import React, { useState } from 'react';
import '../css/About.css';
import imagesizing from '../static/pictureconv.png';
import fileconv from '../static/fileconv.png';
import videoconv from '../static/videoconv.png';

const toolData = {
  'Image sizing': {
    imgSrc: imagesizing,
    subtext: 'Resize your images with ease.'
  },
  'Video converting': {
    imgSrc: fileconv,
    subtext: 'Convert videos between formats.'
  },
  'File converting': {
    imgSrc: videoconv,
    subtext: 'Transform file types quickly.'
  },
};

function About() {
  const [selectedTool, setSelectedTool] = useState(null);

  const handleToolClick = (toolName) => {
    setSelectedTool(toolName);
  };
  const handleCloseModal = () => {
    setSelectedTool(null);
  };
  return (
    <div className='About-Page'>
      <div className='About'>
        <div className='About-inner'>
          <h1>About This Page</h1>
          <p className='About-txt'>
            I was frustrated by having to use multiple sites to do simple file and item conversions.
          </p>
          <div className='About-tools'>
            <h3>Here are some tools I am creating:</h3>
            {Object.keys(toolData).map((toolName) => (
              <span key={toolName} onClick={() => handleToolClick(toolName)}>
                {toolName}
              </span>
            ))}
          </div>
        </div>
        {selectedTool && (
          <div className='Modal'>
            <div className='Modal-content'>
              <span className='Close' onClick={handleCloseModal}>&times;</span>
              <img src={toolData[selectedTool].imgSrc} alt={selectedTool} />
              <p>{toolData[selectedTool].subtext}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default About;
